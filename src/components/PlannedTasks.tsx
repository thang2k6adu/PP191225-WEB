import React, { useState } from 'react';
import { LuEllipsis as MoreHorizontal, LuPlay as Play } from 'react-icons/lu';

interface PlannedTask {
  id: string;
  title: string;
  dueDate: string;
  icon?: React.ReactNode;
  color?: string;
}

interface PlannedTasksProps {
  tasks: PlannedTask[];
  onAddTask?: () => void;
  onSelectTask?: (taskId: string) => void;
}

const PlannedTasks: React.FC<PlannedTasksProps> = ({
  tasks,
  onAddTask,
  onSelectTask,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const handleSelectTask = async (taskId: string) => {
    setLoadingTaskId(taskId);
    setSelectedTaskId(taskId);

    setTimeout(() => {
      onSelectTask?.(taskId);
      setLoadingTaskId(null);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Planned Tasks</h3>
        <button
          onClick={onAddTask}
          className="px-3 py-1.5 text-emerald-600 text-sm font-semibold hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
        >
          + NEW TASK
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.05}s forwards`,
              opacity: 0,
            }}
            onClick={() => handleSelectTask(task.id)}
            className={`flex items-center justify-between p-4 rounded-xl group cursor-pointer transition-all duration-300 ${
              loadingTaskId === task.id
                ? 'bg-emerald-50 border border-emerald-200 scale-105'
                : selectedTaskId === task.id
                  ? 'bg-emerald-50 border border-emerald-100'
                  : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Icon with animation */}
              <div
                className={`w-10 h-10 ${task.color || 'bg-emerald-100'} rounded-lg flex items-center justify-center transition-transform duration-300 ${
                  loadingTaskId === task.id
                    ? 'scale-110'
                    : 'group-hover:scale-105'
                }`}
              >
                <span className="text-lg">{task.icon || '📊'}</span>
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {task.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  Due date: {task.dueDate}
                </p>
              </div>
            </div>

            <div className="ml-2 flex items-center space-x-2">
              {loadingTaskId === task.id ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <button
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all duration-200 text-emerald-600 hover:text-emerald-700"
                  title="Activate task"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}
              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all duration-200">
                <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div
            className="text-center py-8 animate-fadeIn"
            style={{
              animation: 'fadeIn 0.4s ease-out forwards',
            }}
          >
            <p className="text-gray-500 mb-2">No planned tasks yet.</p>
            <p className="text-sm text-gray-400">Create one to get started!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PlannedTasks;
