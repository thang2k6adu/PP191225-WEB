import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  LuCalendar as CalendarIcon,
  LuChevronDown as ChevronDown,
} from 'react-icons/lu';
import { format } from 'date-fns';

type FloatingDatePickerProps = {
  label: string;
  value?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
};

export function FloatingDatePicker({
  label,
  value,
  onChange,
  className,
}: FloatingDatePickerProps) {
  const hasValue = Boolean(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            `
            relative
            block w-full
            rounded-xl
            bg-white
            px-3
            pb-2.5 pt-5
            text-left
            appearance-none
            focus:outline-none
          `,
            className
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 text-body-regular',
              hasValue ? 'text-gray-900' : 'text-transparent'
            )}
          >
            <CalendarIcon className="h-4 w-4 text-violet-600" />
            {hasValue ? format(value!, 'dd MMM, yyyy') : '—'}
          </div>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <span
            className={cn(
              `
              pointer-events-none
              absolute left-3 top-4
              z-10
              origin-[0]
              text-body-regular text-gray-500
              duration-300
              transform
            `,
              hasValue
                ? '-translate-y-4 scale-[0.6]'
                : 'translate-y-0 scale-100'
            )}
          >
            {label}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto p-0 rounded-xl bg-white shadow-md border"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          className="rounded-xl"
        />
      </PopoverContent>
    </Popover>
  );
}
