import { TrackingSession } from './trackingSession';

export type TaskStatus = 'PLANNED' | 'ACTIVE' | 'DONE';

export interface Task {
  id: string;
  name: string;
  estimateHours: number;
  deadline: string;
  status: TaskStatus;
  isActive: boolean;
  progress?: number;
  totalTimeSpent?: number;
  remainingTime?: number;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  name: string;
  estimateHours: number;
  deadline: string;
}

export interface UpdateTaskData {
  name?: string;
  estimateHours?: number;
  deadline?: string;
  status?: TaskStatus;
}

export interface ActiveTask extends Task {
  currentSessionStartTime: string | null;
}

export interface TaskActionData {
  id: string;
  status: TaskStatus;
  isActive: boolean;
}

export interface DeactivateTaskData {
  task: Task;
  session: (TrackingSession & { progress?: number }) | null;
}

export type TaskStatsPeriod = 'day' | 'month' | 'year';

export interface TaskStatsData {
  range: {
    from: string;
    to: string;
  };
  summary: {
    planned: number;
    inProgress: number;
    completed: number;
  };
  series: Array<{
    timestamp: string;
    count: number;
  }>;
}
