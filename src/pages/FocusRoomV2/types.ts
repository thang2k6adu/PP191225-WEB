import React from 'react';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isActive?: boolean;
  taskTitle?: string;
  taskId?: string;
  taskProgress?: number;
  taskEstimateSeconds?: number;
  taskSessionStartTime?: string;
}

export interface ControlButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  ariaLabel?: string;
  disabled?: boolean;
}

export interface FocusRoomState {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  showSettings: boolean;
}
