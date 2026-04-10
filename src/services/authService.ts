import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  FirebaseLoginRequest,
  FirebaseLoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email });
  },

  // resetPassword is now handled directly by Firebase Client SDK in thunks

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

  // Firebase Sign Up
  signUpWithFirebase: async (
    request: FirebaseLoginRequest
  ): Promise<FirebaseLoginResponse> => {
    const response = await apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      request
    );
    return response.data;
  },

  // Refresh Token (standalone, for recovery)
  refreshAccessToken: async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_REFRESH,
      { refreshToken } as RefreshTokenRequest
    );
    return response.data;
  },
};
