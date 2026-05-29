export enum UserState {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  MATCHED = 'MATCHED',
  IN_ROOM = 'IN_ROOM',
}

export enum MatchmakingStatus {
  WAITING = 'WAITING',
  MATCHED = 'MATCHED',
}

export interface RoomData {
  roomId: string;
  players: string[];
  createdAt: string;
}

export interface MatchData {
  roomId: string;
  opponentId: string;
  opponentName: string;
  livekitRoomName?: string;
  token?: string;
  wsUrl?: string;
}

export interface MatchFoundEvent {
  roomId: string;
  opponentId?: string;
  opponentName?: string;
  message?: string;
  livekitRoomName?: string;
  token?: string;
  wsUrl?: string;
  matchedUsers?: string[];
  timestamp?: string;
}

export interface OpponentDisconnectedEvent {
  message: string;
  roomId: string;
}

export interface OpponentLeftEvent {
  message: string;
  roomId: string;
}

export interface RoomJoinedEvent {
  roomId: string;
  message: string;
}

export interface RoomLeftEvent {
  message: string;
}

export interface JoinMatchmakingData {
  status: MatchmakingStatus;
  message: string;
  matchData?: MatchData;
}

export interface CancelMatchmakingData {
  message: string;
}

export interface MatchmakingStatusData {
  state: UserState;
  room?: RoomData;
}

export interface MatchmakingStatsData {
  waitingQueueSize: number;
  activeRooms: number;
  onlineUsers: number;
  stateDistribution: {
    idle: number;
    waiting: number;
    inRoom: number;
  };
}

export interface MatchmakingState {
  state: UserState;
  room: RoomData | null;
  matchData: MatchData | null;
  error: string | null;
  isJoining: boolean;
  isCanceling: boolean;
}
