import React from 'react';
import { Participant } from '../types';
import { ParticipantCard } from '../components/ParticipantCard';

interface ParticipantsGridSectionProps {
  participants: Participant[];
  videoRefsMap?: Map<string, HTMLDivElement>;
}

const getDesktopGridCols = (count: number) => {
  if (count <= 1) return 'md:grid-cols-1';
  if (count === 2) return 'md:grid-cols-2';
  if (count <= 4) return 'md:grid-cols-2';
  if (count <= 6) return 'md:grid-cols-3';
  if (count <= 9) return 'md:grid-cols-3';
  return 'md:grid-cols-4';
};

export const ParticipantsGridSection: React.FC<
  ParticipantsGridSectionProps
> = ({ participants, videoRefsMap }) => {
  const desktopCols = getDesktopGridCols(participants.length);

  return (
    <div className="flex-1 p-2 md:p-4 overflow-hidden">
      <div
        className={`
          grid grid-cols-1 sm:grid-cols-2
          ${desktopCols}
          gap-2 md:gap-3
          w-full h-full
          max-w-7xl mx-auto
        `}
      >
        {participants.map(participant => (
          <div key={participant.id} className="w-full h-full">
            <ParticipantCard
              participant={participant}
              videoRef={el => {
                if (el && videoRefsMap) {
                  // Always update the ref for this participant (force re-attach)
                  videoRefsMap.set(participant.id, el);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
