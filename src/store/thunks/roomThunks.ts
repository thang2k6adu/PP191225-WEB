import { createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '@/services/roomService';
import type { RootState } from '@/store';
import {
  JoinRoomResponse,
  RoomDetail,
  PaginatedResponse,
  PublicRoom,
} from '@/types/room';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

export interface FetchPublicRoomsArgs {
  page?: number;
  limit?: number;
  force?: boolean;
  ttlMs?: number;
}

const getPublicRoomsParamsKey = (args?: FetchPublicRoomsArgs): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    limit: args?.limit ?? 10,
  });

// Fetch public rooms
export const fetchPublicRoomsThunk = createAsyncThunk<
  PaginatedResponse<PublicRoom>,
  FetchPublicRoomsArgs | undefined,
  { rejectValue: string; state: RootState }
>(
  'room/fetchPublicRooms',
  async (args, { rejectWithValue }) => {
    try {
      return await roomService.getPublicRooms({
        page: args?.page,
        limit: args?.limit,
      });
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch public rooms')
      );
    }
  },
  {
    condition: (args, { getState }) => {
      const state = getState().room;
      const force = args?.force ?? false;
      const requestedTtlMs = args?.ttlMs;

      if (force || state.isInvalidated) {
        return true;
      }

      if (state.isLoading) {
        return false;
      }

      if (state.publicRooms.length === 0 || !state.lastFetchedAt) {
        return true;
      }

      if (state.lastParamsKey !== getPublicRoomsParamsKey(args)) {
        return true;
      }

      const effectiveTtlMs = requestedTtlMs ?? state.ttlMs;
      const isExpired = Date.now() - state.lastFetchedAt >= effectiveTtlMs;

      return isExpired;
    },
  }
);

// Join room
export const joinRoomThunk = createAsyncThunk<
  JoinRoomResponse,
  string,
  { rejectValue: string }
>('room/joinRoom', async (roomId, { rejectWithValue }) => {
  try {
    return await roomService.joinRoom(roomId);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to join room'));
  }
});

// Fetch room detail
export const fetchRoomDetailThunk = createAsyncThunk<
  RoomDetail,
  string,
  { rejectValue: string }
>('room/fetchRoomDetail', async (roomId, { rejectWithValue }) => {
  try {
    return await roomService.getRoomDetail(roomId);
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, 'Failed to fetch room detail')
    );
  }
});

// Leave room
export const leaveRoomThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('room/leaveRoom', async (roomId, { rejectWithValue }) => {
  try {
    await roomService.leaveRoom(roomId);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to leave room'));
  }
});
