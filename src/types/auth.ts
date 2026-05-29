export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface FirebaseLoginRequest {
  idToken: string;
  deviceId: string;
  platform: 'web' | 'mobile' | 'desktop';
  firstName?: string;
  lastName?: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface FirebaseUserData {
  id: string;
  email: string;
  contactEmail?: string | null;
  name?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'basic';
}

export interface FirebaseLoginData {
  user: FirebaseUserData;
  tokens: TokenData;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  expiresIn: number;
}
