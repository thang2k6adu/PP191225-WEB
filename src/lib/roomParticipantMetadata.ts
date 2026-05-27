import {
  ConnectionState,
  Participant as LiveKitParticipant,
} from 'livekit-client';
import { rtcManager } from '@/lib/rtcManager';

export type RoomParticipantMetadata = {
  avatarUrl?: string;
  selectedTaskId?: string;
  selectedTaskTitle?: string;
  selectedTaskProgress?: number;
};

const DEFAULT_TASK_TITLE = 'Chưa chọn task';

export function parseRoomParticipantMetadata(
  metadata?: string
): RoomParticipantMetadata {
  if (!metadata) return {};

  try {
    const parsed = JSON.parse(metadata) as RoomParticipantMetadata;
    return {
      avatarUrl:
        typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : undefined,
      selectedTaskId:
        typeof parsed.selectedTaskId === 'string'
          ? parsed.selectedTaskId
          : undefined,
      selectedTaskTitle:
        typeof parsed.selectedTaskTitle === 'string'
          ? parsed.selectedTaskTitle
          : undefined,
      selectedTaskProgress:
        typeof parsed.selectedTaskProgress === 'number'
          ? parsed.selectedTaskProgress
          : undefined,
    };
  } catch {
    return {};
  }
}

export function mergeRoomParticipantMetadata(
  currentMetadata: string | undefined,
  patch: Partial<RoomParticipantMetadata>
): string {
  return JSON.stringify({
    ...parseRoomParticipantMetadata(currentMetadata),
    ...patch,
  });
}

export function getParticipantTaskInfo(participant: LiveKitParticipant): {
  taskTitle: string;
  taskId?: string;
  progress: number;
} {
  const meta = parseRoomParticipantMetadata(participant.metadata);

  return {
    taskTitle: meta.selectedTaskTitle || DEFAULT_TASK_TITLE,
    taskId: meta.selectedTaskId,
    progress: meta.selectedTaskProgress ?? 0,
  };
}

export type RoomTaskSelection = {
  id: string;
  name: string;
  progress?: number;
};

export async function syncRoomParticipantTask(
  task: RoomTaskSelection
): Promise<void> {
  const room = rtcManager.getRoom();

  if (room.state !== ConnectionState.Connected) {
    console.warn(
      '[roomParticipantMetadata] Room not connected, skip task sync'
    );
    return;
  }

  const metadata = mergeRoomParticipantMetadata(
    room.localParticipant.metadata,
    {
      selectedTaskId: task.id,
      selectedTaskTitle: task.name,
      selectedTaskProgress: task.progress ?? 0,
    }
  );

  await room.localParticipant.setMetadata(metadata);
}

export async function clearRoomParticipantTask(): Promise<void> {
  const room = rtcManager.getRoom();

  if (room.state !== ConnectionState.Connected) {
    return;
  }

  const current = parseRoomParticipantMetadata(room.localParticipant.metadata);
  const { avatarUrl } = current;

  const metadata = JSON.stringify({
    ...(avatarUrl ? { avatarUrl } : {}),
  });

  await room.localParticipant.setMetadata(metadata);
}
