import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  ConnectionState,
  Participant as LiveKitParticipant,
  TrackPublication,
  LocalTrackPublication,
} from 'livekit-client';
import { rtcManager } from '@/lib/rtcManager';
import {
  getParticipantMediaState,
  shouldAttachVideoPublication,
} from '@/lib/livekitMediaState';
import {
  getParticipantDisplayProfile,
  getParticipantTaskFields,
  syncRoomParticipantTask,
} from '@/lib/roomParticipantMetadata';
import { taskService } from '@/services/taskService';
import { ParticipantsGridSection } from '@/pages/FocusRoomV2/sections/ParticipantsGridSection';
import { Participant } from '@/pages/FocusRoomV2/types';

interface VideoRoomProps {
  livekitUrl: string;
  token: string;
  onDisconnect?: () => void;
  initialVideoOff?: boolean;
  initialAudioOff?: boolean;
}

type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export const VideoRoom: React.FC<VideoRoomProps> = ({
  livekitUrl,
  token,
  onDisconnect,
  initialVideoOff = true,
  initialAudioOff = true,
}) => {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const isMountedRef = useRef(true);
  const videoRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const trackElementsMap = useRef<
    Map<string, HTMLVideoElement | HTMLAudioElement>
  >(new Map());
  const connectionConfig = useRef({ url: livekitUrl, token });

  const room = rtcManager.getRoom();

  const updateParticipants = useCallback(() => {
    if (!room || !isMountedRef.current) return;

    setParticipants(() => {
      const newParticipants: Participant[] = [];
      const localParticipant = room.localParticipant;
      const localId = localParticipant.identity || 'local';
      const localMedia = getParticipantMediaState(localParticipant);
      const localProfile = getParticipantDisplayProfile(localParticipant, {
        isLocal: true,
      });
      const localTask = getParticipantTaskFields(localParticipant);

      newParticipants.push({
        id: localId,
        name: localProfile.name,
        avatar: localProfile.avatar,
        isMuted: localMedia.isMuted,
        isVideoOff: localMedia.isVideoOff,
        isActive: true,
        ...localTask,
      });

      room.remoteParticipants.forEach(participant => {
        const remoteMedia = getParticipantMediaState(participant);
        const remoteProfile = getParticipantDisplayProfile(participant);
        const remoteTask = getParticipantTaskFields(participant);

        newParticipants.push({
          id: participant.identity,
          name: remoteProfile.name,
          avatar: remoteProfile.avatar,
          isMuted: remoteMedia.isMuted,
          isVideoOff: remoteMedia.isVideoOff,
          isActive: true,
          ...remoteTask,
        });
      });

      return newParticipants;
    });
  }, [room]);

  const attachVideoToParticipant = useCallback(
    (
      participantId: string,
      trackSid: string,
      videoElement: HTMLVideoElement | HTMLAudioElement
    ) => {
      const container = videoRefsMap.current.get(participantId);
      console.log('[VideoRoom] attachVideoToParticipant:', {
        participantId,
        trackSid,
        hasContainer: !!container,
        videoRefsMapSize: videoRefsMap.current.size,
        videoRefsMapKeys: Array.from(videoRefsMap.current.keys()),
      });

      if (container && videoElement) {
        if (videoElement.tagName === 'VIDEO') {
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          videoElement.style.position = 'absolute';
          videoElement.style.top = '0';
          videoElement.style.left = '0';
        }

        container.appendChild(videoElement);
        trackElementsMap.current.set(trackSid, videoElement);
        console.log('[VideoRoom] Video element attached successfully');
      } else {
        console.warn(
          '[VideoRoom] Cannot attach video - missing container or element'
        );
      }
    },
    []
  );

  const clearLocalVideoPreview = useCallback(() => {
    if (!room) return;

    const localId = room.localParticipant.identity || 'local';
    const container = videoRefsMap.current.get(localId);
    if (!container) return;

    Array.from(trackElementsMap.current.entries()).forEach(
      ([trackSid, element]) => {
        if (container.contains(element)) {
          element.remove();
          trackElementsMap.current.delete(trackSid);
        }
      }
    );
  }, [room]);

  const renderLocalVideo = useCallback(() => {
    if (!room) return;

    const localParticipant = room.localParticipant;

    const cameraPublication = localParticipant.getTrackPublication(
      Track.Source.Camera
    );

    if (!cameraPublication?.track || cameraPublication.isMuted) {
      return;
    }

    clearLocalVideoPreview();

    const element = cameraPublication.track.attach();
    const localId = localParticipant.identity || 'local';

    attachVideoToParticipant(localId, cameraPublication.trackSid, element);
  }, [room, attachVideoToParticipant, clearLocalVideoPreview]);

  // Attach video immediately when trackSubscribed event fires
  const handleTrackSubscribed = useCallback(
    (
      track: RemoteTrack,
      pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log('[VideoRoom] Track subscribed:', {
        kind: track.kind,
        participantIdentity: participant.identity,
        participantSid: participant.sid,
        trackSid: track.sid,
        publicationTrackSid: pub.trackSid,
      });

      if (track.kind === Track.Kind.Video) {
        const element = track.attach();
        attachVideoToParticipant(participant.identity, pub.trackSid, element);
        updateParticipants();
      }
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        audioElement.setAttribute('data-participant', participant.identity);
        audioElement.setAttribute('data-track-sid', pub.trackSid);
        trackElementsMap.current.set(pub.trackSid, audioElement);
        document.body.appendChild(audioElement);
        updateParticipants();
      }
    },
    [attachVideoToParticipant, updateParticipants]
  );

  const handleTrackUnsubscribed = useCallback(
    (
      track: RemoteTrack,
      pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log('[VideoRoom] Track unsubscribed:', {
        kind: track.kind,
        participantIdentity: participant.identity,
        participantSid: participant.sid,
        trackSid: pub.trackSid,
      });

      const element = trackElementsMap.current.get(pub.trackSid);
      if (element) {
        element.remove();
        trackElementsMap.current.delete(pub.trackSid);
        console.log('[VideoRoom] Removed track element:', pub.trackSid);
      }

      track.detach().forEach((el: Element) => {
        if (el !== element) el.remove();
      });

      setTimeout(() => {
        if (isMountedRef.current) {
          updateParticipants();
        }
      }, 100);
    },
    [updateParticipants]
  );

  const handleConnectionStateChanged = useCallback((state: ConnectionState) => {
    if (!isMountedRef.current) return;
    switch (state) {
      case ConnectionState.Connected:
        setStatus('connected');
        setError(null);
        break;
      case ConnectionState.Connecting:
        setStatus('connecting');
        break;
      case ConnectionState.Reconnecting:
        setStatus('reconnecting');
        break;
      case ConnectionState.Disconnected:
        setStatus('disconnected');
        break;
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    if (isMountedRef.current) {
      setStatus('disconnected');
      setParticipants([]);
      onDisconnect?.();
    }
  }, [onDisconnect]);

  // Attach all video tracks for a participant when they connect
  const handleParticipantConnected = useCallback(() => {
    updateParticipants();
  }, [updateParticipants]);

  const handleParticipantDisconnected = useCallback(
    () => updateParticipants(),
    [updateParticipants]
  );

  const handleParticipantMetadataChanged = useCallback(
    (_metadata: string | undefined, participant: LiveKitParticipant) => {
      console.log('[VideoRoom] Participant metadata changed:', {
        identity: participant.identity,
        metadata: participant.metadata,
      });
      updateParticipants();
    },
    [updateParticipants]
  );

  const syncActiveTaskFromBackend = useCallback(async () => {
    try {
      const response = await taskService.getActiveTask();
      const activeTask = response.data;

      if (!activeTask || !isMountedRef.current) {
        return;
      }

      await syncRoomParticipantTask({
        id: activeTask.id,
        name: activeTask.name,
        progress: activeTask.progress,
        estimateSeconds: activeTask.estimateHours * 3600,
        sessionStartTime: activeTask.currentSessionStartTime ?? undefined,
      });

      if (isMountedRef.current) {
        updateParticipants();
      }
    } catch (error) {
      console.warn('[VideoRoom] Failed to sync active task metadata:', error);
    }
  }, [updateParticipants]);

  const handleLocalTrackPublished = useCallback(
    (publication: LocalTrackPublication) => {
      if (publication.source === Track.Source.Camera) {
        renderLocalVideo();
      }
      updateParticipants();
    },
    [renderLocalVideo, updateParticipants]
  );

  const handleTrackMuted = useCallback(
    (publication: TrackPublication, participant: LiveKitParticipant) => {
      if (
        publication.source === Track.Source.Camera &&
        participant.identity === room.localParticipant.identity
      ) {
        clearLocalVideoPreview();
      }
      updateParticipants();
    },
    [room, clearLocalVideoPreview, updateParticipants]
  );

  const handleTrackUnmuted = useCallback(
    (publication: TrackPublication, participant: LiveKitParticipant) => {
      if (
        publication.source === Track.Source.Camera &&
        participant.identity === room.localParticipant.identity
      ) {
        renderLocalVideo();
      }
      updateParticipants();
    },
    [room, renderLocalVideo, updateParticipants]
  );

  const connectToRoom = useCallback(async () => {
    if (!isMountedRef.current) return;

    // Skip if already connected or connecting
    const currentStatus = status;
    if (currentStatus === 'connected' || currentStatus === 'connecting') {
      console.log('[VideoRoom] Skipping connect - already', currentStatus);
      return;
    }

    try {
      setStatus('connecting');
      await rtcManager.connect(
        connectionConfig.current.url,
        connectionConfig.current.token
      );
      if (!isMountedRef.current) return;

      setStatus('connected');

      const localParticipant = room.localParticipant;

      // Apply initial states
      await localParticipant.setCameraEnabled(!initialVideoOff);
      await localParticipant.setMicrophoneEnabled(!initialAudioOff);

      // This creates participant containers so video can be attached safely.
      // We must update participants before attaching video tracks.
      updateParticipants();

      await syncActiveTaskFromBackend();

      if (!initialVideoOff) {
        setTimeout(() => renderLocalVideo(), 100);
      }

      console.log('[VideoRoom] Attaching existing remote tracks...');
      room.remoteParticipants.forEach(participant => {
        participant.videoTrackPublications.forEach(pub => {
          if (shouldAttachVideoPublication(pub) && pub.track) {
            console.log(
              '[VideoRoom] Attaching existing video track from:',
              participant.identity
            );
            const element = pub.track.attach();
            attachVideoToParticipant(
              participant.identity,
              pub.trackSid,
              element
            );
          }
        });

        participant.audioTrackPublications.forEach(pub => {
          if (pub.track && pub.isSubscribed && !pub.isMuted) {
            console.log(
              '[VideoRoom] Attaching existing audio track from:',
              participant.identity
            );
            const audioElement = pub.track.attach();
            audioElement.setAttribute('data-participant', participant.identity);
            audioElement.setAttribute('data-track-sid', pub.trackSid);
            trackElementsMap.current.set(pub.trackSid, audioElement);
            document.body.appendChild(audioElement);
          }
        });
      });
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
        setStatus('error');
      }
    }
  }, [
    room,
    renderLocalVideo,
    updateParticipants,
    initialVideoOff,
    initialAudioOff,
    attachVideoToParticipant,
    syncActiveTaskFromBackend,
    status,
  ]);

  useEffect(() => {
    rtcManager.setLocalCameraPreviewHandler(() => {
      if (isMountedRef.current) {
        renderLocalVideo();
      }
    });

    return () => {
      rtcManager.setLocalCameraPreviewHandler(null);
    };
  }, [renderLocalVideo]);

  useEffect(() => {
    console.log('[VideoRoom] Component mounted');
    isMountedRef.current = true;

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
    room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
    room.on(RoomEvent.TrackMuted, handleTrackMuted);
    room.on(RoomEvent.TrackUnmuted, handleTrackUnmuted);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    room.on(
      RoomEvent.ParticipantMetadataChanged,
      handleParticipantMetadataChanged
    );

    connectToRoom();

    return () => {
      console.log('[VideoRoom] Component unmounting - keep room alive');
      isMountedRef.current = false;

      // Clean up listeners only, DO NOT disconnect room
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.off(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
      room.off(RoomEvent.TrackMuted, handleTrackMuted);
      room.off(RoomEvent.TrackUnmuted, handleTrackUnmuted);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(
        RoomEvent.ParticipantDisconnected,
        handleParticipantDisconnected
      );
      room.off(
        RoomEvent.ParticipantMetadataChanged,
        handleParticipantMetadataChanged
      );
    };
  }, [
    room,
    connectToRoom,
    handleTrackSubscribed,
    handleTrackUnsubscribed,
    handleLocalTrackPublished,
    handleTrackMuted,
    handleTrackUnmuted,
    handleDisconnected,
    handleConnectionStateChanged,
    handleParticipantConnected,
    handleParticipantDisconnected,
    handleParticipantMetadataChanged,
  ]);

  const renderStatusOverlay = () => {
    if (status === 'error' && error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <p className="text-red-500 mb-4">❌ {error}</p>
            <button
              onClick={onDisconnect}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      );
    }
    if (status === 'connecting') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Connecting...</p>
          </div>
        </div>
      );
    }
    if (status === 'reconnecting') {
      return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span className="font-medium">Reconnecting...</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      <ParticipantsGridSection
        participants={participants}
        videoRefsMap={videoRefsMap.current}
      />
      {renderStatusOverlay()}
    </div>
  );
};
