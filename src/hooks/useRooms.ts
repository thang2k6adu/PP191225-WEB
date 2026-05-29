import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPublicRoomsThunk,
  joinRoomThunk,
  fetchRoomDetailThunk,
  leaveRoomThunk,
} from '@/store/thunks/roomThunks';
import toast from 'react-hot-toast';

interface FetchPublicRoomsOptions {
  page?: number;
  size?: number;
  force?: boolean;
  ttlMs?: number;
}

const isConditionSkip = (action: { meta?: { condition?: boolean } }) =>
  Boolean(action.meta?.condition);

export const useRooms = () => {
  const dispatch = useAppDispatch();
  const { publicRooms, currentRoom, roomDetail, isLoading, error } =
    useAppSelector(state => state.room);

  const fetchPublicRooms = useCallback(
    async (options?: FetchPublicRoomsOptions) => {
      const result = await dispatch(fetchPublicRoomsThunk(options));
      if (
        fetchPublicRoomsThunk.rejected.match(result) &&
        !isConditionSkip(result)
      ) {
        toast.error(result.payload || 'Failed to fetch public rooms');
      }
      return result;
    },
    [dispatch]
  );

  const joinRoom = useCallback(
    async (roomId: string) => {
      const result = await dispatch(joinRoomThunk(roomId));
      if (joinRoomThunk.fulfilled.match(result)) {
        toast.success('Joined room successfully!');
      } else if (joinRoomThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to join room');
      }
      return result;
    },
    [dispatch]
  );

  const fetchRoomDetail = useCallback(
    async (roomId: string) => {
      const result = await dispatch(fetchRoomDetailThunk(roomId));
      if (fetchRoomDetailThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch room detail');
      }
      return result;
    },
    [dispatch]
  );

  const leaveRoom = useCallback(
    async (roomId: string) => {
      const result = await dispatch(leaveRoomThunk(roomId));
      if (leaveRoomThunk.fulfilled.match(result)) {
        toast.success('Left room successfully!');
      } else if (leaveRoomThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to leave room');
      }
      return result;
    },
    [dispatch]
  );

  return {
    publicRooms,
    currentRoom,
    roomDetail,
    isLoading,
    error,
    fetchPublicRooms,
    joinRoom,
    fetchRoomDetail,
    leaveRoom,
  };
};
