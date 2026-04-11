import { Calendar } from '../components/Calendar';
import { RecentActivities } from '@/components/RecentActivities';
import { RecentActivity } from '@/components/RecentActivities';

type SidebarSectionProps = {
  upcomingTasks: RecentActivity[];
};

export function SidebarSection({ upcomingTasks }: SidebarSectionProps) {
  return (
    <>
      <Calendar />
      <RecentActivities tasks={upcomingTasks} />
    </>
  );
}
