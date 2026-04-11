import { Card, CardContent } from '@/components/ui/card';
import TotalWorkChart from '@/components/TotalWorkChart';
import TaskPercentageChart from '@/components/TaskPercentageChart';

export function ChartsSection() {
  const data = [
    { month: 'Jan', Tasks: 30 },
    { month: 'Feb', Tasks: 45 },
    { month: 'Mar', Tasks: 35 },
    { month: 'Apr', Tasks: 55 },
    { month: 'May', Tasks: 72 },
    { month: 'Jun', Tasks: 55 },
    { month: 'Jul', Tasks: 55 },
  ];

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full shadow-md">
          <CardContent className="p-4">
            <TotalWorkChart data={data} referenceX="May" />
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-h6-semi">Total work</div>

        <Card className="w-full h-full shadow-md">
          <CardContent className="p-4">
            <TaskPercentageChart
              data={{
                planning: 12,
                inProgress: 8,
                finished: 20,
              }}
            />{' '}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
