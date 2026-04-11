import { SortOption } from '../types';
import { BUTTON_COLORS } from '../constants';

type SortButtonsProps = {
  options: Array<{ label: string; value: string }>;
  activeSort?: SortOption;
  onSortChange?: (value: SortOption) => void;
};

export function SortButtons({
  options,
  activeSort = 'newest',
}: SortButtonsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {options.map(option => (
        <button
          key={option.value}
          className={`
            shrink-0
            px-3 py-1.5 text-xs rounded-full whitespace-nowrap
            ${
              activeSort === option.value
                ? BUTTON_COLORS.active
                : BUTTON_COLORS.inactive
            }
            hover:bg-gray-200 transition
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
