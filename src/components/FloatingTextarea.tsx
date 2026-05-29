import * as React from 'react';
import { cn } from '@/lib/utils';

type FloatingTextareaProps = React.ComponentProps<'textarea'> & {
  label: string;
};

export function FloatingTextarea({
  label,
  id,
  className,
  ...props
}: FloatingTextareaProps) {
  const reactId = React.useId();
  const textareaId = id ?? reactId;

  return (
    <div className="relative">
      <textarea
        id={textareaId}
        {...props}
        placeholder=" "
        className={cn(
          `
          peer
          block w-full
          min-h-[120px]
          rounded-xl
          bg-white
          px-3
          pb-2.5 pt-6
          text-body-regular text-gray-900
          appearance-none
          resize-none
          focus:outline-none
          focus:ring-0
          focus:border-violet-600
        `,
          className
        )}
      />

      <label
        htmlFor={textareaId}
        className="
          pointer-events-none
          absolute left-3 top-4
          z-10
          origin-[0]
          text-body-regular text-gray-500
          duration-300
          transform
          -translate-y-4 scale-[0.6]
          peer-placeholder-shown:translate-y-0
          peer-placeholder-shown:scale-100
          peer-focus:-translate-y-4
          peer-focus:scale-[0.6]
          peer-focus:text-violet-600
        "
      >
        {label}
      </label>
    </div>
  );
}
