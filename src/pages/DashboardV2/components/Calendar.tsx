import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
} from 'react-icons/lu';

type CalendarDay = {
  day: number;
  offset: -1 | 0 | 1;
};

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startWeekDay = firstDayOfMonth.getDay(); // 0–6
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startWeekDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      offset: -1,
    });
  }

  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push({ day: d, offset: 0 });
  }

  let nextDay = 1;
  while (days.length < 42) {
    days.push({ day: nextDay++, offset: 1 });
  }

  return days;
}

export function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = React.useState<{
    day: number;
    offset: -1 | 0 | 1;
  } | null>({
    day: today.getDate(),
    offset: 0,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getCalendarDays(year, month);
  // const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const isToday = (d: CalendarDay) =>
    d.offset === 0 &&
    d.day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (d: CalendarDay) =>
    selected && selected.day === d.day && selected.offset === d.offset;

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h5-bold">
            {currentDate.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {d}
            </div>
          ))}
        </div> */}

        <div className="grid grid-cols-7">
          {days.map((d, index) => {
            const selected = isSelected(d);
            const today = isToday(d);

            return (
              <div
                key={index}
                onClick={() => setSelected(d)}
                className={`
          relative text-caption-lg-regular py-2 rounded cursor-pointer transition
          border border-gray-300 w-fill h-[50px] flex items-center justify-center
          ${d.offset !== 0 ? 'text-gray-400' : 'text-gray-700'}
          ${today ? 'bg-violet-600 text-white' : ''}
          ${selected ? 'ring-2 ring-violet-600 ring-offset-1 z-10' : 'hover:bg-gray-50 z-0'}
        `}
              >
                {d.day}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
