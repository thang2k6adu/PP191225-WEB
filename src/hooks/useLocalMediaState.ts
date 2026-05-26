import { useCallback, useEffect, useState } from 'react';
import { RoomEvent } from 'livekit-client';
import { rtcManager } from '@/lib/rtcManager';
import { getParticipantMediaState } from '@/lib/livekitMediaState';

interface UseLocalMediaStateOptions {
  /** When false, skips event subscriptions (e.g. before token is available). */
  enabled?: boolean;
}

export function useLocalMediaState(options: UseLocalMediaStateOptions = {}) {
  const { enabled = true } = options;

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);

  const syncFromRoom = useCallback(() => {
    const room = rtcManager.getRoom();
    if (!room) {
      return;
    }

    const media = getParticipantMediaState(room.localParticipant);
    setIsMuted(media.isMuted);
    setIsVideoOff(media.isVideoOff);
  }, []);

  const toggleMic = useCallback(async () => {
    const room = rtcManager.getRoom();
    if (!room) {
      return;
    }

    const lp = room.localParticipant;
    await lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled);
    syncFromRoom();
  }, [syncFromRoom]);

  const toggleVideo = useCallback(async () => {
    const room = rtcManager.getRoom();
    if (!room) {
      return;
    }

    const lp = room.localParticipant;
    await lp.setCameraEnabled(!lp.isCameraEnabled);
    syncFromRoom();
  }, [syncFromRoom]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const room = rtcManager.getRoom();

    const onMediaChange = () => {
      syncFromRoom();
    };

    room.on(RoomEvent.TrackMuted, onMediaChange);
    room.on(RoomEvent.TrackUnmuted, onMediaChange);
    room.on(RoomEvent.LocalTrackPublished, onMediaChange);
    room.on(RoomEvent.LocalTrackUnpublished, onMediaChange);
    room.on(RoomEvent.Connected, onMediaChange);
    room.on(RoomEvent.Reconnected, onMediaChange);

    syncFromRoom();

    return () => {
      room.off(RoomEvent.TrackMuted, onMediaChange);
      room.off(RoomEvent.TrackUnmuted, onMediaChange);
      room.off(RoomEvent.LocalTrackPublished, onMediaChange);
      room.off(RoomEvent.LocalTrackUnpublished, onMediaChange);
      room.off(RoomEvent.Connected, onMediaChange);
      room.off(RoomEvent.Reconnected, onMediaChange);
    };
  }, [enabled, syncFromRoom]);

  return {
    isMuted,
    isVideoOff,
    toggleMic,
    toggleVideo,
    syncFromRoom,
  };
}
