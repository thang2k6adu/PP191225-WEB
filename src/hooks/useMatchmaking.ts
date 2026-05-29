import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { TOKEN_STORAGE_KEYS } from '@/constants';
import { ensureSocketReady } from '@/socket';
import { RootState, AppDispatch } from '@/store';
import { matchmakingService } from '@/services/matchmakingService';
import {
  setJoining,
  joinSuccess,
  joinError,
  setCanceling,
  cancelSuccess,
  cancelError,
  leftRoom,
  clearError,
} from '@/store/slices/matchmakingSlice';
import { MatchmakingStatus } from '@/types/matchmaking';

export const useMatchmaking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const matchmaking = useSelector((state: RootState) => state.matchmaking);

  const joinMatchmaking = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      toast.error('Please log in to continue');
      return;
    }

    try {
      await ensureSocketReady(token);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect to server';
      toast.error(errorMessage);
      return;
    }

    dispatch(setJoining(true));

    try {
      const response = await matchmakingService.joinMatchmaking();

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to join matchmaking');
      }

      if (response.data.status === MatchmakingStatus.WAITING) {
        dispatch(joinSuccess());
        toast.success('Waiting for opponent...');
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      } | null;
      const errorMessage =
        axiosError?.response?.data?.message || 'Failed to join matchmaking';
      dispatch(joinError(errorMessage));
      toast.error(errorMessage);
    }
  }, [dispatch]);

  const cancelMatchmaking = useCallback(async () => {
    dispatch(setCanceling(true));

    try {
      await matchmakingService.cancelMatchmaking();
      dispatch(cancelSuccess());
      toast.success('Matchmaking canceled');
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      } | null;
      const errorMessage =
        axiosError?.response?.data?.message || 'Failed to cancel matchmaking';
      dispatch(cancelError(errorMessage));
      toast.error(errorMessage);
    }
  }, [dispatch]);

  const leaveRoom = useCallback(() => {
    try {
      matchmakingService.leaveRoom();
      dispatch(leftRoom());
      toast.success('Left room');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to leave room');
      }
    }
  }, [dispatch]);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...matchmaking,
    joinMatchmaking,
    cancelMatchmaking,
    leaveRoom,
    clearError: clearErrorMessage,
  };
};
