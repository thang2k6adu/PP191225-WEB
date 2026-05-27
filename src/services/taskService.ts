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
  getTasks: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<TaskListResponse> => {
    const response = await apiClient.get<TaskListResponse>(
      API_ENDPOINTS.TASKS.LIST,
      { params }
    );
    return response.data;
  },

  getTaskById: async (id: string): Promise<TaskResponse> => {
    const response = await apiClient.get<TaskResponse>(
      API_ENDPOINTS.TASKS.DETAIL(id)
    );
    return response.data;
  },

  getActiveTask: async (): Promise<ActiveTaskResponse> => {
    const response = await apiClient.get<ActiveTaskResponse>(
      API_ENDPOINTS.TASKS.ACTIVE
    );
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<TaskResponse> => {
    const response = await apiClient.post<TaskResponse>(
      API_ENDPOINTS.TASKS.CREATE,
      data
    );
    return response.data;
  },

  updateTask: async (
    id: string,
    data: UpdateTaskData
  ): Promise<TaskResponse> => {
    const response = await apiClient.put<TaskResponse>(
      API_ENDPOINTS.TASKS.UPDATE(id),
      data
    );
    return response.data;
  },

  activateTask: async (id: string): Promise<ActivateTaskResponse> => {
    const response = await apiClient.post<ActivateTaskResponse>(
      API_ENDPOINTS.TASKS.ACTIVATE(id),
      {}
    );
    return response.data;
  },

  deactivateTask: async (id: string): Promise<DeactivateTaskResponse> => {
    const response = await apiClient.post<DeactivateTaskResponse>(
      API_ENDPOINTS.TASKS.DEACTIVATE(id),
      {}
    );
    return response.data;
  },

  completeTask: async (id: string): Promise<TaskActionResponse> => {
    const response = await apiClient.post<TaskActionResponse>(
      API_ENDPOINTS.TASKS.COMPLETE(id),
      {}
    );
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id));
  },

  getTaskStats: async (params?: {
    period?: TaskStatsPeriod;
    anchorDate?: string;
  }): Promise<TaskStatsResponse> => {
    const response = await apiClient.get<TaskStatsResponse>(
      API_ENDPOINTS.TASKS.STATS,
      { params }
    );
    return response.data;
  },
};
