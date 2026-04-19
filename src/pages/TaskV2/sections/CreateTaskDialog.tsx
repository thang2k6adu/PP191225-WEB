import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LuPlus as Plus } from 'react-icons/lu';
import { FloatingInput } from '@/components/FloatingInput';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import { FloatingDatePicker } from '@/components/FloatingDatePicker';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';

type CreateTaskDialogMode = 'create' | 'edit';

interface CreateTaskDialogProps {
  mode?: CreateTaskDialogMode;
  task?: Task | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  onSuccess?: () => void;
}

export function CreateTaskDialog({
  mode = 'create',
  task,
  open,
  onOpenChange,
  hideTrigger = false,
  onSuccess,
}: CreateTaskDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [estimateHours, setEstimateHours] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 7
    )
  );
  const [description, setDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { createTask, updateTask } = useTasks();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const resetCreateForm = React.useCallback(() => {
    setName('');
    setEstimateHours('');
    setDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 7
      )
    );
    setDescription('');
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && task) {
      setName(task.name || '');
      setEstimateHours(
        Number.isFinite(task.estimateHours) ? String(task.estimateHours) : ''
      );
      setDate(task.deadline ? new Date(task.deadline) : undefined);
      return;
    }

    resetCreateForm();
  }, [isOpen, mode, task, resetCreateForm]);

  const handleSubmit = async () => {
    if (!name.trim() || !estimateHours || !date) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'edit' && task?.id) {
        await updateTask(task.id, {
          name: name.trim(),
          estimateHours: parseFloat(estimateHours),
          deadline: date.toISOString(),
        });
      } else {
        await createTask({
          name: name.trim(),
          estimateHours: parseFloat(estimateHours),
          deadline: date.toISOString(),
        });
      }

      resetCreateForm();
      setOpen(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="
              h-12 w-12
              rounded-xl
              bg-violet-600
              text-white
              transition-transform
              duration-150
              hover:scale-[1.05]
              active:scale-95
            "
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="!text-h5-medium">
            {mode === 'edit' ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <FloatingInput
            label="Task Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <FloatingInput
            label="Estimated Time (Hour)"
            type="number"
            value={estimateHours}
            onChange={e => setEstimateHours(e.target.value)}
            min="0.5"
            step="0.5"
          />

          <FloatingDatePicker
            label="Deadline"
            value={date}
            onChange={setDate}
          />

          <FloatingTextarea
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <Button
          className="mt-2 bg-violet-600 hover:bg-violet-700"
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim() || !estimateHours || !date}
        >
          {isSubmitting
            ? mode === 'edit'
              ? 'Saving...'
              : 'Creating...'
            : mode === 'edit'
              ? 'Save Changes'
              : 'Create Task'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
