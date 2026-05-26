import { Room, RoomEvent, ConnectionState } from 'livekit-client';

// Singleton room manager - Senior coi connection như connection pool
class RTCManager {
  private room: Room | null = null;
  private currentRoomName: string | null = null;
  private manualLeave: boolean = false;

  getRoom(): Room {
    if (!this.room) {
      this.room = new Room();
      console.log('[RTC] Room instance created');
    }
    return this.room;
  }

  getCurrentRoomName(): string | null {
    return this.currentRoomName;
  }

  setCurrentRoomName(name: string | null): void {
    this.currentRoomName = name;
  }

  async connect(url: string, token: string): Promise<void> {
    const room = this.getRoom();

    // Check state machine
    if (room.state === ConnectionState.Connected) {
      console.log('[RTC] Already connected, skipping');
      return;
    }

    if (room.state === ConnectionState.Connecting) {
      console.log('[RTC] Already connecting, waiting...');
      // Wait for current connection attempt
      return new Promise((resolve, reject) => {
        const onConnected = () => {
          room.off(RoomEvent.Connected, onConnected);
          room.off(RoomEvent.Disconnected, onError);
          resolve();
        };
        const onError = () => {
          room.off(RoomEvent.Connected, onConnected);
          room.off(RoomEvent.Disconnected, onError);
          reject(new Error('Connection failed'));
        };
        room.once(RoomEvent.Connected, onConnected);
        room.once(RoomEvent.Disconnected, onError);
      });
    }

    console.log('[RTC] Connecting to room...', { state: room.state });
    await room.connect(url, token);
    console.log('[RTC] Connected successfully');
    this.manualLeave = false;
  }

  // Mark for manual leave (user clicked Leave button)
  markManualLeave(): void {
    this.manualLeave = true;
    console.log('[RTC] Marked for manual leave');
  }

  // Disconnect chỉ khi LEAVE room, không phải unmount UI
  disconnect(): void {
    if (!this.room) return;

    if (!this.manualLeave) {
      console.warn(
        '[RTC] Skip disconnect – not manual leave (React lifecycle)'
      );
      return;
    }

    console.log('[RTC] Disconnecting... (manual leave)');

    // 🔥 CRITICAL: Stop all local tracks before disconnect
    this.room.localParticipant.trackPublications.forEach(pub => {
      const track = pub.track;
      if (track) {
        console.log('[RTC] Stopping track:', track.kind, track.source);
        track.stop(); // Release camera/mic hardware
      }
    });

    this.room.disconnect();
    this.room = null;
    this.currentRoomName = null;
    this.manualLeave = false;

    console.log('[RTC] All tracks stopped, room disconnected');
  }

  // Check connection state
  isConnected(): boolean {
    return this.room?.state === ConnectionState.Connected;
  }

  isConnecting(): boolean {
    return this.room?.state === ConnectionState.Connecting;
  }

  getState(): ConnectionState | null {
    return this.room?.state ?? null;
  }

  // Cleanup for app unmount (not component unmount)
  destroy(): void {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
      this.currentRoomName = null;
      console.log('[RTC] Manager destroyed');
    }
  }
}

// Export singleton instance
export const rtcManager = new RTCManager();
