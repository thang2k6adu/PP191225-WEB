import {
  ConnectionState,
  Participant as LiveKitParticipant,
} from 'livekit-client';
import { rtcManager } from '@/lib/rtcManager';

export type RoomParticipantMetadata = {
  avatarUrl?: string;
  selectedTaskId?: string;
  selectedTaskTitle?: string;
  selectedTaskProgress?: number; // base progress (%) tại lúc bắt đầu session
  selectedTaskEstimateSeconds?: number; // estimateHours * 3600
  selectedTaskSessionStartTime?: string; // ISO string — lúc bắt đầu session hiện tại
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
      selectedTaskEstimateSeconds:
        typeof parsed.selectedTaskEstimateSeconds === 'number'
          ? parsed.selectedTaskEstimateSeconds
          : undefined,
      selectedTaskSessionStartTime:
        typeof parsed.selectedTaskSessionStartTime === 'string'
          ? parsed.selectedTaskSessionStartTime
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

export function computeLiveTaskProgress(
  baseProgress: number,
  estimateSeconds?: number,
  sessionStartTime?: string,
  now = Date.now()
): number {
  if (!sessionStartTime || !estimateSeconds || estimateSeconds <= 0) {
    return baseProgress;
  }

  const elapsedSeconds = (now - new Date(sessionStartTime).getTime()) / 1000;

  return Math.min(baseProgress + (elapsedSeconds / estimateSeconds) * 100, 100);
}

export function getParticipantTaskFields(participant: LiveKitParticipant): {
  taskTitle?: string;
  taskId?: string;
  taskProgress?: number;
  taskEstimateSeconds?: number;
  taskSessionStartTime?: string;
} {
  const meta = parseRoomParticipantMetadata(participant.metadata);

  if (!meta.selectedTaskId) {
    return {};
  }

  return {
    taskTitle: meta.selectedTaskTitle || DEFAULT_TASK_TITLE,
    taskId: meta.selectedTaskId,
    taskProgress: meta.selectedTaskProgress ?? 0,
    taskEstimateSeconds: meta.selectedTaskEstimateSeconds,
    taskSessionStartTime: meta.selectedTaskSessionStartTime,
  };
}

export function getParticipantTaskInfo(participant: LiveKitParticipant): {
  taskTitle: string;
  taskId?: string;
  progress: number;
} {
  const fields = getParticipantTaskFields(participant);

  return {
    taskTitle: fields.taskTitle || DEFAULT_TASK_TITLE,
    taskId: fields.taskId,
    progress: computeLiveTaskProgress(
      fields.taskProgress ?? 0,
      fields.taskEstimateSeconds,
      fields.taskSessionStartTime
    ),
  };
}

export function getParticipantDisplayProfile(
  participant: LiveKitParticipant,
  options?: { isLocal?: boolean }
): { name: string; avatar: string } {
  const { avatarUrl } = parseRoomParticipantMetadata(participant.metadata);
  const fallbackName = options?.isLocal ? 'You' : 'Guest';

  const name = participant.name?.trim() || participant.identity || fallbackName;

  const avatar =
    avatarUrl || `https://i.pravatar.cc/150?u=${participant.identity}`;

  return { name, avatar };
}

export type RoomTaskSelection = {
  id: string;
  name: string;
  progress?: number;
  estimateSeconds?: number;
  sessionStartTime?: string;
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
      selectedTaskEstimateSeconds: task.estimateSeconds,
      selectedTaskSessionStartTime: task.sessionStartTime,
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
