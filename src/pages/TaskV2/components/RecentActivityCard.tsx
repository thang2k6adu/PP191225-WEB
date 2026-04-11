import { RecentActivity } from '../types';

export function RecentActivityCard({ title, time }: RecentActivity) {
  return (
    <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
