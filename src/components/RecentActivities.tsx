import { Card, CardContent } from '@/components/ui/card';
import { formatDurationHYM } from '@/utils/date';
import { useTasks } from '@/hooks/useTasks';
import { useMemo } from 'react';

export type RecentActivity = {
  title: string;
  estimated: number; // in seconds
};

export function RecentActivities() {
  const { tasks } = useTasks();

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status === 'PLANNED')
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 5)
      .map(task => ({
        title: task.name,
        estimated: task.estimateHours * 3600,
      }));
  }, [tasks]);

  return (
    <Card className="w-full bg-transparent shadow-none border-none">
      <CardContent className="p-0 gap-4 flex flex-col">
        <div className="flex flex-col gap-0">
          <h3 className="text-h6-semi text-black">Recent Activities</h3>
          <p className="text-caption-lg-regular text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming tasks
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="cursor-pointer flex bg-white shadow-md items-start gap-3 p-3 border-l-4 border-violet-600 rounded-md hover:scale-[1.015] hover:shadow-lg transition w-full"
              >
                <div className="flex-1">
                  <h4 className="text-body-semi text-gray-900">{task.title}</h4>
                  <p className="text-caption-lg-regular text-muted-foreground mt-1">
                    {formatDurationHYM(task.estimated)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
