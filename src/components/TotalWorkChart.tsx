import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { LuChevronDown as ChevronDown } from 'react-icons/lu';
import { TaskStatsPeriod } from '@/types/task';

type TaskChartData = {
  month: string;
  Tasks: number;
};

type TotalWorkChartProps = {
  data: TaskChartData[];
  yLabel?: string;
  referenceX?: string;
  period?: TaskStatsPeriod;
  onPeriodChange?: (period: TaskStatsPeriod) => void;
};

export default function TotalWorkChart({
  data,
  yLabel = 'Tasks',
  referenceX,
  period = 'month',
  onPeriodChange,
}: TotalWorkChartProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end">
        <div className="relative">
          <select
            value={period}
            onChange={e => onPeriodChange?.(e.target.value as TaskStatsPeriod)}
            className="appearance-none flex items-center gap-1.5 px-2.5 py-1 pr-7 border border-slate-200 rounded-md text-caption-sm-regular text-muted-foreground hover:bg-slate-50 bg-white"
          >
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
            <ChevronDown size={14} />
          </span>
        </div>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0 }}>
            <defs>
              <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{
                value: yLabel,
                angle: -90,
                position: 'insideLeft',
                dx: 10,
                style: {
                  textAnchor: 'middle',
                  fill: '#0f172a',
                  fontWeight: 600,
                  fontSize: 13,
                },
              }}
            />

            <Tooltip />

            {referenceX && (
              <ReferenceLine
                x={referenceX}
                stroke="#fb923c"
                strokeDasharray="4 4"
              />
            )}

            <Area
              type="monotone"
              dataKey="Tasks"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#fillBlue)"
              dot={false}
              activeDot={{
                r: 6,
                fill: '#fff',
                stroke: '#fb923c',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
