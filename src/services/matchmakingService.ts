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
  private eventHandlers: Map<string, ((data: unknown) => void)[]> = new Map();
  private isManualDisconnect = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

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

      const connectionTimeout = setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.close();
          reject(new Error('Connection timeout'));
        }
      }, 10000);
      this.socket.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log('[MatchmakingService] WebSocket connected');
        resolve();
      });

      this.socket.on('connected', (data: unknown) => {
        console.log('[MatchmakingService] Connected event:', data);
      });

      this.socket.on('connect_error', (error: unknown) => {
        clearTimeout(connectionTimeout);
        console.error('[MatchmakingService] Connection error:', error);
        reject(error);
      });

      this.socket.on('error', (error: unknown) => {
        console.error('[MatchmakingService] Error:', error);
        this.emit('error', error);
      });

      this.socket.on('match_found', (data: unknown) => {
        console.log('[MatchmakingService] Match found:', data);
        this.emit('match_found', data);
      });

      this.socket.on('opponent_disconnected', (data: unknown) => {
        console.log('[MatchmakingService] Opponent disconnected:', data);
        this.emit('opponent_disconnected', data);
      });

      this.socket.on('opponent_left', (data: unknown) => {
        console.log('[MatchmakingService] Opponent left:', data);
        this.emit('opponent_left', data);
      });

      this.socket.on('room_joined', (data: unknown) => {
        console.log('[MatchmakingService] Room joined:', data);
        this.emit('room_joined', data);
      });

      this.socket.on('room_left', (data: unknown) => {
        console.log('[MatchmakingService] Room left:', data);
        this.emit('room_left', data);
      });

      this.socket.on('disconnect', () => {
        console.log('[MatchmakingService] WebSocket disconnected');
        // Don't emit 'disconnect' event if this was intentional (e.g. logout)
        if (!this.isManualDisconnect) {
          this.emit('disconnect', {});
        }
        this.isManualDisconnect = false;
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.isManualDisconnect = true;
      this.socket.disconnect();
      this.socket = null;
      this.eventHandlers.clear();
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
