import apiClient from '@/utils/api';
import {
  PublicRoomsResponse,
  JoinRoomApiResponse,
  RoomDetailResponse,
  LeaveRoomResponse,
  CurrentActiveRoomApiResponse,
} from '@/types/room';
import { API_ENDPOINTS } from '@/constants';

export const roomService = {
  getCurrentRoom: (): Promise<CurrentActiveRoomApiResponse> =>
    apiClient.get<CurrentActiveRoomApiResponse>(API_ENDPOINTS.ROOMS.CURRENT),

  getPublicRooms: (params?: {
    page?: number;
    limit?: number;
  }): Promise<PublicRoomsResponse> =>
    apiClient.get<PublicRoomsResponse>(API_ENDPOINTS.ROOMS.PUBLIC, { params }),

  joinRoom: (roomId: string): Promise<JoinRoomApiResponse> =>
    apiClient.post<JoinRoomApiResponse>(API_ENDPOINTS.ROOMS.JOIN(roomId), {}),

  getRoomDetail: (roomId: string): Promise<RoomDetailResponse> =>
    apiClient.get<RoomDetailResponse>(API_ENDPOINTS.ROOMS.DETAIL(roomId)),

  leaveRoom: (roomId: string): Promise<LeaveRoomResponse> =>
    apiClient.post<LeaveRoomResponse>(API_ENDPOINTS.ROOMS.LEAVE(roomId), {}),
};
