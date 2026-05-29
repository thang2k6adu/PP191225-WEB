import apiClient from '@/utils/api';
import {
  FirebaseLoginRequest,
  FirebaseLoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken } satisfies RefreshTokenRequest
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email });
  },

  sendVerificationEmail: async (
    email: string,
    name?: { firstName?: string; lastName?: string }
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL, {
      email,
      ...name,
    });
  },

  // Firebase Login
  loginWithFirebase: async (
    request: FirebaseLoginRequest
  ): Promise<FirebaseLoginResponse> => {
    const response = await apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    );
    return response.data;
  },

  signUpWithFirebase: async (
    request: FirebaseLoginRequest
  ): Promise<FirebaseLoginResponse> => {
    const response = await apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    );
    return response.data;
  },
};
