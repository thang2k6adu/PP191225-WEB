import React from 'react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  videoRef?: (el: HTMLDivElement | null) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = React.memo(
  ({ participant, videoRef }) => {
    // Show avatar/overlay only if no video track or track is muted
    // (isVideoOff is now always synced to actual track mute state)
    return (
      <div className="relative w-full h-full aspect-video bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition">
        {/* Video container - always render for LiveKit to attach */}
        <div ref={videoRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Show avatar only when video is off (no track or muted) */}
        {participant.isVideoOff && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold text-gray-300">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-black/0 z-20">
          <div className="text-xs font-medium text-white truncate">
            {participant.name}
          </div>

          {participant.taskTitle && (
            <div className="text-[10px] text-gray-300 truncate">
              {participant.taskTitle}
            </div>
          )}

          {typeof participant.progress === 'number' && (
            <div className="mt-1 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${participant.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if participant state actually changed
    return (
      prevProps.participant.id === nextProps.participant.id &&
      prevProps.participant.isVideoOff === nextProps.participant.isVideoOff &&
      prevProps.participant.isMuted === nextProps.participant.isMuted &&
      prevProps.participant.name === nextProps.participant.name
    );
  }
);
