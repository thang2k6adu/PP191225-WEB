import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import { UserProfile } from '@/types/user';

export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T | null;
  traceId: string;
}

export const userService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE
    );

    console.log('getProfile response:', response.data);
    return response.data;
  },

  updateProfile: async (
    data: Partial<
      Pick<
        UserProfile,
        | 'firstName'
        | 'lastName'
        | 'contactEmail'
        | 'avatar'
        | 'work'
        | 'major'
        | 'bio'
      >
    >
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data;
  },
};
