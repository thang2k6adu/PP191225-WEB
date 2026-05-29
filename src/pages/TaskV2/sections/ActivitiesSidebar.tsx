import { TaskCard } from '@/components/TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useTasks } from '@/hooks/useTasks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Task, TaskStatus } from '@/types/task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LuLoaderCircle as Loader2 } from 'react-icons/lu';
import type { FetchTasksArgs } from '@/hooks/useTasks';

const TASK_PAGE_SIZE = 12;
const ONGOING_STATUSES: TaskStatus[] = ['PLANNED', 'ACTIVE'];

type TaskTab = 'all' | 'ongoing';

type TaskContextMenuState = {
  task: Task;
  x: number;
  y: number;
};

function buildFetchParams(
  tab: TaskTab,
  page = 1,
  append = false
): FetchTasksArgs {
  return {
    page,
    size: TASK_PAGE_SIZE,
    append,
    force: !append,
    ...(tab === 'ongoing' ? { statuses: ONGOING_STATUSES } : {}),
  };
}

export function ActivitiesSidebar() {
  const {
    tasks,
    isLoading,
    isLoadingMore,
    hasMore,
    total,
    page,
    fetchTasks,
    deleteTask,
  } = useTasks();
  const [activeTab, setActiveTab] = useState<TaskTab>('all');
  const [contextMenu, setContextMenu] = useState<TaskContextMenuState | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTasks(buildFetchParams(activeTab, 1, false));
  }, [activeTab, fetchTasks]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isLoading) return;
    fetchTasks(buildFetchParams(activeTab, page + 1, true));
  }, [activeTab, fetchTasks, hasMore, isLoadingMore, isLoading, page]);

  useEffect(() => {
    if (!contextMenu) return;

    const closeMenu = () => setContextMenu(null);

    window.addEventListener('click', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);

    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [contextMenu]);

  const activities = useMemo(() => {
    return tasks.map((task: Task) => ({
      id: task.id,
      rawTask: task,
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

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>, task: Task) => {
    event.preventDefault();

    const menuWidth = 180;
    const menuHeight = 96;
    const maxX = window.innerWidth - menuWidth - 8;
    const maxY = window.innerHeight - menuHeight - 8;

    setContextMenu({
      task,
      x: Math.min(event.clientX, maxX),
      y: Math.min(event.clientY, maxY),
    });
  };

  const handleEditFromMenu = () => {
    if (!contextMenu) return;
    setEditingTask(contextMenu.task);
    setIsEditOpen(true);
    setContextMenu(null);
  };

  const handleDeleteFromMenu = async () => {
    if (!contextMenu) return;

    const selectedTask = contextMenu.task;
    setContextMenu(null);

    setTaskToDelete(selectedTask);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(open);
    if (!open) {
      setTaskToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  const handleCreateSuccess = () => {
    fetchTasks(buildFetchParams(activeTab, 1, false));
  };

  return (
    <div className="col-span-3">
      <div className="flex items-center justify-between mb-6 rounded-lg">
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

        <CreateTaskDialog onSuccess={handleCreateSuccess} />
      </div>

      <div className="flex flex-col gap-3 text-gray-400">
        <div className="flex items-center justify-between gap-3">
          <h6 className="text-h6 font-regular text-gray-700">Tasks</h6>
          {!isLoading && total > 0 && (
            <span className="text-caption-lg-regular text-gray-500">
              {tasks.length} of {total}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {(['all', 'ongoing'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-caption-lg-medium capitalize transition-colors',
                activeTab === tab
                  ? 'bg-primary-900 text-white'
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
              )}
            >
              {tab === 'all' ? 'All' : 'Ongoing'}
            </button>
          ))}
        </div>

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
            {activities.map(activity => (
              <div
                key={activity.id}
                onContextMenu={event =>
                  handleContextMenu(event, activity.rawTask)
                }
                className="cursor-context-menu"
              >
                <TaskCard
                  title={activity.title}
                  progress={activity.progress}
                  startDate={activity.startDate}
                  estimated={activity.estimated}
                  subtitle={activity.subtitle}
                  date={activity.date}
                  status={activity.status}
                />
              </div>
            ))}

            {hasMore && (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[180px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={event => event.stopPropagation()}
        >
          <button
            onClick={handleEditFromMenu}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteFromMenu}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}

      <CreateTaskDialog
        mode="edit"
        task={editingTask}
        open={isEditOpen}
        onOpenChange={handleEditDialogChange}
        hideTrigger
        onSuccess={handleCreateSuccess}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="!text-h5-medium text-gray-900">
              Delete task
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {taskToDelete
                ? `Are you sure you want to delete "${taskToDelete.name}"? This action cannot be undone.`
                : 'Are you sure you want to delete this task? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => handleDeleteDialogChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
