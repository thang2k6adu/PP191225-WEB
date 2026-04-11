import { FilterCategory } from '../types';
import { ReactNode } from 'react';

type FilterGroupProps = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
};

export function FilterGroup({
  title,
  children,
  isOpen = true,
}: FilterGroupProps) {
  return (
    <div>
      <button className="flex items-center justify-between w-full mb-2 mt-3">
        <span className="text-body-regular">{title}</span>
      </button>
      {isOpen && <div className="space-y-1.5 ml-2">{children}</div>}
    </div>
  );
}

type CategoryFilterProps = {
  categories: FilterCategory[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <>
      {categories.map(category => (
        <label
          key={category.name}
          className="flex items-center justify-between text-caption-lg-regular text-gray-600 cursor-pointer hover:text-gray-900"
        >
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span>{category.name}</span>
          </div>
          {category.count && (
            <span className="text-gray-400">
              {category.count.toLocaleString()}
            </span>
          )}
        </label>
      ))}
    </>
  );
}

type SimpleFilterProps = {
  options: Array<{ label: string; value: string }>;
};

export function SimpleFilter({ options }: SimpleFilterProps) {
  return (
    <>
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center gap-2 text-caption-lg-regular text-gray-600 cursor-pointer hover:text-gray-900"
        >
          <input type="checkbox" className="rounded" />
          <span>{option.label}</span>
        </label>
      ))}
    </>
  );
}
