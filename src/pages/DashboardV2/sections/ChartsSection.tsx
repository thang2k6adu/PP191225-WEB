import { Card, CardContent } from '@/components/ui/card';
import TotalWorkChart from '@/components/TotalWorkChart';
import TaskPercentageChart from '@/components/TaskPercentageChart';
import { TaskStatsPeriod } from '@/types/task';

type ChartsSectionProps = {
  chartData: Array<{ month: string; Tasks: number }>;
  donut: {
    planning: number;
    inProgress: number;
    completed: number;
  };
  period: TaskStatsPeriod;
  onPeriodChange: (period: TaskStatsPeriod) => void;
};

export function ChartsSection({
  chartData,
  donut,
  period,
  onPeriodChange,
}: ChartsSectionProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full shadow-md">
          <CardContent className="p-4">
            <TotalWorkChart
              data={chartData}
              period={period}
              onPeriodChange={onPeriodChange}
            />
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full h-full shadow-md">
          <CardContent className="p-4">
            <TaskPercentageChart
              data={{
                planning: donut.planning,
                inProgress: donut.inProgress,
                finished: donut.completed,
              }}
            />{' '}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
