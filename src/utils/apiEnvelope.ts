import type { ApiResponse } from '@/types/common/api';

type ApiEnvelope = {
  error: boolean;
  message: string;
  data?: unknown | null;
};

export function apiFailureMessage(body: ApiEnvelope): string {
  return body.message?.trim() || 'Request failed';
}

export function isApiError<T>(body: ApiResponse<T>): boolean {
  return body.error || body.data == null;
}

export function unwrapApiData<T>(body: ApiResponse<T>): T {
  if (isApiError(body)) {
    throw new Error(apiFailureMessage(body));
  }
  return body.data as T;
}
