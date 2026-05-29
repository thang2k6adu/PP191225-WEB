import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '@/services/taskService';
import type { RootState } from '@/store';
import type { PaginatedApiResponse } from '@/types/common/api';
import type { ActivateTaskData } from '@/types/trackingSession';
import {
  CreateTaskData,
  UpdateTaskData,
  Task,
  TaskActionData,
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
  force?: boolean;
  ttlMs?: number;
}

const getTaskParamsKey = (args?: FetchTasksArgs): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    size: args?.size ?? 10,
  });

// Fetch tasks
export const fetchTasksThunk = createAsyncThunk<
  PaginatedApiResponse<Task>,
  FetchTasksArgs | undefined,
  { rejectValue: string; state: RootState }
>(
  'task/fetchTasks',
  async (args, { rejectWithValue }) => {
    try {
      const params = {
        page: args?.page,
        size: args?.size,
      };
      const res = await taskService.getTasks(params);
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

      const paramsKey = getTaskParamsKey(args);
      if (state.lastParamsKey !== paramsKey) {
        return true;
      }

      const effectiveTtlMs = requestedTtlMs ?? state.ttlMs;
      const isExpired = Date.now() - state.lastFetchedAt >= effectiveTtlMs;

      return isExpired;
    },
  }
);

// Fetch active task
export const fetchActiveTaskThunk = createAsyncThunk<
  Task | null,
  undefined,
  { rejectValue: string }
>('task/fetchActiveTask', async (_, { rejectWithValue }) => {
  try {
    const response = await taskService.getActiveTask();
    if (response.error) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, 'Failed to fetch active task')
    );
  }
});

// Create task
export const createTaskThunk = createAsyncThunk<
  Task,
  CreateTaskData,
  { rejectValue: string }
>('task/createTask', async (data, { rejectWithValue }) => {
  try {
    const response = await taskService.createTask(data);
    if (response.error || !response.data) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create task'));
  }
});

// Update task
export const updateTaskThunk = createAsyncThunk<
  Task,
  { id: string; data: UpdateTaskData },
  { rejectValue: string }
>('task/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateTask(id, data);
    if (response.error || !response.data) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update task'));
  }
});

// Activate task
export const activateTaskThunk = createAsyncThunk<
  ActivateTaskData['task'],
  string,
  { rejectValue: string }
>('task/activateTask', async (id, { rejectWithValue }) => {
  try {
    const response = await taskService.activateTask(id);
    if (response.error || !response.data?.task) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data.task;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to activate task'));
  }
});

// Complete task
export const completeTaskThunk = createAsyncThunk<
  TaskActionData,
  string,
  { rejectValue: string }
>('task/completeTask', async (id, { rejectWithValue }) => {
  try {
    const response = await taskService.completeTask(id);
    if (response.error || !response.data) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to complete task'));
  }
});

// Delete task
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
