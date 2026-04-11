import { StatCardProps, TaskProgress, ProgressStatus } from './types';
import { RecentActivity } from '@/components/RecentActivities';

export const COLOR_MAP: Record<ProgressStatus, string> = {
  primary: '#8b5cf6',
  danger: '#ef4444',
  success: '#87ECAF',
};

export const BG_COLOR_MAP: Record<ProgressStatus, string> = {
  primary: 'bg-violet-500',
  danger: 'bg-red-500',
  success: 'bg-emerald-500',
};

export const DASHBOARD_STATS: StatCardProps[] = [
  {
    value: 1120,
    label: 'Total Task',
    icon: 'icons/total-task.png',
    color: 'bg-linear-purple',
  },
  {
    value: 320,
    label: 'In Progress',
    icon: 'icons/in-progress.png',
    color: 'bg-linear-blue',
  },
  {
    value: 760,
    label: 'Completed',
    icon: 'icons/planning.png',
    color: 'bg-linear-red',
  },
  {
    value: 40,
    label: 'Completed',
    icon: 'icons/completed.png',
    color: 'bg-linear-green',
  },
];

// Work progress tasks data
export const WORK_PROGRESS_TASKS: TaskProgress[] = [
  {
    title: 'Dashboard Design',
    progress: 50,
    startDate: '10 Jan',
    estimated: '2 Hours',
    status: 'primary',
  },
  {
    title: 'Dashboard Design',
    progress: 10,
    startDate: '10 Jan',
    estimated: '2 Hours',
    status: 'danger',
  },
  {
    title: 'Dashboard Design',
    progress: 90,
    startDate: '10 Jan',
    estimated: '2 Hours',
    status: 'primary',
  },
  {
    title: 'Dashboard Design',
    progress: 90,
    startDate: '10 Jan',
    estimated: '2 Hours',
    status: 'success',
  },
];

// Upcoming tasks data
export const UPCOMING_TASKS: RecentActivity[] = [
  { title: 'Finish Homework', estimated: 3600 },
  { title: 'Finish Homework', estimated: 3600 },
  { title: 'Finish Homework', estimated: 3600 },
  { title: 'Finish Homework', estimated: 3600 },
  { title: 'Finish Homework', estimated: 3600 },
];
