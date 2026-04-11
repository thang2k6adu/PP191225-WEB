import { Card, CardContent } from '@/components/ui/card';
import { TaskCard } from '@/components/TaskCard';
import { TaskProgress } from '../types';

type WorkProgressSectionProps = {
  tasks: TaskProgress[];
};

export function WorkProgressSection({ tasks }: WorkProgressSectionProps) {
  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <h2 className="text-h6-semi text-gray-900">Work Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tasks.map((task, index) => (
            <TaskCard key={index} {...task} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-h6-semi text-gray-900">Working Status</h2>
        <Card className="w-full border rounded-lg flex-1">
          <CardContent className="p-6 flex items-center justify-center h-full min-h-[200px]">
            <p className="text-gray-400 text-sm">No active status</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
