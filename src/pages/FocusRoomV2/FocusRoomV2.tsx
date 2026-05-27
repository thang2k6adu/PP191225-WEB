import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderSection } from './sections/HeaderSection';
import { ControlsSection } from './sections/ControlsSection';
import { FocusRoomState } from './types';
import { useRooms } from '@/hooks/useRooms';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useLocalMediaState } from '@/hooks/useLocalMediaState';
import { VideoRoom } from '@/components/VideoRoom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { rtcManager } from '@/lib/rtcManager';
import { ROUTES } from '@/constants';
import TaskSelectionDialog from '@/components/TaskSelectionDialog';
import { Task } from '@/types/task';
import { syncRoomParticipantTask } from '@/lib/roomParticipantMetadata';
import { taskService } from '@/services/taskService';

const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server.com';

const FocusRoom: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ roomId: string }>();
  const { currentRoom, fetchRoomDetail, joinRoom, leaveRoom } = useRooms();
  const { matchData } = useMatchmaking();

  const roomId = params.roomId;
  const livekitToken = currentRoom?.token || matchData?.token;

  const { isMuted, isVideoOff, toggleMic, toggleVideo } = useLocalMediaState({
    enabled: Boolean(livekitToken),
  });

  const [uiState, setUiState] = useState({
    isScreenSharing: false,
    showSettings: false,
    showTaskDialog: false,
    selectedTaskName: undefined as string | undefined,
  });

  const controlsState: FocusRoomState = {
    isMuted,
    isVideoOff,
    isScreenSharing: uiState.isScreenSharing,
    showSettings: uiState.showSettings,
  };

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
      navigate(ROUTES.FOCUS, { replace: true });
    }
  }, [roomId, navigate]);

  useEffect(() => {
    if (!livekitToken) return;

    taskService
      .getActiveTask()
      .then(response => {
        const activeTask = response.data;
        if (activeTask?.name) {
          setUiState(prev => ({
            ...prev,
            selectedTaskName: activeTask.name,
          }));
        }
      })
      .catch(error => {
        console.warn('[FocusRoom] Failed to load active task:', error);
      });
  }, [livekitToken]);

  const handleToggleScreenShare = () => {
    setUiState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
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
    window.location.href = ROUTES.FOCUS;
  };

  const handleMoreOptions = () => {
    console.log('Opening more options...');
  };

  const handleSelectTask = () => {
    setUiState(prev => ({ ...prev, showTaskDialog: true }));
  };

  const handleTaskSelected = async (task: Task) => {
    try {
      await syncRoomParticipantTask({
        id: task.id,
        name: task.name,
        progress: task.progress,
      });
      setUiState(prev => ({
        ...prev,
        selectedTaskName: task.name,
        showTaskDialog: false,
      }));
    } catch (error) {
      console.error('[FocusRoom] Failed to sync task to LiveKit:', error);
    }
  };

  const handleSettingsClick = () => {
    setUiState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  };

  if (!livekitToken) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{`${roomName} - Focus Hub`}</title>
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
            initialVideoOff={isVideoOff}
            initialAudioOff={isMuted}
          />
        </div>

        <ControlsSection
          state={controlsState}
          onToggleMute={toggleMic}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onSelectTask={handleSelectTask}
          onLeave={handleLeave}
          onMoreOptions={handleMoreOptions}
          selectedTaskName={uiState.selectedTaskName}
        />

        <TaskSelectionDialog
          isOpen={uiState.showTaskDialog}
          onClose={() =>
            setUiState(prev => ({ ...prev, showTaskDialog: false }))
          }
          onTaskSelected={handleTaskSelected}
        />
      </div>
    </>
  );
};

export default FocusRoom;
