import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/task';
import {
  fetchTasksThunk,
  fetchActiveTaskThunk,
  createTaskThunk,
  updateTaskThunk,
  activateTaskThunk,
  completeTaskThunk,
  deleteTaskThunk,
} from '../thunks/taskThunks';
import { deactivateTaskThunk } from '../thunks/trackingSessionThunks';

const DEFAULT_TASK_TTL_MS = 60_000;

const getTaskParamsKey = (args?: {
  page?: number;
  size?: number;
  force?: boolean;
  ttlMs?: number;
}): string =>
  JSON.stringify({
    page: args?.page ?? 1,
    size: args?.size ?? 10,
  });

interface TaskState {
  tasks: Task[];
  activeTask: Task | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  size: number;
  lastFetchedAt: number | null;
  lastParamsKey: string | null;
  ttlMs: number;
  isInvalidated: boolean;
}

const initialState: TaskState = {
  tasks: [],
  activeTask: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  size: 10,
  lastFetchedAt: null,
  lastParamsKey: null,
  ttlMs: DEFAULT_TASK_TTL_MS,
  isInvalidated: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    updateRemainingTime: (state, action: PayloadAction<number>) => {
      // Update remainingTime for the active task
      if (state.activeTask) {
        state.activeTask.remainingTime = action.payload;
        const index = state.tasks.findIndex(t => t.id === state.activeTask!.id);
        if (index !== -1) {
          state.tasks[index].remainingTime = action.payload;
        }
      }
    },
  },
  extraReducers: builder => {
    // Fetch tasks
    builder
      .addCase(fetchTasksThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data ?? [];
        if (action.payload.meta) {
          state.total = action.payload.meta.totalItems;
          state.page = action.payload.meta.currentPage;
          state.size = action.payload.meta.itemsPerPage;
        }
        state.lastFetchedAt = Date.now();
        state.lastParamsKey = getTaskParamsKey(action.meta.arg);
        state.ttlMs = action.meta.arg?.ttlMs ?? state.ttlMs;
        state.isInvalidated = false;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // Fetch active task
    builder
      .addCase(fetchActiveTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeTask = action.payload.data ?? null;
      })
      .addCase(fetchActiveTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch active task';
      });

    // Create task
    builder
      .addCase(createTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.tasks.unshift(action.payload.data);
          state.total += 1;
        }
        state.isInvalidated = true;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        if (!updated) return;
        const index = state.tasks.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
        state.isInvalidated = true;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update task';
      });

    // Activate task
    builder
      .addCase(activateTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const activated = action.payload.data?.task;
        if (!activated) return;
        state.tasks = state.tasks.map(task => ({
          ...task,
          isActive: task.id === activated.id,
          status: task.id === activated.id ? 'ACTIVE' : task.status,
        }));
        const activatedTask = state.tasks.find(t => t.id === activated.id);
        if (activatedTask) {
          state.activeTask = activatedTask;
        }
        state.isInvalidated = true;
      })
      .addCase(activateTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to activate task';
      });

    // Deactivate task (stop tracking)
    builder.addCase(deactivateTaskThunk.fulfilled, (state, action) => {
      const payload = action.payload.data;
      if (!payload) return;
      const taskId = payload.task.id;
      const index = state.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...payload.task,
          status: payload.task.status as Task['status'],
        };
      }
      if (state.activeTask?.id === taskId) {
        state.activeTask = null;
      }
      state.isInvalidated = true;
    });

    // Complete task
    builder
      .addCase(completeTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const completed = action.payload.data;
        if (!completed) return;
        const index = state.tasks.findIndex(t => t.id === completed.id);
        if (index !== -1) {
          state.tasks[index].status = 'DONE';
          state.tasks[index].isActive = false;
        }
        if (state.activeTask?.id === completed.id) {
          state.activeTask = null;
        }
        state.isInvalidated = true;
      })
      .addCase(completeTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to complete task';
      });

    // Delete task
    builder
      .addCase(deleteTaskThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.total -= 1;
        if (state.activeTask?.id === action.payload) {
          state.activeTask = null;
        }
        state.isInvalidated = true;
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export const { clearError, setPage, updateRemainingTime } = taskSlice.actions;
export default taskSlice.reducer;
