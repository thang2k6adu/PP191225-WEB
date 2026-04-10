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
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    FIREBASE_LOGIN: '/auth/firebase/login',
    FIREBASE_REFRESH: '/auth/refresh',
    SEND_VERIFICATION_EMAIL: '/auth/send-verification-email',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    ACTIVATE: (id: string) => `/tasks/${id}/activate`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    ACTIVE: '/tasks/active',
  },
  MATCHMAKING: {
    JOIN: '/matchmaking/join',
    CANCEL: '/matchmaking/cancel',
    STATUS: '/matchmaking/status',
    STATS: '/matchmaking/stats',
  },
  TRACKING_SESSIONS: {
    ACTIVATE: (taskId: string) => `/tasks/${taskId}/activate`,
    PAUSE: (sessionId: string) => `/tracking-sessions/${sessionId}/pause`,
    RESUME: (sessionId: string) => `/tracking-sessions/${sessionId}/resume`,
    STOP: (sessionId: string) => `/tracking-sessions/${sessionId}/stop`,
    PROGRESS: '/tracking-sessions/progress',
  },
  ROOMS: {
    PUBLIC: '/rooms/public',
    JOIN: (roomId: string) => `/rooms/${roomId}/join`,
    DETAIL: (roomId: string) => `/rooms/${roomId}`,
    LEAVE: (roomId: string) => `/rooms/${roomId}/leave`,
  },
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
} as const;

// Export theme constants
export * from './theme';
