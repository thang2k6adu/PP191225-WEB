export type ProgressStatus = 'primary' | 'danger' | 'success';

export type StatCardProps = {
  value: string | number;
  label: string;
  icon: string;
  color: string;
};

export type TaskProgress = {
  title: string;
  progress: number;
  startDate: string;
  estimated: string;
  status: ProgressStatus;
};
