import { Participant, Track, TrackPublication } from 'livekit-client';

export interface ParticipantMediaState {
  isMuted: boolean;
  isVideoOff: boolean;
}

export function getParticipantMediaState(
  participant: Participant
): ParticipantMediaState {
  const camPub = participant.getTrackPublication(Track.Source.Camera);
  const micPub = participant.getTrackPublication(Track.Source.Microphone);

  const isVideoOff = !camPub || camPub.isMuted;

  const isMuted = !micPub || micPub.isMuted;

  return { isMuted, isVideoOff };
}

export function shouldAttachVideoPublication(pub: TrackPublication): boolean {
  return Boolean(pub.track && pub.isSubscribed && !pub.isMuted);
}

export function hasActiveCameraVideo(participant: Participant): boolean {
  return Array.from(participant.videoTrackPublications.values()).some(
    shouldAttachVideoPublication
  );
}
