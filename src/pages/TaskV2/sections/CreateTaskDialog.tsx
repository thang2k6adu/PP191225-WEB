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

export function CreateTaskDialog() {
  const [open, setOpen] = React.useState(false);
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

  const { createTask } = useTasks();

  const handleSubmit = async () => {
    if (!name.trim() || !estimateHours || !date) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        name: name.trim(),
        estimateHours: parseFloat(estimateHours),
        deadline: date.toISOString(),
      });

      // Reset form
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
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="!text-h5-medium">Create Task</DialogTitle>
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
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
