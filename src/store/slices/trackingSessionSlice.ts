import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackingSession, SessionsProgress } from '@/types/trackingSession';
import { Task } from '@/types/task';
import {
  activateTaskThunk,
  stopSessionThunk,
  getProgressThunk,
} from '../thunks/trackingSessionThunks';

interface TrackingSessionState {
  currentSession: TrackingSession | null;
  activeTask: Task | null;
  progress: SessionsProgress | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrackingSessionState = {
  currentSession: null,
  activeTask: null,
  progress: null,
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
        state.activeTask = {
          ...action.payload.task,
          status: action.payload.task.status as Task['status'],
        };
        state.currentSession = action.payload.session;
        // Save to localStorage
        localStorage.setItem('activeSessionId', action.payload.session.id);
        localStorage.setItem(
          'sessionStartTime',
          action.payload.session.startTime
        );
      })
      .addCase(activateTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to activate task';
      });

    // Stop session
    builder
      .addCase(stopSessionThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(stopSessionThunk.fulfilled, state => {
        state.isLoading = false;
        state.currentSession = null;
        state.activeTask = null;
        // Clear localStorage
        localStorage.removeItem('activeSessionId');
        localStorage.removeItem('sessionStartTime');
      })
      .addCase(stopSessionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to stop session';
      });

    // Get progress
    builder
      .addCase(getProgressThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProgressThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.currentSession = action.payload.currentSession;
      })
      .addCase(getProgressThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get progress';
      });
  },
});

export const { clearError, clearSession, saveSessionToStorage } =
  trackingSessionSlice.actions;
export default trackingSessionSlice.reducer;
