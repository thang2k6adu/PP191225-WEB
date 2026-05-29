import { TaskStatsPeriod, TaskStatsData } from '@/types/task';

export const toTaskChartData = (
  statsData: TaskStatsData,
  period: TaskStatsPeriod
) => {
  return statsData.series.map(point => ({
    month: formatTimestampLabel(point.timestamp, period),
    Tasks: point.count,
  }));
};

function formatTimestampLabel(
  timestamp: string,
  period: TaskStatsPeriod
): string {
  const date = new Date(timestamp);

  if (period === 'day') {
    return `${date.getUTCDate()}`;
  }

  if (period === 'month') {
    return date.toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });
  }

  return `${date.getUTCFullYear()}`;
}
