import { io, type Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/constants';

import {
  registerSocketModules,
  unregisterSocketModules,
} from './moduleRegistry';
import type {
  SocketConnectedPayload,
  SocketConnectionStatus,
  SocketStatusListener,
} from './types';

let socket: Socket | null = null;
let currentToken: string | null = null;
const statusListeners = new Set<SocketStatusListener>();

function notifyStatus(status: SocketConnectionStatus, detail?: string): void {
  statusListeners.forEach(listener => listener(status, detail));
}

function attachTransportListeners(activeSocket: Socket): void {
  const onConnect = () => {
    notifyStatus('connected');
    registerSocketModules(activeSocket);
  };

  const onDisconnect = (reason: string) => {
    unregisterSocketModules();
    notifyStatus('disconnected', reason);
  };

  const onConnectError = (err: Error) => {
    notifyStatus('error', err.message);
  };

  const onGatewayConnected = (payload: SocketConnectedPayload) => {
    if (import.meta.env.DEV) {
      console.info('[socket] gateway connected', payload);
    }
  };

  activeSocket.on('connect', onConnect);
  activeSocket.on('disconnect', onDisconnect);
  activeSocket.on('connect_error', onConnectError);
  activeSocket.on('connected', onGatewayConnected);
}

function detachTransportListeners(activeSocket: Socket): void {
  activeSocket.off('connect');
  activeSocket.off('disconnect');
  activeSocket.off('connect_error');
  activeSocket.off('connected');
}

export function subscribeSocketStatus(
  listener: SocketStatusListener
): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(accessToken: string): Socket {
  if (socket?.connected && currentToken === accessToken) {
    return socket;
  }

  if (socket) {
    unregisterSocketModules();
    detachTransportListeners(socket);
    socket.disconnect();
    socket = null;
  }

  currentToken = accessToken;
  notifyStatus('connecting');

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    transports: ['websocket', 'polling'],
    auth: { token: accessToken },
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  attachTransportListeners(socket);

  return socket;
}

export function disconnectSocket(): void {
  currentToken = null;

  if (!socket) {
    notifyStatus('disconnected');
    return;
  }

  unregisterSocketModules();
  detachTransportListeners(socket);
  socket.disconnect();
  socket = null;
  notifyStatus('disconnected');
}
