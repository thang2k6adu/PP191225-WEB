import React from 'react';
import { LuSettings as Settings } from 'react-icons/lu';

interface HeaderSectionProps {
  roomName: string;
  onSettingsClick?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  roomName,
  onSettingsClick,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-sm font-bold">
          F
        </div>
        <span className="font-semibold">{roomName}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-gray-700 rounded-full transition"
          onClick={onSettingsClick}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};
