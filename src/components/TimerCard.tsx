import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LuPause as Pause,
  LuPlay as Play,
  LuSquare as Square,
} from 'react-icons/lu';
import { updateRemainingTime } from '@/store/slices/taskSlice';
import { RootState } from '@/store';

interface TimerCardProps {
  initialTime?: number; // in seconds (estimate time)
  isActive?: boolean; // Whether task is active (controls auto-run)
  onComplete?: () => void; // Callback khi hết giờ
  onProgressChange?: (percentage: number) => void; // Callback để update progress
}

const TimerCard: React.FC<TimerCardProps> = ({
  initialTime = 5048,
  isActive = false,
  onComplete,
  onProgressChange,
}) => {
  const dispatch = useDispatch();
  const activeTask = useSelector((state: RootState) => state.task.activeTask);

  const persistedTime = activeTask?.remainingTime ?? initialTime;
  const [time, setTime] = useState(persistedTime);
  const [isRunning, setIsRunning] = useState(isActive);

  useEffect(() => {
    if (isActive && activeTask) {
      const timeToSet = activeTask.remainingTime ?? initialTime;
      setTime(timeToSet);
      setIsRunning(true);
    } else {
      setTime(0);
      setIsRunning(false);
    }
  }, [activeTask, isActive, initialTime]);

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
      setTime(0);
    } else if (isActive && activeTask && time > 0) {
      setIsRunning(true);
    }
  }, [isActive, activeTask, time]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            dispatch(updateRemainingTime(0));
            if (onComplete) {
              setTimeout(() => onComplete(), 500);
            }
            if (onProgressChange) {
              onProgressChange(100);
            }
            return 0;
          }
          const newTime = prevTime - 1;
          if (newTime % 5 === 0) {
            dispatch(updateRemainingTime(newTime));
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dispatch, isRunning, onComplete, onProgressChange, time]);

  useEffect(() => {
    if (onProgressChange) {
      if (time === 0 && !isActive) {
        onProgressChange(0);
      } else if (initialTime > 0) {
        const percentage = Math.round(
          ((initialTime - time) / initialTime) * 100
        );
        onProgressChange(percentage);
      }
    }
  }, [time, initialTime, isActive, onProgressChange]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/30 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-700/20 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="text-sm text-emerald-300 mb-4">
          Time Remaining {time === 0 && '(Completed!)'}
        </div>
        <div
          className={`text-6xl font-bold mb-8 text-center ${time === 0 ? 'text-red-400' : ''}`}
        >
          {formatTime(time)}
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={time === 0}
            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center transition-colors shadow-lg ${
              time === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            {isRunning ? (
              <Pause className="w-5 h-5 text-gray-900" />
            ) : (
              <Play className="w-5 h-5 text-gray-900" />
            )}
          </button>
          <button
            onClick={() => {
              setTime(initialTime);
              setIsRunning(false);
            }}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <Square className="w-5 h-5 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerCard;
