import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Track } from 'livekit-client';
import { HeaderSection } from './sections/HeaderSection';
import { ControlsSection } from './sections/ControlsSection';
import { FocusRoomState } from './types';
import { useRooms } from '@/hooks/useRooms';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { VideoRoom } from '@/components/VideoRoom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { rtcManager } from '@/lib/rtcManager';

const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server.com';

const FocusRoom: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ roomId: string }>();
  const { currentRoom, fetchRoomDetail, joinRoom, leaveRoom } = useRooms();
  const { matchData } = useMatchmaking();
  const [state, setState] = useState<FocusRoomState>({
    isMuted: true,
    isVideoOff: false,
    isScreenSharing: false,
    showSettings: false,
  });

  const roomId = params.roomId;
  const livekitToken = currentRoom?.token || matchData?.token;
  const roomName =
    currentRoom?.topic ||
    (matchData?.opponentName
      ? `Match with ${matchData.opponentName}`
      : 'Focus Room');

  const hasFetchedRef = useRef(false);
  const hasJoinedRef = useRef(false);
  const isLeavingRef = useRef(false);

  // Join room on mount if not already joined
  useEffect(() => {
    if (isLeavingRef.current || !roomId) {
      return;
    }

    // If no token, need to join/rejoin room
    if (!livekitToken && !hasJoinedRef.current) {
      console.log('[FocusRoom] No token, joining room:', roomId);
      hasJoinedRef.current = true;
      joinRoom(roomId);
      return;
    }

    // Fetch room details if we have currentRoom
    if (currentRoom && !hasFetchedRef.current) {
      fetchRoomDetail(roomId);
      hasFetchedRef.current = true;
    }
  }, [roomId, livekitToken, currentRoom, joinRoom, fetchRoomDetail]);

  // Redirect if no roomId
  useEffect(() => {
    if (!roomId && !isLeavingRef.current) {
      console.log('[FocusRoom] No roomId, redirecting...');
      navigate('/v2/focus', { replace: true });
    }
  }, [roomId, navigate]);

  // Sync state with LiveKit tracks after connection
  useEffect(() => {
    const syncStateWithTracks = () => {
      const room = rtcManager.getRoom();
      if (!room) return;

      const lp = room.localParticipant;
      const camPub = lp.getTrackPublication(Track.Source.Camera);
      const micPub = lp.getTrackPublication(Track.Source.Microphone);

      if (camPub) {
        setState(prev => ({ ...prev, isVideoOff: camPub.isMuted }));
      }
      if (micPub) {
        setState(prev => ({ ...prev, isMuted: micPub.isMuted }));
      }
    };

    // Sync after room connects and tracks are published
    const timer = setTimeout(syncStateWithTracks, 1000);
    return () => clearTimeout(timer);
  }, [livekitToken]);

  const handleToggleMute = async () => {
    const room = rtcManager.getRoom();
    if (!room) return;

    const lp = room.localParticipant;
    const micPub = lp.getTrackPublication(Track.Source.Microphone);

    // 🚀 LẦN ĐẦU: chưa có track → publish
    if (!micPub) {
      console.log('[FocusRoom] Publishing microphone track for the first time');
      await lp.setMicrophoneEnabled(true);
      setState(prev => ({ ...prev, isMuted: false }));
      return;
    }

    // ✅ ĐÃ CÓ TRACK: toggle mute/unmute
    const newMutedState = !state.isMuted;

    if (micPub.track) {
      if (newMutedState) {
        await micPub.track.mute();
      } else {
        await micPub.track.unmute();
      }
    }

    setState(prev => ({ ...prev, isMuted: newMutedState }));
  };

  const handleToggleVideo = async () => {
    const room = rtcManager.getRoom();
    if (!room) return;

    const lp = room.localParticipant;
    const camPub = lp.getTrackPublication(Track.Source.Camera);

    // 🚀 LẦN ĐẦU: chưa có track → publish
    if (!camPub) {
      console.log('[FocusRoom] Publishing camera track for the first time');
      await lp.setCameraEnabled(true);
      setState(prev => ({ ...prev, isVideoOff: false }));
      return;
    }

    // ✅ ĐÃ CÓ TRACK: toggle mute/unmute
    const newVideoOffState = !state.isVideoOff;

    if (camPub.track) {
      if (newVideoOffState) {
        await camPub.track.mute();
      } else {
        await camPub.track.unmute();
      }
    }

    setState(prev => ({ ...prev, isVideoOff: newVideoOffState }));
  };

  const handleToggleScreenShare = () => {
    setState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  // Leave room
  const handleLeave = async () => {
    console.log('[FocusRoom] User leaving room');
    isLeavingRef.current = true;

    try {
      if (roomId) {
        console.log('[FocusRoom] Calling API to leave room:', roomId);
        await leaveRoom(roomId);
      }
    } catch (error) {
      console.error('[FocusRoom] Error leaving room:', error);
    }

    rtcManager.markManualLeave();
    rtcManager.disconnect();
    window.location.href = '/v2/focus';
  };

  const handleMoreOptions = () => {
    console.log('Opening more options...');
  };

  const handleSettingsClick = () => {
    setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  };

  // (removed unused participants variable)

  // Show loading if we don't have required data
  if (!livekitToken) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{`${roomName} - React Boilerplate`}</title>
        <meta name="description" content="Focus room video call" />
      </Helmet>

      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <HeaderSection
          roomName={roomName}
          onSettingsClick={handleSettingsClick}
        />

        <div className="flex-1 relative">
          <VideoRoom
            livekitUrl={LIVEKIT_URL}
            token={livekitToken}
            onDisconnect={handleLeave}
          />
        </div>

        <ControlsSection
          state={state}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onLeave={handleLeave}
          onMoreOptions={handleMoreOptions}
        />
      </div>
    </>
  );
};

export default FocusRoom;
