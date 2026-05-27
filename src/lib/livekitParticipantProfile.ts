import { Participant as LiveKitParticipant } from 'livekit-client';
import {
  getParticipantTaskInfo,
  parseRoomParticipantMetadata,
} from '@/lib/roomParticipantMetadata';

export function getParticipantDisplayProfile(
  participant: LiveKitParticipant,
  options?: { isLocal?: boolean }
): { name: string; avatar: string } {
  const { avatarUrl } = parseRoomParticipantMetadata(participant.metadata);
  const fallbackName = options?.isLocal ? 'You' : 'Guest';

  const name = participant.name?.trim() || participant.identity || fallbackName;

  const avatar =
    avatarUrl || `https://i.pravatar.cc/150?u=${participant.identity}`;

  return { name, avatar };
}

export { getParticipantTaskInfo };
