import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  LuCalendar as Calendar,
  LuCheck as Check,
  LuClock as Clock,
  LuLoaderCircle as Loader2,
} from 'react-icons/lu';
import { useTrackingSession } from '@/hooks/useTrackingSession';
import { taskService } from '@/services/taskService';
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
import { apiFailureMessage } from '@/utils/apiEnvelope';
import type { ActivateTaskData } from '@/types/trackingSession';
import type { Task } from '@/types/task';

interface TaskSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSelected: (result: ActivateTaskData) => void;
}

const DIALOG_PAGE_SIZE = 30;
const SCROLL_LOAD_THRESHOLD_PX = 80;

function formatSpentTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function getProgressColor(progress: number) {
  if (progress >= 100) return '#87ECAF';
  if (progress < 30) return '#ef4444';
  return '#8b5cf6';
}

function mergeTasks(existing: Task[], incoming: Task[]) {
  const existingIds = new Set(existing.map(task => task.id));
  const merged = [...existing];
  for (const task of incoming) {
    if (!existingIds.has(task.id)) {
      merged.push(task);
    }
  }
  return merged;
}

function TaskOptionCard({
  task,
  selected,
  onSelect,
}: {
  task: Task;
  selected: boolean;
  onSelect: () => void;
}) {
  const progress = task.progress ?? 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-all duration-200',
        'hover:border-primary-800 hover:shadow-md',
        selected
          ? 'border-primary-900 bg-primary-700/50 shadow-md ring-1 ring-primary-900/20'
          : 'border-gray-200 bg-white shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body-semi text-gray-900 line-clamp-2">
            {task.name}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption-lg-regular text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {task.totalTimeSpent
                ? formatSpentTime(task.totalTimeSpent)
                : '0h 0m'}{' '}
              / {task.estimateHours}h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {new Date(task.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-caption-sm-regular text-gray-500">
              <span>Progress</span>
              <span className="font-medium text-gray-700">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: getProgressColor(progress),
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            selected
              ? 'border-primary-900 bg-primary-900 text-white'
              : 'border-gray-300 bg-white'
          )}
        >
          {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
        </div>
      </div>
    </button>
  );
}

const TaskSelectionDialog: React.FC<TaskSelectionDialogProps> = ({
  isOpen,
  onClose,
  onTaskSelected,
}) => {
  const { activateTask, isLoading: isActivating } = useTrackingSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const hasMore = tasks.length < total;

  const loadTasks = useCallback(async (pageNum: number, append: boolean) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await taskService.getTasks({
        excludeDone: true,
        page: pageNum,
        size: DIALOG_PAGE_SIZE,
      });

      if (response.error || !Array.isArray(response.data)) {
        throw new Error(apiFailureMessage(response));
      }

      setTasks(prev =>
        append ? mergeTasks(prev, response.data ?? []) : (response.data ?? [])
      );
      setTotal(response.meta?.totalItems ?? response.data?.length ?? 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load tasks for room:', error);
      if (!append) {
        setTasks([]);
        setTotal(0);
      }
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedTaskId(null);
    loadTasks(1, false);
  }, [isOpen, loadTasks]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const element = event.currentTarget;
    const distanceToBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    if (distanceToBottom <= SCROLL_LOAD_THRESHOLD_PX) {
      loadTasks(page + 1, true);
    }
  };

  const handleConfirm = async () => {
    if (!selectedTaskId) return;

    try {
      const result = await activateTask(selectedTaskId);
      if (result) {
        onTaskSelected(result);
        onClose();
      }
    } catch (error) {
      console.error('Failed to activate task:', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open && !isActivating) {
          onClose();
        }
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-xl sm:max-w-[540px]">
        <DialogHeader className="space-y-1 px-6 pb-2 pt-6 text-left">
          <DialogTitle className="!text-h5-medium text-gray-900">
            Select Task
          </DialogTitle>
          <DialogDescription className="text-caption-lg-regular text-gray-500">
            Choose a task to work on during this focus session.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-900" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center">
              <p className="text-body-medium text-gray-800">
                No tasks available
              </p>
              <p className="mt-1 text-caption-lg-regular text-gray-500">
                Create a task first, then come back to start your session.
              </p>
            </div>
          ) : (
            <div
              onScroll={handleScroll}
              className="max-h-[min(420px,52vh)] space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tasks.map(task => (
                <TaskOptionCard
                  key={task.id}
                  task={task}
                  selected={selectedTaskId === task.id}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              ))}

              {isLoadingMore && (
                <div className="flex justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-900" />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isActivating}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedTaskId || isActivating}
            className="rounded-lg bg-primary-900 hover:bg-primary-900/80"
          >
            {isActivating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              'Select'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSelectionDialog;
