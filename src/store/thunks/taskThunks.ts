import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '@/services/taskService';
import type { RootState } from '@/store';
import type { ApiResponse, PaginatedApiResponse } from '@/types/common/api';
import type { ActivateTaskData } from '@/types/trackingSession';
import {
  CreateTaskData,
  UpdateTaskData,
  Task,
  ActiveTask,
  TaskActionData,
  TaskStatus,
} from '@/types/task';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

export interface FetchTasksArgs {
  page?: number;
  size?: number;
  status?: TaskStatus;
  statuses?: TaskStatus[];
  excludeDone?: boolean;
  search?: string;
  isActive?: boolean;
  append?: boolean;
  force?: boolean;
  ttlMs?: number;
}

export const getTaskListFilterKey = (args?: FetchTasksArgs): string =>
  JSON.stringify({
    size: args?.size ?? 12,
    status: args?.status ?? null,
    statuses: args?.statuses?.slice().sort() ?? null,
    excludeDone: args?.excludeDone ?? false,
    search: args?.search ?? null,
    isActive: args?.isActive ?? null,
  });

export const fetchTasksThunk = createAsyncThunk<
  PaginatedApiResponse<Task>,
  FetchTasksArgs | undefined,
  { rejectValue: string; state: RootState }
>(
  'task/fetchTasks',
  async (args, { rejectWithValue }) => {
    try {
      const res = await taskService.getTasks({
        page: args?.page,
        size: args?.size,
        status: args?.status,
        statuses: args?.statuses,
        excludeDone: args?.excludeDone,
        search: args?.search,
        isActive: args?.isActive,
      });
      if (res.error || !Array.isArray(res.data)) {
        return rejectWithValue(apiFailureMessage(res));
      }
      return res;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch tasks'));
    }
  },
  {
    condition: (args, { getState }) => {
      if (args?.append) {
        return !getState().task.isLoadingMore;
      }

      const state = getState().task;
      const force = args?.force ?? false;
      const requestedTtlMs = args?.ttlMs;

      if (force || state.isInvalidated) {
        return true;
      }

      if (state.isLoading) {
        return false;
      }

      if (state.tasks.length === 0 || !state.lastFetchedAt) {
        return true;
      }

      const filterKey = getTaskListFilterKey(args);
      if (state.lastFilterKey !== filterKey) {
        return true;
      }

      const effectiveTtlMs = requestedTtlMs ?? state.ttlMs;
      const isExpired = Date.now() - state.lastFetchedAt >= effectiveTtlMs;

      return isExpired;
    },
  }
);

export const fetchActiveTaskThunk = createAsyncThunk<
  ApiResponse<ActiveTask | null>,
  undefined,
  { rejectValue: string }
>('task/fetchActiveTask', async (_, { rejectWithValue }) => {
  try {
    const res = await taskService.getActiveTask();
    if (res.error) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, 'Failed to fetch active task')
    );
  }
});

export const createTaskThunk = createAsyncThunk<
  ApiResponse<Task>,
  CreateTaskData,
  { rejectValue: string }
>('task/createTask', async (data, { rejectWithValue }) => {
  try {
    const res = await taskService.createTask(data);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create task'));
  }
});

export const updateTaskThunk = createAsyncThunk<
  ApiResponse<Task>,
  { id: string; data: UpdateTaskData },
  { rejectValue: string }
>('task/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await taskService.updateTask(id, data);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update task'));
  }
});

export const activateTaskThunk = createAsyncThunk<
  ApiResponse<ActivateTaskData>,
  string,
  { rejectValue: string }
>('task/activateTask', async (id, { rejectWithValue }) => {
  try {
    const res = await taskService.activateTask(id);
    if (res.error || !res.data?.task) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to activate task'));
  }
});

export const completeTaskThunk = createAsyncThunk<
  ApiResponse<TaskActionData>,
  string,
  { rejectValue: string }
>('task/completeTask', async (id, { rejectWithValue }) => {
  try {
    const res = await taskService.completeTask(id);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to complete task'));
  }
});

export const deleteTaskThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('task/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete task'));
  }
});
