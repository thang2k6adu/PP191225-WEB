import React from 'react';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isActive?: boolean;
  taskTitle?: string;
  progress?: number;
}

export interface ControlButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  ariaLabel?: string;
}

export interface FocusRoomState {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  showSettings: boolean;
}
