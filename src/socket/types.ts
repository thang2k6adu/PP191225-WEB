export type SocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type SocketConnectedPayload = {
  userId?: string;
  message?: string;
};

export type SocketStatusListener = (
  status: SocketConnectionStatus,
  detail?: string
) => void;
