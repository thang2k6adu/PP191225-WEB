import type { Task } from './task';

export type SessionStatus = 'active' | 'paused' | 'stopped';

export interface TrackingSession {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  status: SessionStatus;
  expEarned: number;
  previousProgress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivateTaskData {
  task: Task & {
    progress: number;
    totalTimeSpent: number;
  };
  session: TrackingSession;
}

export type SessionData = TrackingSession & {
  currentDuration?: number;
  progress?: number;
};

export interface SessionsProgress {
  progress: number;
  totalTimeSpent: number;
  estimateSeconds: number;
  expEarned: number;
  sessions: TrackingSession[];
  currentSession: TrackingSession | null;
}
