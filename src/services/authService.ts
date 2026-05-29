import apiClient from '@/utils/api';
import {
  FirebaseLoginRequest,
  FirebaseLoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  logout: (): Promise<void> => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
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
  ): Promise<FirebaseLoginResponse> =>
    apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    ),

  signUpWithFirebase: (
    request: FirebaseLoginRequest
  ): Promise<FirebaseLoginResponse> =>
    apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    ),
};
