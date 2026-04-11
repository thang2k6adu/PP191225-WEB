import { WelcomeSection } from './sections/WelcomeSection';
import { StatsSection } from './sections/StatsSection';
import { ChartsSection } from './sections/ChartsSection';
import { WorkProgressSection } from './sections/WorkProgressSection';
import { SidebarSection } from './sections/SidebarSection';
import {
  DASHBOARD_STATS,
  WORK_PROGRESS_TASKS,
  UPCOMING_TASKS,
} from './constants';

function DashboardV2() {
  return (
    <>
      <section
        className="
          col-span-1
          lg:col-span-8
          flex flex-col gap-6
        "
      >
        <WelcomeSection />
        <StatsSection stats={DASHBOARD_STATS} />
        <ChartsSection />
        <WorkProgressSection tasks={WORK_PROGRESS_TASKS} />
      </section>

      <section
        className="
          col-span-1
          lg:col-span-4
          flex flex-col gap-6
        "
      >
        <SidebarSection upcomingTasks={UPCOMING_TASKS} />
      </section>
    </>
  );
}

export default DashboardV2;
