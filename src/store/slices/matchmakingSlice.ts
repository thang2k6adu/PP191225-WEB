import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MatchmakingState,
  UserState,
  RoomData,
  MatchData,
} from '@/types/matchmaking';

const initialState: MatchmakingState = {
  state: UserState.IDLE,
  room: null,
  matchData: null,
  error: null,
  isJoining: false,
  isCanceling: false,
};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<UserState>) => {
      state.state = action.payload;
    },

    setJoining: (state, action: PayloadAction<boolean>) => {
      state.isJoining = action.payload;
    },
    joinSuccess: state => {
      state.isJoining = false;
      state.state = UserState.WAITING;
      state.error = null;
    },
    joinError: (state, action: PayloadAction<string>) => {
      state.isJoining = false;
      state.state = UserState.IDLE;
      state.error = action.payload;
    },

    setCanceling: (state, action: PayloadAction<boolean>) => {
      state.isCanceling = action.payload;
    },
    cancelSuccess: state => {
      state.isCanceling = false;
      state.state = UserState.IDLE;
      state.error = null;
    },
    cancelError: (state, action: PayloadAction<string>) => {
      state.isCanceling = false;
      state.error = action.payload;
    },

    setMatchData: (state, action: PayloadAction<MatchData>) => {
      state.matchData = action.payload;
      state.state = UserState.MATCHED;
      state.isJoining = false;
      state.error = null;
    },

    setRoom: (state, action: PayloadAction<RoomData | null>) => {
      state.room = action.payload;
      if (action.payload) {
        state.state = UserState.IN_ROOM;
      } else if (state.state === UserState.IN_ROOM) {
        state.state = UserState.IDLE;
      }
    },
    joinedRoom: (state, action: PayloadAction<RoomData>) => {
      state.room = action.payload;
      state.state = UserState.IN_ROOM;
    },
    leftRoom: state => {
      state.room = null;
      state.matchData = null;
      state.state = UserState.IDLE;
    },

    opponentDisconnected: state => {
      state.room = null;
      state.matchData = null;
      state.state = UserState.IDLE;
    },
    opponentLeft: state => {
      state.room = null;
      state.matchData = null;
      state.state = UserState.IDLE;
    },

    clearError: state => {
      state.error = null;
    },

    reset: state => {
      state.state = UserState.IDLE;
      state.room = null;
      state.matchData = null;
      state.error = null;
      state.isJoining = false;
      state.isCanceling = false;
    },
  },
});

export const {
  setUserState,
  setJoining,
  joinSuccess,
  joinError,
  setCanceling,
  cancelSuccess,
  cancelError,
  setMatchData,
  setRoom,
  joinedRoom,
  leftRoom,
  opponentDisconnected,
  opponentLeft,
  clearError,
  reset,
} = matchmakingSlice.actions;

export default matchmakingSlice.reducer;
