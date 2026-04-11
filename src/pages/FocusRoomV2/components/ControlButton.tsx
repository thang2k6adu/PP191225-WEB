import React from 'react';
import { ControlButtonProps } from '../types';

export const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  onClick,
  variant = 'default',
  ariaLabel,
}) => {
  const baseClasses = 'p-4 rounded-full transition';
  const variantClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-gray-700 hover:bg-gray-600';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};
