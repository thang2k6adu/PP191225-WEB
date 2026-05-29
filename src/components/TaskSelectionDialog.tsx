import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '@/hooks/useTasks';
import { useTrackingSession } from '@/hooks/useTrackingSession';
import Modal from './Modal';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import type { ActivateTaskData } from '@/types/trackingSession';

interface TaskSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSelected: (result: ActivateTaskData) => void;
}

const TaskSelectionDialog: React.FC<TaskSelectionDialogProps> = ({
  isOpen,
  onClose,
  onTaskSelected,
}) => {
  const { t } = useTranslation();
  const { tasks, isLoading, fetchTasks } = useTasks();
  const { activateTask, isLoading: isActivating } = useTrackingSession();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen, fetchTasks]);

  const handleConfirm = async () => {
    if (!selectedTaskId) return;

    try {
      const result = await activateTask(selectedTaskId);

      if (result) {
        onTaskSelected(result);
        onClose();
      }
    } catch (error) {
      console.error('Failed to activate task:', error);
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('tasks.selectTask')}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('tasks.selectTaskDescription')}
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('tasks.noTasksAvailable')}
              </div>
            ) : (
              tasks
                .filter(task => task.status !== 'DONE')
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTaskId === task.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {task.name}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span>⏱</span>
                            <span>
                              {task.totalTimeSpent
                                ? formatTime(task.totalTimeSpent)
                                : '0h 0m'}{' '}
                              / {task.estimateHours}h
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t('tasks.progress')}
                            </span>
                            <span className="font-medium">
                              {task.progress?.toFixed(1) || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getProgressBarColor(task.progress || 0)}`}
                              style={{ width: `${task.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Radio indicator */}
                      <div className="ml-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedTaskId === task.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedTaskId === task.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isActivating}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTaskId || isActivating}
            isLoading={isActivating}
          >
            {t('tasks.confirmSelection')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskSelectionDialog;
