import apiClient from '@/utils/api';
import { getSocket } from '@/socket';
import type { ApiResponse } from '@/types/common/api';
import {
  JoinMatchmakingData,
  CancelMatchmakingData,
  MatchmakingStatusData,
  MatchmakingStatsData,
} from '@/types/matchmaking';

class MatchmakingService {
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
    if (!socket?.connected) {
      throw new Error('WebSocket not connected');
    }
    socket.emit('join_room', { roomId });
  }

  leaveRoom(): void {
    const socket = getSocket();
    if (!socket?.connected) {
      throw new Error('WebSocket not connected');
    }
    socket.emit('leave_room');
  }

  async leaveRoomAPI(roomId: string): Promise<void> {
    await apiClient.post(`/rooms/${roomId}/leave`);
  }
}

export const matchmakingService = new MatchmakingService();
