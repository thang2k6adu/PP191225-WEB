import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackingSession } from '@/types/trackingSession';
import { Task } from '@/types/task';
import {
  activateTaskThunk,
  deactivateTaskThunk,
} from '../thunks/trackingSessionThunks';

interface TrackingSessionState {
  currentSession: TrackingSession | null;
  activeTask: Task | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrackingSessionState = {
  currentSession: null,
  activeTask: null,
  isLoading: false,
  error: null,
};

const trackingSessionSlice = createSlice({
  name: 'trackingSession',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearSession: state => {
      state.currentSession = null;
      state.activeTask = null;
      localStorage.removeItem('activeSessionId');
      localStorage.removeItem('sessionStartTime');
    },
    // Save session to localStorage for offline/refresh persistence
    saveSessionToStorage: (
      _state,
      action: PayloadAction<{ sessionId: string; startTime: string }>
    ) => {
      localStorage.setItem('activeSessionId', action.payload.sessionId);
      localStorage.setItem('sessionStartTime', action.payload.startTime);
    },
  },
  extraReducers: builder => {
    // Activate task
    builder
      .addCase(activateTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload.data;
        if (!payload) return;
        state.activeTask = {
          ...payload.task,
          status: payload.task.status as Task['status'],
        };
        state.currentSession = payload.session;
        localStorage.setItem('activeSessionId', payload.session.id);
        localStorage.setItem('sessionStartTime', payload.session.startTime);
      })
      .addCase(activateTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to activate task';
      });

    // Deactivate task
    builder
      .addCase(deactivateTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateTaskThunk.fulfilled, state => {
        state.isLoading = false;
        state.currentSession = null;
        state.activeTask = null;
        localStorage.removeItem('activeSessionId');
        localStorage.removeItem('sessionStartTime');
      })
      .addCase(deactivateTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to deactivate task';
      });

    // Note: session-level stop/progress flows were removed in favor of task-level activate/deactivate.
  },
});

export const { clearError, clearSession, saveSessionToStorage } =
  trackingSessionSlice.actions;
export default trackingSessionSlice.reducer;
