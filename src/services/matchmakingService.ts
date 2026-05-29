import apiClient from '@/utils/api';
import { TOKEN_STORAGE_KEYS } from '@/constants';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  setMatchmakingSocketHandlers,
} from '@/socket';
import type { ApiResponse } from '@/types/common/api';
import {
  JoinMatchmakingData,
  CancelMatchmakingData,
  MatchmakingStatusData,
  MatchmakingStatsData,
} from '@/types/matchmaking';

class MatchmakingService {
  private connectPromise: Promise<void> | null = null;
  private eventHandlers: Map<string, ((data: unknown) => void)[]> = new Map();
  private isManualDisconnect = false;
  private connectionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    setMatchmakingSocketHandlers({
      onConnect: data => this.emit('connect', data),
      onConnected: data => this.emit('connected', data),
      onError: error => this.emit('error', error),
      onMatchFound: data => this.emit('match_found', data),
      onOpponentDisconnected: data => this.emit('opponent_disconnected', data),
      onOpponentLeft: data => this.emit('opponent_left', data),
      onRoomJoined: data => this.emit('room_joined', data),
      onRoomLeft: data => this.emit('room_left', data),
      onDisconnect: () => {
        this.connectPromise = null;
        this.clearConnectionTimeout();
        if (!this.isManualDisconnect) {
          this.emit('disconnect', {});
        }
        this.isManualDisconnect = false;
      },
    });
  }

  connect(): Promise<void> {
    const socket = getSocket();
    if (socket?.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      return Promise.reject(new Error('No authentication token found'));
    }

    const activeSocket = connectSocket(token);

    this.connectPromise = new Promise((resolve, reject) => {
      if (activeSocket.connected) {
        this.connectPromise = null;
        resolve();
        return;
      }

      this.clearConnectionTimeout();
      this.connectionTimeoutId = setTimeout(() => {
        if (!getSocket()?.connected) {
          disconnectSocket();
          this.connectPromise = null;
          reject(new Error('Connection timeout'));
        }
      }, 10000);

      const handleConnect = () => {
        activeSocket.off('connect_error', handleConnectError);
        this.clearConnectionTimeout();
        this.connectPromise = null;
        console.log('[MatchmakingService] WebSocket connected');
        resolve();
      };

      const handleConnectError = (error: unknown) => {
        activeSocket.off('connect', handleConnect);
        this.clearConnectionTimeout();
        this.connectPromise = null;
        console.error('[MatchmakingService] Connection error:', error);
        reject(error);
      };

      activeSocket.once('connect', handleConnect);
      activeSocket.once('connect_error', handleConnectError);
    });

    return this.connectPromise;
  }

  disconnect(): void {
    this.isManualDisconnect = true;
    this.clearConnectionTimeout();
    this.connectPromise = null;
    disconnectSocket();
  }

  isConnected(): boolean {
    return getSocket()?.connected || false;
  }

  hasSocket(): boolean {
    return getSocket() !== null;
  }

  on(event: string, handler: (data: unknown) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.push(handler);
    }
  }

  off(event: string, handler: (data: unknown) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
  }

  joinMatchmaking(): Promise<ApiResponse<JoinMatchmakingData>> {
    return apiClient.post<ApiResponse<JoinMatchmakingData>>(
      '/matchmaking/join'
    );
  }

  cancelMatchmaking(): Promise<ApiResponse<CancelMatchmakingData>> {
    return apiClient.post<ApiResponse<CancelMatchmakingData>>(
      '/matchmaking/cancel'
    );
  }

  getStatus(): Promise<ApiResponse<MatchmakingStatusData>> {
    return apiClient.get<ApiResponse<MatchmakingStatusData>>(
      '/matchmaking/status'
    );
  }

  getStats(): Promise<ApiResponse<MatchmakingStatsData>> {
    return apiClient.get<ApiResponse<MatchmakingStatsData>>(
      '/matchmaking/stats'
    );
  }

  joinRoom(roomId: string): void {
    const socket = getSocket();
    if (!socket) {
      throw new Error('WebSocket not connected');
    }
    socket.emit('join_room', { roomId });
  }

  leaveRoom(): void {
    const socket = getSocket();
    if (!socket) {
      throw new Error('WebSocket not connected');
    }
    socket.emit('leave_room');
  }

  async leaveRoomAPI(roomId: string): Promise<void> {
    await apiClient.post(`/rooms/${roomId}/leave`);
  }
}

export const matchmakingService = new MatchmakingService();
