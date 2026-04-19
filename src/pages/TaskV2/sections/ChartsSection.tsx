import { Card, CardContent } from '@/components/ui/card';
import TotalWorkChart from '@/components/TotalWorkChart';
import TaskPercentageChart from '@/components/TaskPercentageChart';
import { taskService } from '@/services/taskService';
import { TaskStatsPeriod, TaskStatsResponse } from '@/types/task';
import { useEffect, useMemo, useState } from 'react';
import { toTaskChartData } from '@/utils/task-stats';

type ChartsSectionProps = {
  referenceX?: string;
};

export function ChartsSection({ referenceX }: ChartsSectionProps) {
  const [period, setPeriod] = useState<TaskStatsPeriod>('month');
  const [stats, setStats] = useState<NonNullable<
    TaskStatsResponse['data']
  > | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      const response = await taskService.getTaskStats({ period });
      if (!mounted || response.error || !response.data) return;
      setStats(response.data);
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, [period]);

  const taskPercentage = useMemo(() => {
    return {
      planning: stats?.summary.planned || 0,
      inProgress: stats?.summary.inProgress || 0,
      finished: stats?.summary.completed || 0,
    };
  }, [stats]);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return toTaskChartData(stats, period);
  }, [stats, period]);

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full shadow-md">
          <CardContent className="p-4">
            <TotalWorkChart
              data={chartData}
              referenceX={referenceX}
              period={period}
              onPeriodChange={setPeriod}
            />
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Task Percentage</div>

        <Card className="w-full h-full shadow-md">
          <CardContent className="p-4">
            <TaskPercentageChart data={taskPercentage} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
