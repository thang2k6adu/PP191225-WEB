import { TrackingSession } from './trackingSession';

export type TaskStatus = 'PLANNED' | 'ACTIVE' | 'DONE';

export interface Task {
  id: string;
  name: string;
  estimateHours: number;
  deadline: string;
  status: TaskStatus;
  isActive: boolean;
  progress?: number; // 0-100%
  totalTimeSpent?: number; // Total seconds spent
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

export interface TaskListResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    items: Task[];
    meta: {
      totalItems: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
  traceId: string;
}

export interface TaskResponse {
  error: boolean;
  code: number;
  message: string;
  data: Task;
  traceId: string;
}

export interface ActiveTaskResponse {
  error: boolean;
  code: number;
  message: string;
  data: Task | null;
  traceId: string;
}

export interface TaskActionResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    status: TaskStatus;
    isActive: boolean;
  };
  traceId: string;
}

export interface DeactivateTaskResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    task: Task;
    session:
      | (TrackingSession & {
          progress?: number;
        })
      | null;
  };
  traceId: string;
}

export type TaskStatsPeriod = 'day' | 'month' | 'year';

export interface TaskStatsResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
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
  } | null;
  traceId: string;
}
