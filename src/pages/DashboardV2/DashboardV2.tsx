import { useEffect, useMemo, useState } from 'react';
import { WelcomeSection } from './sections/WelcomeSection';
import { StatsSection } from './sections/StatsSection';
import { ChartsSection } from './sections/ChartsSection';
import { WorkProgressSection } from './sections/WorkProgressSection';
import { SidebarSection } from './sections/SidebarSection';
import { WORK_PROGRESS_TASKS } from './constants';
import { taskService } from '@/services/taskService';
import { TaskStatsPeriod, TaskStatsResponse } from '@/types/task';
import { toTaskChartData } from '@/utils/task-stats';

function DashboardV2() {
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

  const dashboardStats = useMemo(
    () => [
      {
        value:
          (stats?.summary.planned ?? 0) +
          (stats?.summary.inProgress ?? 0) +
          (stats?.summary.completed ?? 0),
        label: 'Total Task',
        icon: 'icons/total-task.png',
        color: 'bg-linear-purple',
      },
      {
        value: stats?.summary.inProgress ?? 0,
        label: 'In Progress',
        icon: 'icons/in-progress.png',
        color: 'bg-linear-blue',
      },
      {
        value: stats?.summary.completed ?? 0,
        label: 'Completed',
        icon: 'icons/completed.png',
        color: 'bg-linear-red',
      },
      {
        value: stats?.summary.planned ?? 0,
        label: 'Planning',
        icon: 'icons/planning.png',
        color: 'bg-linear-green',
      },
    ],
    [stats]
  );

  const chartData = useMemo(() => {
    if (!stats) return [];
    return toTaskChartData(stats, period);
  }, [stats, period]);

  return (
    <>
      <section
        className="
          col-span-1
          lg:col-span-8
          flex flex-col gap-6
        "
      >
        <WelcomeSection />
        <StatsSection stats={dashboardStats} />
        <ChartsSection
          chartData={chartData}
          donut={
            stats
              ? {
                  planning: stats.summary.planned,
                  inProgress: stats.summary.inProgress,
                  completed: stats.summary.completed,
                }
              : { planning: 0, inProgress: 0, completed: 0 }
          }
          period={period}
          onPeriodChange={setPeriod}
        />
        <WorkProgressSection tasks={WORK_PROGRESS_TASKS} />
      </section>

      <section
        className="
          col-span-1
          lg:col-span-4
          flex flex-col gap-6
        "
      >
        <SidebarSection />
      </section>
    </>
  );
}

export default DashboardV2;
