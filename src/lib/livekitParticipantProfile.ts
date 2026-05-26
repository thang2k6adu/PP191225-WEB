import { Participant as LiveKitParticipant } from 'livekit-client';

export type LiveKitParticipantMetadata = {
  avatarUrl?: string;
};

export function parseLiveKitParticipantMetadata(
  metadata?: string
): LiveKitParticipantMetadata {
  if (!metadata) return {};

  try {
    const parsed = JSON.parse(metadata) as LiveKitParticipantMetadata;
    return {
      avatarUrl:
        typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : undefined,
    };
  } catch {
    return {};
  }
}

export function getParticipantDisplayProfile(
  participant: LiveKitParticipant,
  options?: { isLocal?: boolean }
): { name: string; avatar: string } {
  const { avatarUrl } = parseLiveKitParticipantMetadata(participant.metadata);
  const fallbackName = options?.isLocal ? 'You' : 'Guest';

  const name = participant.name?.trim() || participant.identity || fallbackName;

  const avatar =
    avatarUrl || `https://i.pravatar.cc/150?u=${participant.identity}`;

  return { name, avatar };
}
