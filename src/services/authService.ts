import apiClient from '@/utils/api';
import type { ApiResponse } from '@/types/common/api';
import {
  FirebaseLoginRequest,
  FirebaseLoginData,
  RefreshTokenRequest,
  RefreshTokenData,
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  logout: (): Promise<void> => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshToken: (
    refreshToken: string
  ): Promise<ApiResponse<RefreshTokenData>> =>
    apiClient.post<ApiResponse<RefreshTokenData>>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    } satisfies RefreshTokenRequest),

  forgotPassword: (email: string): Promise<void> =>
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email }),

  sendVerificationEmail: (
    email: string,
    name?: { firstName?: string; lastName?: string }
  ): Promise<void> =>
    apiClient.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL, {
      email,
      ...name,
    }),

  loginWithFirebase: (
    request: FirebaseLoginRequest
  ): Promise<ApiResponse<FirebaseLoginData>> =>
    apiClient.post<ApiResponse<FirebaseLoginData>>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    ),

  signUpWithFirebase: (
    request: FirebaseLoginRequest
  ): Promise<ApiResponse<FirebaseLoginData>> =>
    apiClient.post<ApiResponse<FirebaseLoginData>>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    ),
};
