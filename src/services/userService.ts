import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/api';
import { UserProfile } from '@/types/user';

export type { ApiResponse } from '@/types/common/api';

export const userService = {
  getProfile: (): Promise<ApiResponse<UserProfile>> =>
    apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USERS.PROFILE),

  updateProfile: (
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
  ): Promise<ApiResponse<UserProfile>> =>
    apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    ),
};
