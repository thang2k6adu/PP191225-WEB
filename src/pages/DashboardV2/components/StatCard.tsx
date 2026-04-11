import { Card, CardContent } from '@/components/ui/card';
import { StatCardProps } from '../types';

export function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <Card
      className={`${color} w-full border-0 text-white shadow-md rounded-md`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <img src={icon} alt="" className="h-6 w-6" />
          </div>

          <div className="flex flex-col">
            <span className="text-h5-regular">{value}</span>
            <span className="text-caption-lg-medium">{label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
