export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  DASHBOARD: '/',
  TASKS: '/tasks',
  FOCUS: '/focus',
  FOCUS_ROOM: '/focus-room',
  PROFILE: '/profile',

  V2: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',

    DASHBOARD: '/',
    TASKS: '/tasks',
    FOCUS: '/focus',
    FOCUS_ROOM: '/focus-room',
  },
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  BASIC: 'basic',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    FIREBASE_LOGIN: '/auth/firebase/login',
    FIREBASE_REFRESH: '/auth/refresh',
    SEND_VERIFICATION_EMAIL: '/auth/send-verification-email',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    STATS: '/tasks/stats',
    DETAIL: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    ACTIVATE: (id: string) => `/tasks/${id}/activate`,
    DEACTIVATE: (id: string) => `/tasks/${id}/deactivate`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    ACTIVE: '/tasks/active',
  },
  MATCHMAKING: {
    JOIN: '/matchmaking/join',
    CANCEL: '/matchmaking/cancel',
    STATUS: '/matchmaking/status',
    STATS: '/matchmaking/stats',
  },
  ROOMS: {
    PUBLIC: '/rooms/public',
    JOIN: (roomId: string) => `/rooms/${roomId}/join`,
    DETAIL: (roomId: string) => `/rooms/${roomId}`,
    LEAVE: (roomId: string) => `/rooms/${roomId}/leave`,
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  STORAGE: {
    UPLOAD: '/storage/upload',
  },
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
} as const;

// Export theme constants
export * from './form-errors';
export * from './theme';
