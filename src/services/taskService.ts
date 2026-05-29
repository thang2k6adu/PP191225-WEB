import apiClient from '@/utils/api';
import {
  CreateTaskData,
  UpdateTaskData,
  TaskListResponse,
  TaskResponse,
  ActiveTaskResponse,
  TaskActionResponse,
  DeactivateTaskResponse,
  TaskStatsPeriod,
  TaskStatsResponse,
} from '@/types/task';
import { ActivateTaskResponse } from '@/types/trackingSession';
import { API_ENDPOINTS } from '@/constants';

export const taskService = {
  getTasks: (params?: {
    page?: number;
    limit?: number;
  }): Promise<TaskListResponse> =>
    apiClient.get<TaskListResponse>(API_ENDPOINTS.TASKS.LIST, { params }),

  getTaskById: (id: string): Promise<TaskResponse> =>
    apiClient.get<TaskResponse>(API_ENDPOINTS.TASKS.DETAIL(id)),

  getActiveTask: (): Promise<ActiveTaskResponse> =>
    apiClient.get<ActiveTaskResponse>(API_ENDPOINTS.TASKS.ACTIVE),

  createTask: (data: CreateTaskData): Promise<TaskResponse> =>
    apiClient.post<TaskResponse>(API_ENDPOINTS.TASKS.CREATE, data),

  updateTask: (id: string, data: UpdateTaskData): Promise<TaskResponse> =>
    apiClient.patch<TaskResponse>(API_ENDPOINTS.TASKS.UPDATE(id), data),

  activateTask: (id: string): Promise<ActivateTaskResponse> =>
    apiClient.post<ActivateTaskResponse>(API_ENDPOINTS.TASKS.ACTIVATE(id), {}),

  deactivateTask: (id: string): Promise<DeactivateTaskResponse> =>
    apiClient.post<DeactivateTaskResponse>(
      API_ENDPOINTS.TASKS.DEACTIVATE(id),
      {}
    ),

  completeTask: (id: string): Promise<TaskActionResponse> =>
    apiClient.post<TaskActionResponse>(API_ENDPOINTS.TASKS.COMPLETE(id), {}),

  deleteTask: (id: string): Promise<void> =>
    apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id)),

  getTaskStats: (params?: {
    period?: TaskStatsPeriod;
    anchorDate?: string;
  }): Promise<TaskStatsResponse> =>
    apiClient.get<TaskStatsResponse>(API_ENDPOINTS.TASKS.STATS, { params }),
};
