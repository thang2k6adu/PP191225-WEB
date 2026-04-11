import { Activity } from './types';

// Semantic color mapping
export const STATUS_COLOR_MAP = {
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
};

export const PROGRESS_BAR_COLOR = 'bg-black';

// Activities data
export const ACTIVITIES: Activity[] = [
  {
    title: 'Dashboard Design',
    subtitle: 'DashedUI Kit',
    date: 'March 20th, 2021',
    status: 'In Progress',
    progress: 29,
    startDate: '10 Jan',
    estimated: '2 Hours',
  },
  {
    title: 'Dashboard Design',
    subtitle: 'DashedUI Kit',
    date: 'March 20th, 2021',
    status: 'In Progress',
    progress: 60,
    startDate: '10 Jan',
    estimated: '2 Hours',
  },
  {
    title: 'Dashboard Design',
    subtitle: 'DashedUI Kit',
    date: 'March 20th, 2021',
    status: 'In Progress',
    progress: 100,
    startDate: '10 Jan',
    estimated: '2 Hours',
  },
  {
    title: 'Dashboard Design',
    subtitle: 'DashedUI Kit',
    date: 'March 20th, 2021',
    status: 'In Progress',
    progress: 30,
    startDate: '10 Jan',
    estimated: '2 Hours',
  },
  {
    title: 'Dashboard Design',
    subtitle: 'DashedUI Kit',
    date: 'March 20th, 2021',
    status: 'In Progress',
    progress: 60,
    startDate: '10 Jan',
    estimated: '2 Hours',
  },
];

// Chart data
export const TOTAL_WORK_CHART_DATA = [
  { month: 'Jan', Tasks: 40 },
  { month: 'Feb', Tasks: 60 },
  { month: 'Mar', Tasks: 45 },
  { month: 'Apr', Tasks: 70 },
  { month: 'May', Tasks: 55 },
  { month: 'Jun', Tasks: 80 },
  { month: 'Jul', Tasks: 50 },
];

// Task percentage data
export const TASK_PERCENTAGE = {
  planning: 12,
  inProgress: 8,
  finished: 20,
};

// Upcoming tasks data (replacing recent activities)
export const UPCOMING_TASKS = [
  { title: 'Finish Homework', estimated: 7200 }, // 2 hours
  { title: 'Dashboard Design', estimated: 10800 }, // 3 hours
  { title: 'Code Review', estimated: 3600 }, // 1 hour
  { title: 'Team Meeting', estimated: 5400 }, // 1.5 hours
  { title: 'Write Documentation', estimated: 9000 }, // 2.5 hours
];
