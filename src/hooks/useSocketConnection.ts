import { useEffect, useState } from 'react';

import {
  connectSocket,
  disconnectSocket,
  subscribeSocketStatus,
  type SocketConnectionStatus,
} from '@/socket';
import { TOKEN_STORAGE_KEYS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

export function useSocketConnection(): { status: SocketConnectionStatus } {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<SocketConnectionStatus>('idle');

  useEffect(() => subscribeSocketStatus(setStatus), []);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      return;
    }

    connectSocket(token);
  }, [isAuthenticated]);

  return { status };
}
