import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  RemoteParticipant,
  RemoteTrackPublication,
  LocalTrackPublication,
  RemoteTrack,
} from 'livekit-client';
import {
  LuMic as Mic,
  LuMicOff as MicOff,
  LuVideo as Video,
  LuVideoOff as VideoOff,
  LuPhoneOff as PhoneOff,
  LuMonitor as Monitor,
  LuMonitorOff as MonitorOff,
  LuSettings as Settings,
  LuUsers as Users,
} from 'react-icons/lu';

interface VideoCallProps {
  roomName: string;
  token: string;
  wsUrl: string;
  userName: string;
  opponentName?: string;
  onLeave: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomName,
  token,
  wsUrl,
  userName,
  opponentName,
  onLeave,
}) => {
  const room = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const isConnectingRef = useRef(false);
  const hasConnectedRef = useRef(false);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<RemoteTrack | null>(
    null
  );
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleLocalTrackPublished = useCallback(
    (publication: LocalTrackPublication) => {
      const track = publication.track;
      console.log('📤 Local track published:', track?.kind);
      if (track && localVideoRef.current) {
        if (track.kind === Track.Kind.Video) {
          const element = track.attach();
          localVideoRef.current.srcObject = element.srcObject;
          console.log('✅ Local video attached to element');
        }
      }
    },
    []
  );

  const handleLocalTrackUnpublished = useCallback(
    (publication: LocalTrackPublication) => {
      const track = publication.track;
      if (track) {
        track.detach();
      }
    },
    []
  );

  const handleTrackSubscribed = useCallback(
    (
      track: RemoteTrackPublication['track'],
      _publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log('📹 TrackSubscribed:', participant.identity, track?.kind);

      // CHỈ lưu track vào state, KHÔNG attach thủ công
      if (track && track.kind === Track.Kind.Video) {
        setRemoteVideoTrack(track as RemoteTrack);
        console.log('✅ Remote video track saved to state');
      }
    },
    []
  );

  const handleTrackUnsubscribed = useCallback(
    (
      track: RemoteTrackPublication['track'],
      _publication: RemoteTrackPublication,
      _participant: RemoteParticipant
    ) => {
      console.log('📹 TrackUnsubscribed:', track?.kind);
      if (track && track.kind === Track.Kind.Video) {
        setRemoteVideoTrack(null);
      }
    },
    []
  );

  const handleParticipantConnected = useCallback(
    (participant: RemoteParticipant) => {
      console.log('👤 Participant connected:', participant.identity);
      // CHỈ log, KHÔNG làm gì khác
    },
    []
  );

  const handleParticipantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      console.log('👤 Participant disconnected:', participant.identity);
      setRemoteVideoTrack(null);
    },
    []
  );

  const handleDisconnected = useCallback(() => {
    console.log('❌ Disconnected from room');
  }, []);

  const handleConnectionStateChange = useCallback((state: string) => {
    console.log('🔌 Connection state changed:', state);

    if (state === 'connected') {
      setConnectionError(null);
      setIsConnecting(false);
      console.log('✅ Connection established');
    } else if (state === 'reconnecting') {
      console.log('🔄 Connection lost, reconnecting...');
      setConnectionError(null);
      setIsConnecting(true);
    } else if (state === 'disconnected') {
      console.log('❌ Connection lost completely');
      setConnectionError('Connection lost. Please rejoin.');
    }
  }, []);

  const connectToRoom = useCallback(async () => {
    // Prevent multiple concurrent connections
    if (isConnectingRef.current || hasConnectedRef.current) {
      console.log('⚠️ Already connecting or connected, skipping...');
      return;
    }

    try {
      isConnectingRef.current = true;
      setIsConnecting(true);
      setConnectionError(null);

      const roomOptions = {
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: { width: 1280, height: 720 },
        },
      };

      const connectOptions = {
        rtcConfig: {
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
              ],
            },
          ],
        },
      };

      // Create room instance with reconnection config
      room.current = new Room(roomOptions);

      // Set up event listeners
      room.current
        .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
        .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
        .on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
        .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
        .on(RoomEvent.ParticipantConnected, handleParticipantConnected)
        .on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
        .on(RoomEvent.Disconnected, handleDisconnected)
        .on(RoomEvent.ConnectionStateChanged, handleConnectionStateChange);

      // Connect to room
      await room.current.connect(wsUrl, token, connectOptions);
      console.log('✅ Connected to LiveKit room:', roomName);

      // Enable camera and microphone
      await room.current.localParticipant.setCameraEnabled(true);
      await room.current.localParticipant.setMicrophoneEnabled(true);

      // Manually attach local video track if it exists
      const videoTrack = room.current.localParticipant.getTrackPublication(
        Track.Source.Camera
      );
      if (videoTrack?.track && localVideoRef.current) {
        const element = videoTrack.track.attach();
        localVideoRef.current.srcObject = element.srcObject;
        console.log('✅ Local video manually attached after connection');
      }

      // KHÔNG scan participants thủ công
      // LiveKit sẽ tự fire TrackSubscribed event
      console.log('✅ Connected, waiting for TrackSubscribed events...');

      hasConnectedRef.current = true;
      isConnectingRef.current = false;
      setIsConnecting(false);
      console.log('✅ Camera and microphone enabled');
    } catch (error) {
      console.error('❌ Error connecting to room:', error);
      isConnectingRef.current = false;
      hasConnectedRef.current = false;

      // Don't immediately show error - connection might recover
      // Only show error if it persists for 5 seconds
      setTimeout(() => {
        if (!hasConnectedRef.current) {
          setConnectionError(
            error instanceof Error ? error.message : 'Failed to connect to room'
          );
        }
      }, 5000);

      setIsConnecting(false);
    }
  }, [
    roomName,
    token,
    wsUrl,
    handleLocalTrackPublished,
    handleLocalTrackUnpublished,
    handleTrackSubscribed,
    handleTrackUnsubscribed,
    handleParticipantConnected,
    handleParticipantDisconnected,
    handleDisconnected,
    handleConnectionStateChange,
  ]);

  useEffect(() => {
    connectToRoom();

    return () => {
      // Cleanup on unmount - only disconnect if we successfully connected
      console.log('🧹 Cleaning up VideoCall component', {
        hasConnected: hasConnectedRef.current,
        isConnecting: isConnectingRef.current,
      });

      // Only disconnect if we successfully connected
      // Don't disconnect if still connecting (prevents "Client initiated disconnect" in StrictMode)
      if (room.current && hasConnectedRef.current && !isConnectingRef.current) {
        console.log('🔌 Disconnecting from room');
        room.current.disconnect();
        room.current = null;
      }

      // Reset flags
      isConnectingRef.current = false;
      hasConnectedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const toggleMicrophone = async () => {
    if (room.current) {
      const enabled = !isMicOn;
      await room.current.localParticipant.setMicrophoneEnabled(enabled);
      setIsMicOn(enabled);
    }
  };

  const toggleCamera = async () => {
    if (room.current && localVideoRef.current) {
      const enabled = !isCameraOn;
      await room.current.localParticipant.setCameraEnabled(enabled);

      if (enabled) {
        // Manually attach video track after enabling
        const videoTrack = room.current.localParticipant.getTrackPublication(
          Track.Source.Camera
        );
        if (videoTrack?.track) {
          const element = videoTrack.track.attach();
          localVideoRef.current.srcObject = element.srcObject;
          console.log('✅ Local video attached after toggle');
        }
      }

      setIsCameraOn(enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (room.current) {
      try {
        if (isScreenSharing) {
          await room.current.localParticipant.setScreenShareEnabled(false);
          setIsScreenSharing(false);
        } else {
          await room.current.localParticipant.setScreenShareEnabled(true);
          setIsScreenSharing(true);
        }
      } catch (error) {
        console.error('Error toggling screen share:', error);
      }
    }
  };

  const handleLeave = async () => {
    if (room.current) {
      await room.current.disconnect();
    }
    onLeave();
  };

  if (connectionError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Connection Error
          </h2>
          <p className="text-gray-400 mb-4">{connectionError}</p>
          <button
            onClick={onLeave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Loading Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Connecting to room...</p>
          </div>
        </div>
      )}

      {/* Main Video Grid */}
      <div className="h-full flex flex-col">
        {/* Remote Video (Main) */}
        <div className="flex-1 relative">
          {remoteVideoTrack ? (
            <>
              <video
                ref={el => {
                  if (el && remoteVideoTrack) {
                    // Attach track to video element via callback ref
                    el.srcObject = new MediaStream([
                      remoteVideoTrack.mediaStreamTrack,
                    ]);
                    console.log('✅ Remote video rendered via callback ref');
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                <p className="text-white text-sm font-medium">
                  {opponentName || 'Opponent'}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">
                  Waiting for opponent to join...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
          {isCameraOn ? (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                <p className="text-white text-xs font-medium">
                  {userName} (You)
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Camera off</p>
              </div>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div
          className={`absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-lg transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white text-sm">
            <span className="font-semibold">Room:</span> {roomName}
          </p>
        </div>

        {/* Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ${
            showControls ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="bg-gradient-to-t from-black/80 to-transparent px-8 py-6">
            <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
              {/* Microphone Toggle */}
              <button
                onClick={toggleMicrophone}
                className={`p-4 rounded-full transition ${
                  isMicOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full transition ${
                  isCameraOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraOn ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-full transition ${
                  isScreenSharing
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-6 h-6 text-white" />
                ) : (
                  <Monitor className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Leave Call */}
              <button
                onClick={handleLeave}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
                title="Leave call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>

              {/* Settings (placeholder) */}
              <button
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                title="Settings"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
