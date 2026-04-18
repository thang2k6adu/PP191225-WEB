import { Calendar } from '../components/Calendar';
import { RecentActivities } from '@/components/RecentActivities';

export function SidebarSection() {
  return (
    <>
      <Calendar />
      <RecentActivities />
    </>
  );
}
