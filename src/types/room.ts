export type RoomType = 'MATCH' | 'PUBLIC';
export type RoomVisibility = 'PUBLIC' | 'PRIVATE';
export type RoomStatus = 'WAITING' | 'ACTIVE' | 'CLOSED';
export type RoomMemberStatus = 'JOINED' | 'READY' | 'LEFT';

export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

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

export interface JoinRoomResponse {
  roomId: string;
  livekitRoomName: string;
  token: string;
  topic: string;
}

export interface PublicRoomsResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    rooms: PaginatedResponse<PublicRoom>;
  };
  traceId: string;
}

export interface RoomDetailResponse {
  error: boolean;
  code: number;
  message: string;
  data: RoomDetail;
  traceId: string;
}

export interface JoinRoomApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: JoinRoomResponse;
  traceId: string;
}

export interface LeaveRoomResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    message: string;
  };
  traceId: string;
}
