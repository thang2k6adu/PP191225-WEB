import apiClient from '@/utils/api';
import type { ApiResponse, PaginatedApiResponse } from '@/types/common/api';
import {
  PublicRoom,
  JoinRoomData,
  RoomDetail,
  LeaveRoomData,
  CurrentActiveRoomData,
} from '@/types/room';
import { API_ENDPOINTS } from '@/constants';

export const roomService = {
  getCurrentRoom: (): Promise<ApiResponse<CurrentActiveRoomData>> =>
    apiClient.get<ApiResponse<CurrentActiveRoomData>>(
      API_ENDPOINTS.ROOMS.CURRENT
    ),

  getPublicRooms: (params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedApiResponse<PublicRoom>> =>
    apiClient.get<PaginatedApiResponse<PublicRoom>>(
      API_ENDPOINTS.ROOMS.PUBLIC,
      { params }
    ),

  joinRoom: (roomId: string): Promise<ApiResponse<JoinRoomData>> =>
    apiClient.post<ApiResponse<JoinRoomData>>(
      API_ENDPOINTS.ROOMS.JOIN(roomId),
      {}
    ),

  getRoomDetail: (roomId: string): Promise<ApiResponse<RoomDetail>> =>
    apiClient.get<ApiResponse<RoomDetail>>(API_ENDPOINTS.ROOMS.DETAIL(roomId)),

  leaveRoom: (roomId: string): Promise<ApiResponse<LeaveRoomData>> =>
    apiClient.post<ApiResponse<LeaveRoomData>>(
      API_ENDPOINTS.ROOMS.LEAVE(roomId),
      {}
    ),
};
