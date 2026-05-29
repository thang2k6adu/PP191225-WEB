import toast from 'react-hot-toast';
import type { Socket } from 'socket.io-client';

import { store } from '@/store';
import {
  joinedRoom,
  opponentDisconnected,
  opponentLeft,
  reset,
  setMatchData,
} from '@/store/slices/matchmakingSlice';
import type {
  MatchData,
  MatchFoundEvent,
  RoomJoinedEvent,
} from '@/types/matchmaking';

import type { SocketModule } from './types';

function normalizeMatchFound(
  raw: MatchFoundEvent,
  currentUserId: string | undefined
): MatchData {
  const matchedUsers = raw.matchedUsers ?? [];
  const opponentId =
    raw.opponentId ?? matchedUsers.find(id => id !== currentUserId) ?? '';

  return {
    roomId: raw.roomId,
    opponentId,
    opponentName: raw.opponentName ?? 'Partner',
    livekitRoomName: raw.livekitRoomName,
    token: raw.token,
    wsUrl: raw.wsUrl,
  };
}

function handleMatchFound(socket: Socket, data: unknown): void {
  const matchEvent = data as MatchFoundEvent;
  const currentUserId = store.getState().auth.user?.id;
  const matchData = normalizeMatchFound(matchEvent, currentUserId);

  store.dispatch(setMatchData(matchData));
  toast.success(`Match found! Opponent: ${matchData.opponentName}`);
  socket.emit('join_room', { roomId: matchData.roomId });
}

function handleRoomJoined(data: unknown): void {
  const roomEvent = data as RoomJoinedEvent;
  store.dispatch(
    joinedRoom({
      roomId: roomEvent.roomId,
      players: [],
      createdAt: new Date().toISOString(),
    })
  );
}

function handleOpponentDisconnected(): void {
  store.dispatch(opponentDisconnected());
  toast.error('Your opponent has disconnected');
}

function handleOpponentLeft(): void {
  store.dispatch(opponentLeft());
  toast.error('Your opponent has left the room');
}

function handleSocketDisconnect(): void {
  store.dispatch(reset());
  toast.error('Disconnected from server');
}

function handleSocketError(error: unknown): void {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An error occurred');
  }
}

export const matchmakingModule: SocketModule = {
  id: 'matchmaking',
  register(socket) {
    const onMatchFound = (data: unknown) => handleMatchFound(socket, data);
    const onOpponentDisconnected = () => handleOpponentDisconnected();
    const onOpponentLeft = () => handleOpponentLeft();
    const onRoomJoined = (data: unknown) => handleRoomJoined(data);
    const onDisconnect = () => handleSocketDisconnect();
    const onError = (error: unknown) => handleSocketError(error);

    socket.on('match_found', onMatchFound);
    socket.on('opponent_disconnected', onOpponentDisconnected);
    socket.on('opponent_left', onOpponentLeft);
    socket.on('room_joined', onRoomJoined);
    socket.on('disconnect', onDisconnect);
    socket.on('error', onError);

    return () => {
      socket.off('match_found', onMatchFound);
      socket.off('opponent_disconnected', onOpponentDisconnected);
      socket.off('opponent_left', onOpponentLeft);
      socket.off('room_joined', onRoomJoined);
      socket.off('disconnect', onDisconnect);
      socket.off('error', onError);
    };
  },
};
