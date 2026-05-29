import type { SocketModule } from './types';

export type MatchmakingSocketHandlers = {
  onConnect?: (data: unknown) => void;
  onConnected?: (data: unknown) => void;
  onError?: (data: unknown) => void;
  onMatchFound?: (data: unknown) => void;
  onOpponentDisconnected?: (data: unknown) => void;
  onOpponentLeft?: (data: unknown) => void;
  onRoomJoined?: (data: unknown) => void;
  onRoomLeft?: (data: unknown) => void;
  onDisconnect?: () => void;
};

let handlers: MatchmakingSocketHandlers = {};

export function setMatchmakingSocketHandlers(
  next: MatchmakingSocketHandlers
): void {
  handlers = next;
}

export const matchmakingModule: SocketModule = {
  id: 'matchmaking',
  register(socket) {
    const onConnect = () => {
      handlers.onConnect?.({ socketId: socket.id });
    };

    const onConnected = (data: unknown) => {
      handlers.onConnected?.(data);
    };

    const onError = (error: unknown) => {
      handlers.onError?.(error);
    };

    const onMatchFound = (data: unknown) => {
      handlers.onMatchFound?.(data);
    };

    const onOpponentDisconnected = (data: unknown) => {
      handlers.onOpponentDisconnected?.(data);
    };

    const onOpponentLeft = (data: unknown) => {
      handlers.onOpponentLeft?.(data);
    };

    const onRoomJoined = (data: unknown) => {
      handlers.onRoomJoined?.(data);
    };

    const onRoomLeft = (data: unknown) => {
      handlers.onRoomLeft?.(data);
    };

    const onDisconnect = () => {
      handlers.onDisconnect?.();
    };

    socket.on('connect', onConnect);
    socket.on('connected', onConnected);
    socket.on('error', onError);
    socket.on('match_found', onMatchFound);
    socket.on('opponent_disconnected', onOpponentDisconnected);
    socket.on('opponent_left', onOpponentLeft);
    socket.on('room_joined', onRoomJoined);
    socket.on('room_left', onRoomLeft);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connected', onConnected);
      socket.off('error', onError);
      socket.off('match_found', onMatchFound);
      socket.off('opponent_disconnected', onOpponentDisconnected);
      socket.off('opponent_left', onOpponentLeft);
      socket.off('room_joined', onRoomJoined);
      socket.off('room_left', onRoomLeft);
      socket.off('disconnect', onDisconnect);
    };
  },
};
