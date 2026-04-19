// Static data & local types for ProfileV2

export interface EditFormData {
  firstName: string;
  lastName: string;
  contactEmail: string;
  work: string;
  major: string;
  bio: string;
}

export interface RecentActivity {
  title: string;
  duration: string;
}

export const RECENT_ACTIVITIES: RecentActivity[] = [
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
  { title: 'Finish Homework', duration: '2h30m' },
];
