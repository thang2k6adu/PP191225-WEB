import apiClient from '@/utils/api';
import type { ApiResponse, PaginatedApiResponse } from '@/types/common/api';
import {
  CreateTaskData,
  UpdateTaskData,
  Task,
  ActiveTask,
  TaskActionData,
  DeactivateTaskData,
  TaskStatsPeriod,
  TaskStatsData,
  TaskStatus,
} from '@/types/task';
import type { ActivateTaskData } from '@/types/trackingSession';
import { API_ENDPOINTS } from '@/constants';

export interface GetTasksParams {
  page?: number;
  size?: number;
  status?: TaskStatus;
  statuses?: TaskStatus[];
  excludeDone?: boolean;
  search?: string;
  isActive?: boolean;
}

export const taskService = {
  getTasks: (params?: GetTasksParams): Promise<PaginatedApiResponse<Task>> =>
    apiClient.get<PaginatedApiResponse<Task>>(API_ENDPOINTS.TASKS.LIST, {
      params: {
        ...params,
        statuses: params?.statuses?.length
          ? params.statuses.join(',')
          : undefined,
      },
    }),

  getTaskById: (id: string): Promise<ApiResponse<Task>> =>
    apiClient.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.DETAIL(id)),

  getActiveTask: (): Promise<ApiResponse<ActiveTask | null>> =>
    apiClient.get<ApiResponse<ActiveTask | null>>(API_ENDPOINTS.TASKS.ACTIVE),

  createTask: (data: CreateTaskData): Promise<ApiResponse<Task>> =>
    apiClient.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.CREATE, data),

  updateTask: (id: string, data: UpdateTaskData): Promise<ApiResponse<Task>> =>
    apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.UPDATE(id), data),

  activateTask: (id: string): Promise<ApiResponse<ActivateTaskData>> =>
    apiClient.post<ApiResponse<ActivateTaskData>>(
      API_ENDPOINTS.TASKS.ACTIVATE(id),
      {}
    ),

  deactivateTask: (id: string): Promise<ApiResponse<DeactivateTaskData>> =>
    apiClient.post<ApiResponse<DeactivateTaskData>>(
      API_ENDPOINTS.TASKS.DEACTIVATE(id),
      {}
    ),

  completeTask: (id: string): Promise<ApiResponse<TaskActionData>> =>
    apiClient.post<ApiResponse<TaskActionData>>(
      API_ENDPOINTS.TASKS.COMPLETE(id),
      {}
    ),

  deleteTask: (id: string): Promise<void> =>
    apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id)),

  getTaskStats: (params?: {
    period?: TaskStatsPeriod;
    anchorDate?: string;
  }): Promise<ApiResponse<TaskStatsData | null>> =>
    apiClient.get<ApiResponse<TaskStatsData | null>>(
      API_ENDPOINTS.TASKS.STATS,
      { params }
    ),
};
