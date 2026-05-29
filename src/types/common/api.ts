export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T, M = null> {
  error: boolean;
  code: number;
  message: string;
  data: T | null;
  meta?: M | null;
  traceId: string;
}

export type PaginatedApiResponse<T> = ApiResponse<T[], PaginationMeta>;
