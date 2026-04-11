import { Room, FilterCategory, FilterOption } from './types';

// Semantic color mapping
export const BUTTON_COLORS = {
  primary: 'bg-purple-600 hover:bg-purple-700',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
  active: 'bg-purple-600 text-white',
  inactive: 'bg-gray-100 text-gray-600',
};

// Rooms data
export const ROOMS: Room[] = [
  {
    id: 1,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    members: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
    ],
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    members: [
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5',
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=6',
    ],
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    members: [
      'https://i.pravatar.cc/150?img=7',
      'https://i.pravatar.cc/150?img=8',
      'https://i.pravatar.cc/150?img=9',
    ],
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    members: [
      'https://i.pravatar.cc/150?img=10',
      'https://i.pravatar.cc/150?img=11',
      'https://i.pravatar.cc/150?img=12',
    ],
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869',
    members: [
      'https://i.pravatar.cc/150?img=13',
      'https://i.pravatar.cc/150?img=14',
      'https://i.pravatar.cc/150?img=15',
    ],
    isFavorite: false,
  },
  {
    id: 6,
    title: 'Coffe & Coffie',
    subtitle: "Let's study and be productive",
    image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
    members: [
      'https://i.pravatar.cc/150?img=16',
      'https://i.pravatar.cc/150?img=17',
      'https://i.pravatar.cc/150?img=18',
    ],
    isFavorite: false,
  },
];

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
