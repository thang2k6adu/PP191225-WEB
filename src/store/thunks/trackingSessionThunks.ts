import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { taskService } from '@/services/taskService';
import { ActivateTaskResponse } from '@/types/trackingSession';
import { DeactivateTaskResponse } from '@/types/task';
import { apiFailureMessage } from '@/utils/apiEnvelope';

export const activateTaskThunk = createAsyncThunk<
  ActivateTaskResponse['data'],
  string,
  { rejectValue: string }
>('trackingSession/activate', async (taskId, { rejectWithValue }) => {
  try {
    const response = await taskService.activateTask(taskId);
    if (response.error || !response.data) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    return rejectWithValue(message || 'Failed to activate task');
  }
});

export const deactivateTaskThunk = createAsyncThunk<
  DeactivateTaskResponse['data'],
  string,
  { rejectValue: string }
>('trackingSession/deactivate', async (taskId, { rejectWithValue }) => {
  try {
    const response = await taskService.deactivateTask(taskId);
    if (response.error || !response.data) {
      return rejectWithValue(apiFailureMessage(response));
    }
    return response.data;
  } catch (error: unknown) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    return rejectWithValue(message || 'Failed to deactivate task');
  }
});
