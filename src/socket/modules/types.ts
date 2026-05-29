import type { Socket } from 'socket.io-client';

export type SocketModule = {
  id: string;
  register: (socket: Socket) => void | (() => void);
};
