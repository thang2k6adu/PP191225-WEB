import type { Socket } from 'socket.io-client';

import { SOCKET_MODULES } from './modules';

const cleanups: Array<() => void> = [];

export function registerSocketModules(socket: Socket): void {
  unregisterSocketModules();

  for (const module of SOCKET_MODULES) {
    const cleanup = module.register(socket);
    if (typeof cleanup === 'function') {
      cleanups.push(cleanup);
    }
  }
}

export function unregisterSocketModules(): void {
  while (cleanups.length > 0) {
    const cleanup = cleanups.pop();
    cleanup?.();
  }
}
