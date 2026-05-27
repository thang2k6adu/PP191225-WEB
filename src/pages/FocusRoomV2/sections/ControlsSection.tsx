import React from 'react';
import {
  LuVideo as Video,
  LuMic as Mic,
  LuMicOff as MicOff,
  LuVideoOff as VideoOff,
  LuPhoneOff as PhoneOff,
  LuListChecks as ListChecks,
} from 'react-icons/lu';
import { ControlButton } from '../components/ControlButton';
import { FocusRoomState } from '../types';

interface ControlsSectionProps {
  state: FocusRoomState;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onSelectTask: () => void;
  onLeave: () => void;
  onMoreOptions: () => void;
  selectedTaskName?: string;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  state,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onSelectTask,
  onLeave,
  onMoreOptions,
  selectedTaskName,
}) => {
  return (
    <div className="bg-gray-800 px-6 py-4">
      {selectedTaskName && (
        <p className="text-center text-xs text-gray-400 mb-2 truncate max-w-md mx-auto">
          Đang làm: <span className="text-gray-200">{selectedTaskName}</span>
        </p>
      )}
      <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
        <ControlButton
          icon={state.isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          onClick={onToggleMute}
          variant={state.isMuted ? 'danger' : 'default'}
          ariaLabel={state.isMuted ? 'Unmute' : 'Mute'}
        />

        <ControlButton
          icon={state.isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          onClick={onToggleVideo}
          variant={state.isVideoOff ? 'danger' : 'default'}
          ariaLabel={state.isVideoOff ? 'Turn on video' : 'Turn off video'}
        />

        <ControlButton
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          }
          onClick={onToggleScreenShare}
          ariaLabel="Share screen"
        />

        <ControlButton
          icon={<ListChecks size={24} />}
          onClick={onSelectTask}
          ariaLabel="Chọn task"
        />

        <ControlButton
          icon={<PhoneOff size={24} />}
          onClick={onLeave}
          variant="danger"
          ariaLabel="Leave call"
        />

        <ControlButton
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          }
          onClick={onMoreOptions}
          ariaLabel="More options"
        />
      </div>
    </div>
  );
};
