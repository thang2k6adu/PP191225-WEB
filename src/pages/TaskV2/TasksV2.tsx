import { ActivitiesSidebar } from './sections/ActivitiesSidebar';
import { ChartsSection } from './sections/ChartsSection';
import { RecentActivities } from '@/components/RecentActivities';
import { Helmet } from 'react-helmet-async';

export default function TasksV2() {
  return (
    <>
      <Helmet>
        <title>Tasks - Focus Hub</title>
        <meta
          name="description"
          content="Manage your tasks and track progress"
        />
      </Helmet>

      <ActivitiesSidebar />

      <div className="col-span-9 space-y-8">
        <ChartsSection referenceX="May" />

        <RecentActivities />
      </div>
    </>
  );
}
