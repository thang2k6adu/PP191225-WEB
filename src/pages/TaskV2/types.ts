export type ActivityStatus = 'in-progress' | 'completed' | 'pending';

export type Activity = {
  title: string;
  subtitle: string;
  date: string;
  status: string;
  progress: number;
  startDate: string;
  estimated: string;
};

export type RecentActivity = {
  title: string;
  time: string;
};

export type ChartDataPoint = number;
