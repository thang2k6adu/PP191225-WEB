import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderSection } from './sections/HeaderSection';
import { ControlsSection } from './sections/ControlsSection';
import { FocusRoomState } from './types';
import { useRooms } from '@/hooks/useRooms';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useLocalMediaState } from '@/hooks/useLocalMediaState';
import { useTrackingSession } from '@/hooks/useTrackingSession';
import { VideoRoom } from '@/components/VideoRoom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import { rtcManager } from '@/lib/rtcManager';
import { ROUTES } from '@/constants';
import TaskSelectionDialog from '@/components/TaskSelectionDialog';
import { ActivateTaskResponse } from '@/types/trackingSession';
import {
  syncRoomParticipantTask,
  clearRoomParticipantTask,
} from '@/lib/roomParticipantMetadata';
import { taskService } from '@/services/taskService';

const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server.com';

const FocusRoom: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ roomId: string }>();
  const { currentRoom, fetchRoomDetail, joinRoom, leaveRoom } = useRooms();
  const { matchData } = useMatchmaking();
  const { deactivateTask, isLoading: isTrackingLoading } = useTrackingSession();

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
    selectedTaskId: undefined as string | undefined,
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

  useEffect(() => {
    if (isLeavingRef.current || !roomId) {
      return;
    }

    if (!livekitToken && !hasJoinedRef.current) {
      console.log('[FocusRoom] No token, joining room:', roomId);
      hasJoinedRef.current = true;
      joinRoom(roomId);
      return;
    }

    if (currentRoom && !hasFetchedRef.current) {
      fetchRoomDetail(roomId);
      hasFetchedRef.current = true;
    }
  }, [roomId, livekitToken, currentRoom, joinRoom, fetchRoomDetail]);

  useEffect(() => {
    if (!roomId && !isLeavingRef.current) {
      console.log('[FocusRoom] No roomId, redirecting...');
      navigate(ROUTES.FOCUS, { replace: true });
    }
  }, [roomId, navigate]);

  useEffect(() => {
    if (!livekitToken) return;

    let cancelled = false;

    const loadActiveTask = async () => {
      try {
        const response = await taskService.getActiveTask();
        if (cancelled) return;

        const activeTask = response.data;
        if (!activeTask?.id) return;

        setUiState(prev => ({
          ...prev,
          selectedTaskName: activeTask.name,
          selectedTaskId: activeTask.id,
        }));
      } catch (error) {
        console.warn('[FocusRoom] Failed to load active task:', error);
      }
    };

    loadActiveTask();

    return () => {
      cancelled = true;
    };
  }, [livekitToken]);

  const handleToggleScreenShare = () => {
    setUiState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

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

  const handleTaskSelected = async (result: ActivateTaskResponse['data']) => {
    const { task, session } = result;
    try {
      await syncRoomParticipantTask({
        id: task.id,
        name: task.name,
        progress: task.progress,
        estimateSeconds: task.estimateHours * 3600,
        sessionStartTime: session.startTime,
      });
      setUiState(prev => ({
        ...prev,
        selectedTaskName: task.name,
        selectedTaskId: task.id,
        showTaskDialog: false,
      }));
    } catch (error) {
      console.error('[FocusRoom] Failed to sync task to LiveKit:', error);
    }
  };

  const handleStopTask = async () => {
    if (!uiState.selectedTaskId) return;

    try {
      await deactivateTask(uiState.selectedTaskId);
      await clearRoomParticipantTask();

      setUiState(prev => ({
        ...prev,
        selectedTaskName: undefined,
        selectedTaskId: undefined,
      }));
    } catch (error) {
      console.error('[FocusRoom] Failed to stop task:', error);
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
          onStopTask={handleStopTask}
          onLeave={handleLeave}
          onMoreOptions={handleMoreOptions}
          selectedTaskName={uiState.selectedTaskName}
          isStoppingTask={isTrackingLoading}
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
