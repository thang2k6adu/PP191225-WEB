import apiClient from '@/utils/api';
import {
  PublicRoomsResponse,
  JoinRoomApiResponse,
  RoomDetailResponse,
  LeaveRoomResponse,
  CurrentActiveRoomApiResponse,
  PaginatedResponse,
  PublicRoom,
  JoinRoomResponse,
  RoomDetail,
  CurrentActiveRoomResponse,
} from '@/types/room';
import { API_ENDPOINTS } from '@/constants';

export const roomService = {
  getCurrentRoom: async (): Promise<CurrentActiveRoomResponse> => {
    const response = await apiClient.get<CurrentActiveRoomApiResponse>(
      API_ENDPOINTS.ROOMS.CURRENT
    );
    return response.data.data;
  },

  // Get all public rooms
  getPublicRooms: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PublicRoom>> => {
    const response = await apiClient.get<PublicRoomsResponse>(
      API_ENDPOINTS.ROOMS.PUBLIC,
      { params }
    );
    return response.data.data.rooms;
  },

  // Join a room
  joinRoom: async (roomId: string): Promise<JoinRoomResponse> => {
    const response = await apiClient.post<JoinRoomApiResponse>(
      API_ENDPOINTS.ROOMS.JOIN(roomId),
      {}
    );
    return response.data.data;
  },

  // Get room detail
  getRoomDetail: async (roomId: string): Promise<RoomDetail> => {
    const response = await apiClient.get<RoomDetailResponse>(
      API_ENDPOINTS.ROOMS.DETAIL(roomId)
    );
    return response.data.data;
  },

  // Leave a room
  leaveRoom: async (roomId: string): Promise<void> => {
    await apiClient.post<LeaveRoomResponse>(
      API_ENDPOINTS.ROOMS.LEAVE(roomId),
      {}
    );
  },
};
