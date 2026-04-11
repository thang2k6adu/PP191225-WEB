import { TaskCard } from '@/components/TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useTasks } from '@/hooks/useTasks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Task } from '@/types/task';
import { useMemo } from 'react';

export function ActivitiesSidebar() {
  const { tasks, isLoading } = useTasks();

  // Transform tasks to TaskCard format
  const activities = useMemo(() => {
    return tasks.map((task: Task) => ({
      title: task.name,
      subtitle: 'Task',
      date: new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: task.status,
      progress: task.progress || 0,
      startDate: new Date(task.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      }),
      estimated: `${task.estimateHours} ${task.estimateHours > 1 ? 'Hours' : 'Hour'}`,
    }));
  }, [tasks]);

  return (
    <div className="col-span-3">
      <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-h4-medium text-gray-900">Activities</h3>
          <p className="text-body-regular text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <CreateTaskDialog />
      </div>

      <div className="flex flex-col gap-3 text-gray-400">
        <h6 className="text-h6 font-regular">All Tasks</h6>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Create your first task!
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <TaskCard key={index} {...activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
