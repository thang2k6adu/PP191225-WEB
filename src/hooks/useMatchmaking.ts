import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '@/store';
import { matchmakingService } from '@/services/matchmakingService';
import {
  setConnecting,
  setConnected,
  setConnectionError,
  setJoining,
  joinSuccess,
  joinError,
  setCanceling,
  cancelSuccess,
  cancelError,
  setMatchData,
  joinedRoom,
  leftRoom,
  opponentDisconnected,
  opponentLeft,
  clearError,
  reset,
} from '@/store/slices/matchmakingSlice';
import { MatchFoundEvent, RoomJoinedEvent } from '@/types/matchmaking';

let activeSubscribers = 0;
let cleanupGlobalListeners: (() => void) | null = null;

export const useMatchmaking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const matchmaking = useSelector((state: RootState) => state.matchmaking);

  const connect = useCallback(async () => {
    if (matchmaking.isConnected || matchmaking.isConnecting) {
      return;
    }

    dispatch(setConnecting(true));

    try {
      await matchmakingService.connect();
      dispatch(setConnected(true));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect to server';
      dispatch(setConnectionError(errorMessage));
    }
  }, [dispatch, matchmaking.isConnected, matchmaking.isConnecting]);

  const disconnect = useCallback(() => {
    matchmakingService.disconnect();
    dispatch(setConnected(false));
    dispatch(reset());
  }, [dispatch]);

  const joinMatchmaking = useCallback(async () => {
    if (!matchmaking.isConnected) {
      toast.error('Please connect to server first');
      return;
    }

    dispatch(setJoining(true));

    try {
      const response = await matchmakingService.joinMatchmaking();

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to join matchmaking');
      }

      if (response.data.status === 'WAITING') {
        dispatch(joinSuccess());
        toast.success('Waiting for opponent...');
      } else if (response.data.status === 'MATCHED') {
        if (response.data.matchData) {
          dispatch(setMatchData(response.data.matchData));
          toast.success('Match found!');
          matchmakingService.joinRoom(response.data.matchData.roomId);
        }
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
  }, [dispatch, matchmaking.isConnected]);

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

  // Register one shared listener set for the singleton service.
  useEffect(() => {
    activeSubscribers += 1;

    if (activeSubscribers > 1) {
      return () => {
        activeSubscribers -= 1;

        if (activeSubscribers === 0 && cleanupGlobalListeners) {
          cleanupGlobalListeners();
          cleanupGlobalListeners = null;
        }
      };
    }

    const handleMatchFound = (data: unknown): void => {
      const matchEvent = data as MatchFoundEvent;
      dispatch(setMatchData(matchEvent));
      toast.success(`Match found! Opponent: ${matchEvent.opponentName}`);
      matchmakingService.joinRoom(matchEvent.roomId);
    };

    const handleConnect = (): void => {
      dispatch(setConnected(true));
    };

    const handleRoomJoined = (data: unknown): void => {
      const roomEvent = data as RoomJoinedEvent;
      dispatch(
        joinedRoom({
          roomId: roomEvent.roomId,
          players: [],
          createdAt: new Date().toISOString(),
        })
      );
      console.log('Joined room:', roomEvent.roomId);
    };

    const handleOpponentDisconnected = (): void => {
      dispatch(opponentDisconnected());
      toast.error('Your opponent has disconnected');
    };

    const handleOpponentLeft = (): void => {
      dispatch(opponentLeft());
      toast.error('Your opponent has left the room');
    };

    const handleDisconnect = (): void => {
      dispatch(setConnected(false));
      toast.error('Disconnected from server');
    };

    const handleError = (error: unknown): void => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred');
      }
    };

    matchmakingService.on('match_found', handleMatchFound);
    matchmakingService.on('connect', handleConnect);
    matchmakingService.on('room_joined', handleRoomJoined);
    matchmakingService.on('opponent_disconnected', handleOpponentDisconnected);
    matchmakingService.on('opponent_left', handleOpponentLeft);
    matchmakingService.on('disconnect', handleDisconnect);
    matchmakingService.on('error', handleError);

    cleanupGlobalListeners = () => {
      matchmakingService.off('match_found', handleMatchFound);
      matchmakingService.off('connect', handleConnect);
      matchmakingService.off('room_joined', handleRoomJoined);
      matchmakingService.off(
        'opponent_disconnected',
        handleOpponentDisconnected
      );
      matchmakingService.off('opponent_left', handleOpponentLeft);
      matchmakingService.off('disconnect', handleDisconnect);
      matchmakingService.off('error', handleError);
    };

    return () => {
      activeSubscribers -= 1;

      if (activeSubscribers === 0 && cleanupGlobalListeners) {
        cleanupGlobalListeners();
        cleanupGlobalListeners = null;
      }
    };
  }, [dispatch]);

  return {
    ...matchmaking,

    connect,
    disconnect,
    joinMatchmaking,
    cancelMatchmaking,
    leaveRoom,
    clearError: clearErrorMessage,
  };
};
