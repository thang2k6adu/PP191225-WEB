import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
} from 'react-icons/lu';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import Modal from '@/components/Modal';

const Calendar: React.FC = () => {
  const { tasks, fetchTasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();

    const startDayOfWeek = firstDay.getDay();

    return { year, month, daysInMonth, startDayOfWeek };
  };

  const generateCalendarDays = () => {
    const { daysInMonth, startDayOfWeek } = getMonthData(currentDate);
    const days: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getTasksForDate = (day: number): Task[] => {
    if (!day) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];

    return tasks.filter(task => {
      const taskDate = new Date(task.deadline).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const tasksForDay = getTasksForDate(day);
    if (tasksForDay.length > 0) {
      setSelectedDate(clickedDate);
      setIsModalOpen(true);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-500';
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'DONE':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const calendarDays = generateCalendarDays();
  const { year } = getMonthData(currentDate);

  return (
    <>
      <Helmet>
        <title>Calendar - Donezo</title>
      </Helmet>
      <div className="space-y-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-700 tracking-wider">
              {monthNames[currentDate.getMonth()]}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="px-6 py-2 border-2 border-gray-900 rounded-full">
            <span className="text-2xl font-bold text-gray-900">{year}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="grid grid-cols-8">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div
                key={day}
                className="bg-gray-50 border-b border-r border-gray-300 p-4 text-center font-bold text-gray-600 text-sm tracking-wider"
              >
                {day}
              </div>
            ))}
            <div className="bg-gray-50 border-b border-gray-300 p-4 text-center font-bold text-gray-600 text-sm tracking-wider">
              NOTE
            </div>

            {Array.from({ length: 6 }).map((_, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {/* 7 days */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dayNumber = calendarDays[weekIndex * 7 + dayIndex];
                  const tasksForDay = dayNumber
                    ? getTasksForDate(dayNumber)
                    : [];
                  const today = isToday(dayNumber);

                  return (
                    <div
                      key={dayIndex}
                      onClick={() => handleDayClick(dayNumber)}
                      className={`border-r border-b border-gray-300 p-3 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                        today ? 'bg-emerald-50' : ''
                      }`}
                    >
                      {dayNumber && (
                        <>
                          <div
                            className={`text-xl italic mb-2 ${
                              today
                                ? 'font-bold text-emerald-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {dayNumber}
                          </div>
                          <div className="space-y-1">
                            {tasksForDay.slice(0, 3).map(task => (
                              <div
                                key={task.id}
                                className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                  task.status
                                )} text-white truncate`}
                                title={task.name}
                              >
                                {task.name}
                              </div>
                            ))}
                            {tasksForDay.length > 3 && (
                              <div className="text-xs text-gray-500 px-2">
                                +{tasksForDay.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                <div className="border-b border-gray-300 p-3 min-h-[120px] bg-gray-50">
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-dotted border-gray-300 h-3"
                      ></div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="font-semibold text-gray-700">Legend:</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-500 rounded"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        title={
          selectedDate
            ? `Tasks - ${selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}`
            : 'Tasks'
        }
      >
        <div className="space-y-3">
          {selectedDate &&
          getTasksForDate(selectedDate.getDate()).length > 0 ? (
            getTasksForDate(selectedDate.getDate()).map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{task.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Estimate: {task.estimateHours}h
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No tasks scheduled for this day
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
