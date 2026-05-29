import { FilterCategory, FilterOption } from './types';

// Semantic color mapping
export const BUTTON_COLORS = {
  primary: 'bg-purple-600 hover:bg-purple-700',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
  active: 'bg-purple-600 text-white',
  inactive: 'bg-gray-100 text-gray-600',
};

// Filter options
export const CATEGORIES: FilterCategory[] = [
  { name: 'All', count: 120000 },
  { name: 'Gaming', count: 20000 },
  { name: 'Study', count: 20000 },
];

export const STATUS_OPTIONS: FilterOption[] = [
  { label: 'Available', value: 'available' },
  { label: 'Full', value: 'full' },
];

export const PRICE_OPTIONS: FilterOption[] = [
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
];

export const CAPACITY_OPTIONS: FilterOption[] = [
  { label: '1-10 People', value: '1-10' },
  { label: '10-20 People', value: '10-20' },
  { label: '20-50 People', value: '20-50' },
  { label: '50+ People', value: '50+' },
];

export const ROOM_OPTIONS: FilterOption[] = [
  { label: 'My Room', value: 'my-room' },
  { label: 'Public', value: 'public' },
];

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'A-Z', value: 'a-z' },
];
