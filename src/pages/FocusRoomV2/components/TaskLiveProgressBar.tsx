import React, { useEffect, useState } from 'react';
import { computeLiveTaskProgress } from '@/lib/roomParticipantMetadata';

interface TaskLiveProgressBarProps {
  baseProgress?: number;
  estimateSeconds?: number;
  sessionStartTime?: string;
}

export const TaskLiveProgressBar: React.FC<TaskLiveProgressBarProps> = ({
  baseProgress = 0,
  estimateSeconds,
  sessionStartTime,
}) => {
  const canTick = Boolean(
    sessionStartTime && estimateSeconds && estimateSeconds > 0
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!canTick) return;

    const id = window.setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [canTick, sessionStartTime, estimateSeconds]);

  const progress = computeLiveTaskProgress(
    baseProgress,
    estimateSeconds,
    sessionStartTime
  );

  return (
    <div className="mt-1 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
