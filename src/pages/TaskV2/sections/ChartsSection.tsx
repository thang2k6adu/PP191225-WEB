import { Card, CardContent } from '@/components/ui/card';
import TotalWorkChart from '@/components/TotalWorkChart';
import TaskPercentageChart from '@/components/TaskPercentageChart';
import { useTasks } from '@/hooks/useTasks';
import { useMemo } from 'react';

type ChartsSectionProps = {
  referenceX?: string;
};

export function ChartsSection({ referenceX }: ChartsSectionProps) {
  const { tasks } = useTasks();

  // Calculate task percentages from real data
  const taskPercentage = useMemo(() => {
    const planning = tasks.filter(t => t.status === 'PLANNED').length;
    const inProgress = tasks.filter(t => t.status === 'ACTIVE').length;
    const finished = tasks.filter(t => t.status === 'DONE').length;

    return {
      planning,
      inProgress,
      finished,
    };
  }, [tasks]);

  // Calculate chart data (tasks created per month)
  const chartData = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentYear = new Date().getFullYear();
    const tasksByMonth: { [key: string]: number } = {};

    // Initialize all months with 0
    months.forEach(month => {
      tasksByMonth[month] = 0;
    });

    // Count tasks by month
    tasks.forEach(task => {
      const date = new Date(task.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        const month = months[monthIndex];
        tasksByMonth[month]++;
      }
    });

    // Convert to chart format
    return months.map(month => ({
      month,
      Tasks: tasksByMonth[month],
    }));
  }, [tasks]);

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full shadow-md">
          <CardContent className="p-4">
            <TotalWorkChart data={chartData} referenceX={referenceX} />
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
