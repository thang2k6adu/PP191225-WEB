import { io, Socket } from 'socket.io-client';
import apiClient from '@/utils/api';
import { TOKEN_STORAGE_KEYS } from '@/constants';
import {
  JoinMatchmakingResponse,
  CancelMatchmakingResponse,
  GetStatusResponse,
  GetStatsResponse,
} from '@/types/matchmaking';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const WEBSOCKET_URL = API_BASE_URL.replace('/api', '');

class MatchmakingService {
  private socket: Socket | null = null;
  private connectPromise: Promise<void> | null = null;
  private eventHandlers: Map<string, ((data: unknown) => void)[]> = new Map();
  private isManualDisconnect = false;
  private connectionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  connect(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      return Promise.reject(new Error('No authentication token found'));
    }

    if (this.socket) {
      this.socket.auth = { token };
      this.socket.connect();
    } else {
      this.socket = io(`${WEBSOCKET_URL}/matchmaking`, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'] as const,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.registerSocketListeners(this.socket);
    }

    this.connectPromise = new Promise((resolve, reject) => {
      if (!this.socket) {
        this.connectPromise = null;
        reject(new Error('Socket initialization failed'));
        return;
      }

      if (this.socket.connected) {
        this.connectPromise = null;
        resolve();
        return;
      }

      this.clearConnectionTimeout();
      this.connectionTimeoutId = setTimeout(() => {
        if (!this.socket?.connected) {
          this.socket?.disconnect();
          this.connectPromise = null;
          reject(new Error('Connection timeout'));
        }
      }, 10000);

      const handleConnect = () => {
        this.socket?.off('connect_error', handleConnectError);
        this.clearConnectionTimeout();
        this.connectPromise = null;
        console.log('[MatchmakingService] WebSocket connected');
        resolve();
      };

      const handleConnectError = (error: unknown) => {
        this.socket?.off('connect', handleConnect);
        this.clearConnectionTimeout();
        this.connectPromise = null;
        console.error('[MatchmakingService] Connection error:', error);
        reject(error);
      };

      this.socket.once('connect', handleConnect);
      this.socket.once('connect_error', handleConnectError);
    });

    return this.connectPromise;
  }

  disconnect(): void {
    if (this.socket) {
      this.isManualDisconnect = true;
      this.clearConnectionTimeout();
      this.connectPromise = null;
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
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

  private registerSocketListeners(socket: Socket): void {
    socket.on('connected', (data: unknown) => {
      console.log('[MatchmakingService] Connected event:', data);
    });

    socket.on('error', (error: unknown) => {
      console.error('[MatchmakingService] Error:', error);
      this.emit('error', error);
    });

    socket.on('match_found', (data: unknown) => {
      console.log('[MatchmakingService] Match found:', data);
      this.emit('match_found', data);
    });

    socket.on('opponent_disconnected', (data: unknown) => {
      console.log('[MatchmakingService] Opponent disconnected:', data);
      this.emit('opponent_disconnected', data);
    });

    socket.on('opponent_left', (data: unknown) => {
      console.log('[MatchmakingService] Opponent left:', data);
      this.emit('opponent_left', data);
    });

    socket.on('room_joined', (data: unknown) => {
      console.log('[MatchmakingService] Room joined:', data);
      this.emit('room_joined', data);
    });

    socket.on('room_left', (data: unknown) => {
      console.log('[MatchmakingService] Room left:', data);
      this.emit('room_left', data);
    });

    socket.on('disconnect', () => {
      console.log('[MatchmakingService] WebSocket disconnected');
      this.connectPromise = null;
      this.clearConnectionTimeout();
      if (!this.isManualDisconnect) {
        this.emit('disconnect', {});
      }
      this.isManualDisconnect = false;
    });
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
  }

  async joinMatchmaking(): Promise<JoinMatchmakingResponse> {
    const response =
      await apiClient.post<JoinMatchmakingResponse>('/matchmaking/join');
    return response.data;
  }

  async cancelMatchmaking(): Promise<CancelMatchmakingResponse> {
    const response = await apiClient.post<CancelMatchmakingResponse>(
      '/matchmaking/cancel'
    );
    return response.data;
  }

  async getStatus(): Promise<GetStatusResponse> {
    const response = await apiClient.get<GetStatusResponse>(
      '/matchmaking/status'
    );
    return response.data;
  }

  async getStats(): Promise<GetStatsResponse> {
    const response =
      await apiClient.get<GetStatsResponse>('/matchmaking/stats');
    return response.data;
  }

  joinRoom(roomId: string): void {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.emit('join_room', { roomId });
  }

  leaveRoom(): void {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.emit('leave_room');
  }

  async leaveRoomAPI(roomId: string): Promise<void> {
    await apiClient.post(`/rooms/${roomId}/leave`);
  }
}

export const matchmakingService = new MatchmakingService();
