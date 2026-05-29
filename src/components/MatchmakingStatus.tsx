import React from 'react';
import { UserState } from '@/types/matchmaking';
import type { SocketConnectionStatus } from '@/socket';
import { cn } from '@/utils/helpers';

interface MatchmakingStatusProps {
  state: UserState;
  socketStatus: SocketConnectionStatus;
  opponentName?: string;
  className?: string;
}

export const MatchmakingStatus: React.FC<MatchmakingStatusProps> = ({
  state,
  socketStatus,
  opponentName,
  className,
}) => {
  const getStatusInfo = () => {
    if (socketStatus === 'connecting') {
      return {
        text: 'Connecting to server...',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        icon: '🔄',
      };
    }

    if (socketStatus !== 'connected') {
      return {
        text: 'Disconnected',
        bgColor: 'bg-red-100 dark:bg-red-900',
        textColor: 'text-red-800 dark:text-red-200',
        icon: '🔴',
      };
    }

    switch (state) {
      case UserState.IDLE:
        return {
          text: 'Ready to play',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: '⚪',
        };
      case UserState.WAITING:
        return {
          text: 'Finding opponent...',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-800 dark:text-blue-200',
          icon: '🔍',
        };
      case UserState.MATCHED:
        return {
          text: 'Match found — joining room...',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900',
          textColor: 'text-emerald-800 dark:text-emerald-200',
          icon: '✨',
        };
      case UserState.IN_ROOM:
        return {
          text: opponentName ? `Playing with ${opponentName}` : 'In game room',
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-800 dark:text-green-200',
          icon: '🎮',
        };
      default:
        return {
          text: 'Unknown',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: '❓',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
        statusInfo.bgColor,
        statusInfo.textColor,
        className
      )}
    >
      <span className="text-xl" aria-hidden="true">
        {statusInfo.icon}
      </span>
      <span className="font-medium">{statusInfo.text}</span>
      {state === UserState.WAITING && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};
