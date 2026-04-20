import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchTasksThunk,
  fetchActiveTaskThunk,
  createTaskThunk,
  updateTaskThunk,
  activateTaskThunk,
  completeTaskThunk,
  deleteTaskThunk,
} from '@/store/thunks/taskThunks';
import { CreateTaskData, UpdateTaskData } from '@/types/task';
import toast from 'react-hot-toast';

interface FetchTasksOptions {
  page?: number;
  limit?: number;
  force?: boolean;
  ttlMs?: number;
}

const isConditionSkip = (action: { meta?: { condition?: boolean } }) =>
  Boolean(action.meta?.condition);

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, activeTask, isLoading, error, total, page, limit } =
    useAppSelector(state => state.task);

  const fetchTasks = useCallback(
    async (params?: FetchTasksOptions) => {
      const result = await dispatch(fetchTasksThunk(params));
      if (fetchTasksThunk.rejected.match(result) && !isConditionSkip(result)) {
        toast.error(result.payload || 'Failed to fetch tasks');
      }
      return result;
    },
    [dispatch]
  );

  const fetchActiveTask = useCallback(async () => {
    const result = await dispatch(fetchActiveTaskThunk(undefined));
    if (fetchActiveTaskThunk.rejected.match(result)) {
      toast.error(result.payload || 'Failed to fetch active task');
    }
    return result;
  }, [dispatch]);

  const createTask = useCallback(
    async (data: CreateTaskData) => {
      const result = await dispatch(createTaskThunk(data));
      if (createTaskThunk.fulfilled.match(result)) {
        toast.success('Task created successfully!');
      } else if (createTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create task');
      }
      return result;
    },
    [dispatch]
  );

  const updateTask = useCallback(
    async (id: string, data: UpdateTaskData) => {
      const result = await dispatch(updateTaskThunk({ id, data }));
      if (updateTaskThunk.fulfilled.match(result)) {
        toast.success('Task updated successfully!');
      } else if (updateTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update task');
      }
      return result;
    },
    [dispatch]
  );

  const activateTask = useCallback(
    async (id: string) => {
      const result = await dispatch(activateTaskThunk(id));
      if (activateTaskThunk.fulfilled.match(result)) {
        toast.success('Task activated! Start working...');
      } else if (activateTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to activate task');
      }
      return result;
    },
    [dispatch]
  );

  const completeTask = useCallback(
    async (id: string) => {
      const result = await dispatch(completeTaskThunk(id));
      if (completeTaskThunk.fulfilled.match(result)) {
        toast.success('Task completed! Great work!');
      } else if (completeTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to complete task');
      }
      return result;
    },
    [dispatch]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteTaskThunk(id));
      if (deleteTaskThunk.fulfilled.match(result)) {
        toast.success('Task deleted successfully!');
      } else if (deleteTaskThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete task');
      }
      return result;
    },
    [dispatch]
  );

  return {
    tasks,
    activeTask,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchTasks,
    fetchActiveTask,
    createTask,
    updateTask,
    activateTask,
    completeTask,
    deleteTask,
  };
};
