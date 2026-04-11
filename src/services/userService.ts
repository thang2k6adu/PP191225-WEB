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
  /**
   * Fetch the current user's profile from the backend.
   * Requires a valid Bearer token (handled automatically by the apiClient interceptor).
   */
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  },

  /**
   * Update the current user's profile.
   */
  updateProfile: async (
    data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'avatar'>>
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data;
  },
};
