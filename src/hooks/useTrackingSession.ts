import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activateTaskThunk,
  stopSessionThunk,
  getProgressThunk,
} from '@/store/thunks/trackingSessionThunks';
import { clearError, clearSession } from '@/store/slices/trackingSessionSlice';
import toast from 'react-hot-toast';

export const useTrackingSession = () => {
  const dispatch = useAppDispatch();
  const { currentSession, activeTask, progress, isLoading, error } =
    useAppSelector(state => state.trackingSession);

  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentTime(0);
  }, []);

  const startTimer = useCallback(
    (startTime: string) => {
      stopTimer();

      const updateTime = () => {
        const elapsed = Math.floor(
          (Date.now() - new Date(startTime).getTime()) / 1000
        );
        setCurrentTime(elapsed);
      };

      updateTime();
      timerRef.current = window.setInterval(updateTime, 1000);
    },
    [stopTimer]
  );

  useEffect(() => {
    if (currentSession?.status === 'active' && currentSession.startTime) {
      startTimer(currentSession.startTime);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [
    currentSession?.status,
    currentSession?.startTime,
    startTimer,
    stopTimer,
  ]);

  const activateTask = useCallback(
    async (taskId: string) => {
      const result = await dispatch(activateTaskThunk(taskId));

      if (activateTaskThunk.fulfilled.match(result)) {
        toast.success('Task activated! Tracking started.');
        return result.payload;
      } else if (activateTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to activate task');
        throw new Error(result.payload);
      }
    },
    [dispatch]
  );

  const stopSession = useCallback(async () => {
    if (!currentSession) return;

    const result = await dispatch(stopSessionThunk(currentSession.id));

    if (stopSessionThunk.fulfilled.match(result)) {
      toast.success('Session stopped! Great work!');
      stopTimer();
      return result.payload;
    } else if (stopSessionThunk.rejected.match(result)) {
      toast.error(result.payload || 'Failed to stop session');
      throw new Error(result.payload);
    }
  }, [dispatch, currentSession, stopTimer]);

  const getProgress = useCallback(
    async (taskId: string) => {
      const result = await dispatch(getProgressThunk(taskId));

      if (getProgressThunk.fulfilled.match(result)) {
        return result.payload;
      } else if (getProgressThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to get progress');
        throw new Error(result.payload);
      }
    },
    [dispatch]
  );

  const clearSessionError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSessionData = useCallback(() => {
    dispatch(clearSession());
    stopTimer();
  }, [dispatch, stopTimer]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const restoreSession = useCallback(async () => {
    const sessionId = localStorage.getItem('activeSessionId');
    const startTime = localStorage.getItem('sessionStartTime');

    if (sessionId && startTime) {
      const elapsed = Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000
      );
      setCurrentTime(elapsed);
      startTimer(startTime);
    }
  }, [startTimer]);

  return {
    currentSession,
    activeTask,
    progress,
    isLoading,
    error,
    currentTime,
    activateTask,
    stopSession,
    getProgress,
    clearSessionError,
    clearSessionData,
    restoreSession,
    formatTime,
  };
};
