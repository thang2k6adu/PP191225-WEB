export type RoomType = 'MATCH' | 'PUBLIC';
export type RoomVisibility = 'PUBLIC' | 'PRIVATE';
export type RoomStatus = 'WAITING' | 'ACTIVE' | 'CLOSED';
export type RoomMemberStatus = 'JOINED' | 'READY' | 'LEFT';

export interface Room {
  id: string;
  type: RoomType;
  topic: string | null;
  visibility: RoomVisibility;
  status: RoomStatus;
  maxMembers: number;
  livekitRoomName: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicRoom {
  id: string;
  type: RoomType;
  topic: string;
  livekitRoomName: string;
  status: RoomStatus;
  maxMembers: number;
  currentMembers: number;
}

export interface RoomMember {
  userId: string;
  status: RoomMemberStatus;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface RoomDetail {
  id: string;
  type: RoomType;
  status: RoomStatus;
  maxMembers: number;
  members: RoomMember[];
}

export interface JoinRoomData {
  roomId: string;
  livekitRoomName: string;
  token: string;
  topic: string;
}

export interface ActiveRoomSummary {
  id: string;
  type: RoomType;
  topic: string | null;
  livekitRoomName: string;
  status: RoomStatus;
}

export interface CurrentActiveRoomData {
  hasActiveRoom: boolean;
  room: ActiveRoomSummary | null;
  token: string | null;
}

export interface LeaveRoomData {
  message: string;
}
