export type SortOption = 'newest' | 'oldest' | 'a-z';

export type Room = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  members: string[];
  isFavorite: boolean;
  currentMembers?: number;
  maxMembers?: number;
};

export type FilterCategory = {
  name: string;
  count?: number;
};

export type FilterOption = {
  label: string;
  value: string;
};
