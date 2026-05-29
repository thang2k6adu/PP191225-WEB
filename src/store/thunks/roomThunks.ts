import { createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '@/services/roomService';
import type { RootState } from '@/store';
import type { PaginatedApiResponse } from '@/types/common/api';
import { JoinRoomData, RoomDetail, PublicRoom } from '@/types/room';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export interface FetchPublicRoomsArgs {
  page?: number;
  size?: number;
  force?: boolean;
  ttlMs?: number;
}

const getPublicRoomsParamsKey = (args?: FetchPublicRoomsArgs): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    size: args?.size ?? 10,
  });

export const fetchPublicRoomsThunk = createAsyncThunk<
  PaginatedApiResponse<PublicRoom>,
  FetchPublicRoomsArgs | undefined,
  { rejectValue: string; state: RootState }
>(
  'room/fetchPublicRooms',
  async (args, { rejectWithValue }) => {
    try {
      const res = await roomService.getPublicRooms({
        page: args?.page,
        size: args?.size,
      });
      if (res.error || !Array.isArray(res.data)) {
        return rejectWithValue(apiFailureMessage(res));
      }
      return res;
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

export const joinRoomThunk = createAsyncThunk<
  JoinRoomData,
  string,
  { rejectValue: string }
>('room/joinRoom', async (roomId, { rejectWithValue }) => {
  try {
    const res = await roomService.joinRoom(roomId);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to join room'));
  }
});

export const fetchRoomDetailThunk = createAsyncThunk<
  RoomDetail,
  string,
  { rejectValue: string }
>('room/fetchRoomDetail', async (roomId, { rejectWithValue }) => {
  try {
    const res = await roomService.getRoomDetail(roomId);
    if (res.error || !res.data) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, 'Failed to fetch room detail')
    );
  }
});

export const leaveRoomThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('room/leaveRoom', async (roomId, { rejectWithValue }) => {
  try {
    const res = await roomService.leaveRoom(roomId);
    if (res.error) {
      return rejectWithValue(apiFailureMessage(res));
    }
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to leave room'));
  }
});
