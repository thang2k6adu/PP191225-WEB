import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activateTaskThunk,
  deactivateTaskThunk,
} from '@/store/thunks/trackingSessionThunks';
import { clearError, clearSession } from '@/store/slices/trackingSessionSlice';
import toast from 'react-hot-toast';

export const useTrackingSession = () => {
  const dispatch = useAppDispatch();
  const { currentSession, activeTask, isLoading, error } = useAppSelector(
    state => state.trackingSession
  );

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

  const deactivateTask = useCallback(
    async (taskId: string) => {
      const result = await dispatch(deactivateTaskThunk(taskId));

      if (deactivateTaskThunk.fulfilled.match(result)) {
        toast.success('Task stopped!');
        stopTimer();
        return result.payload;
      } else if (deactivateTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to stop task');
        throw new Error(result.payload);
      }
    },
    [dispatch, stopTimer]
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
    isLoading,
    error,
    currentTime,
    activateTask,
    deactivateTask,
    clearSessionError,
    clearSessionData,
    restoreSession,
    formatTime,
  };
};
