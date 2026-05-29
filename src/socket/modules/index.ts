import { matchmakingModule } from './matchmakingModule';
import { notificationModule } from './notificationModule';
import type { SocketModule } from './types';

export const SOCKET_MODULES: SocketModule[] = [
  matchmakingModule,
  notificationModule,
];

export {
  matchmakingModule,
  setMatchmakingSocketHandlers,
} from './matchmakingModule';
export type { MatchmakingSocketHandlers } from './matchmakingModule';
export type { SocketModule } from './types';
