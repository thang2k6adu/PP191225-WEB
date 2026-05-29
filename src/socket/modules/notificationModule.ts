import type { SocketModule } from './types';

export const notificationModule: SocketModule = {
  id: 'notification',
  register(socket) {
    const onNotification = (payload: unknown) => {
      if (import.meta.env.DEV) {
        console.info('[socket:notification]', payload);
      }
    };

    socket.on('notification', onNotification);

    return () => {
      socket.off('notification', onNotification);
    };
  },
};
