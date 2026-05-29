import * as React from 'react';
import { cn } from '@/lib/utils';

type FloatingInputProps = React.ComponentProps<'input'> & {
  label: string;
};

export function FloatingInput({
  label,
  id,
  className,
  ...props
}: FloatingInputProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;

  return (
    <div className="relative">
      <input
        id={inputId}
        {...props}
        placeholder=" "
        className={cn(
          `
          peer
          block w-full
          rounded-xl
          bg-gray-50
          px-3
          pb-2.5 pt-5
          text-body-regular text-gray-900
          bg-white
          appearance-none
          focus:outline-none
          focus:ring-0
          focus:border-violet-600
        `,
          className
        )}
      />

      <label
        htmlFor={inputId}
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
