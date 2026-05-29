import { createSlice } from '@reduxjs/toolkit';
import { PublicRoom, JoinRoomData, RoomDetail } from '@/types/room';
import {
  fetchPublicRoomsThunk,
  joinRoomThunk,
  fetchRoomDetailThunk,
  leaveRoomThunk,
} from '../thunks/roomThunks';

const DEFAULT_PUBLIC_ROOMS_TTL_MS = 30_000;

const getPublicRoomsParamsKey = (args?: {
  page?: number;
  size?: number;
  force?: boolean;
  ttlMs?: number;
}): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    size: args?.size ?? 10,
  });

interface RoomState {
  publicRooms: PublicRoom[];
  currentRoom: JoinRoomData | null;
  roomDetail: RoomDetail | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  lastParamsKey: string | null;
  ttlMs: number;
  isInvalidated: boolean;
}

const initialState: RoomState = {
  publicRooms: [],
  currentRoom: null,
  roomDetail: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  lastParamsKey: null,
  ttlMs: DEFAULT_PUBLIC_ROOMS_TTL_MS,
  isInvalidated: false,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentRoom: state => {
      state.currentRoom = null;
      state.roomDetail = null;
    },
  },
  extraReducers: builder => {
    // Fetch public rooms
    builder
      .addCase(fetchPublicRoomsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicRoomsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicRooms = action.payload.data ?? [];
        state.lastFetchedAt = Date.now();
        state.lastParamsKey = getPublicRoomsParamsKey(action.meta.arg);
        state.ttlMs = action.meta.arg?.ttlMs ?? state.ttlMs;
        state.isInvalidated = false;
      })
      .addCase(fetchPublicRoomsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch public rooms';
      });

    // Join room
    builder
      .addCase(joinRoomThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinRoomThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
        state.isInvalidated = true;
      })
      .addCase(joinRoomThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to join room';
      });

    // Fetch room detail
    builder
      .addCase(fetchRoomDetailThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoomDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomDetail = action.payload;
      })
      .addCase(fetchRoomDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch room detail';
      });

    // Leave room
    builder
      .addCase(leaveRoomThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveRoomThunk.fulfilled, state => {
        state.isLoading = false;
        state.currentRoom = null;
        state.roomDetail = null;
        state.isInvalidated = true;
      })
      .addCase(leaveRoomThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to leave room';
      });
  },
});

export const { clearError, clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
