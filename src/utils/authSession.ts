import toast from 'react-hot-toast';
import { AUTH_STORAGE_KEYS, ROUTES, TOKEN_STORAGE_KEYS } from '@/constants';

const PERSIST_ROOT_KEY = 'persist:root';
const SESSION_EXPIRED_MESSAGE = 'Session expired. Please login again.';

let isHandlingSessionExpiry = false;

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_EXPIRES_AT);
  localStorage.removeItem(PERSIST_ROOT_KEY);
}

export function setPendingVerificationEmail(email: string): void {
  sessionStorage.setItem(AUTH_STORAGE_KEYS.PENDING_VERIFICATION_EMAIL, email);
}

export function getPendingVerificationEmail(): string | null {
  return sessionStorage.getItem(AUTH_STORAGE_KEYS.PENDING_VERIFICATION_EMAIL);
}

export function clearPendingVerificationEmail(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.PENDING_VERIFICATION_EMAIL);
}

export async function handleSessionExpired(
  message = SESSION_EXPIRED_MESSAGE
): Promise<void> {
  if (isHandlingSessionExpiry) {
    return;
  }
  isHandlingSessionExpiry = true;

  clearAuthStorage();

  try {
    const { store } = await import('@/store');
    const { logout } = await import('@/store/slices/authSlice');
    store.dispatch(logout());
  } catch {
    // Store may be unavailable during teardown
  }

  const isOnLoginPage = window.location.pathname === ROUTES.LOGIN;

  if (!isOnLoginPage) {
    toast.error(message);
    window.location.assign(ROUTES.LOGIN);
    return;
  }

  isHandlingSessionExpiry = false;
}

export function isAuthRefreshRequest(url?: string): boolean {
  if (!url) {
    return false;
  }
  return url.includes('/auth/refresh');
}
