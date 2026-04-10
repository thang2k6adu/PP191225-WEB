export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',

  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  MATCHMAKING: '/matchmaking',

  V2: {
    HOME: '/v2',
    LOGIN: '/v2/login',
    SIGNUP: '/v2/signup',
    FORGOT_PASSWORD: '/v2/forgot-password',
    RESET_PASSWORD: '/v2/reset-password',
    VERIFY_EMAIL: '/v2/verify-email',

    DASHBOARD: '/v2',
    TASKS: '/v2/tasks',
    FOCUS: '/v2/focus',
    FOCUS_ROOM: '/v2/focus-room',
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
