import { StatCard } from '../components/StatCard';
import { StatCardProps } from '../types';

type StatsSectionProps = {
  stats: StatCardProps[];
};

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
