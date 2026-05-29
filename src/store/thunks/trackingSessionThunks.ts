import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { taskService } from '@/services/taskService';
import type { ApiResponse } from '@/types/common/api';
import type { ActivateTaskData } from '@/types/trackingSession';
import type { DeactivateTaskData } from '@/types/task';
import { apiFailureMessage } from '@/utils/apiEnvelope';

export const activateTaskThunk = createAsyncThunk<
  ApiResponse<ActivateTaskData>,
  string,
  { rejectValue: string }
>('trackingSession/activate', async (taskId, { rejectWithValue }) => {
  try {
    const res = await taskService.activateTask(taskId);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    return rejectWithValue(message || 'Failed to activate task');
  }
});

export const deactivateTaskThunk = createAsyncThunk<
  ApiResponse<DeactivateTaskData>,
  string,
  { rejectValue: string }
>('trackingSession/deactivate', async (taskId, { rejectWithValue }) => {
  try {
    const res = await taskService.deactivateTask(taskId);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error: unknown) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    return rejectWithValue(message || 'Failed to deactivate task');
  }
});
