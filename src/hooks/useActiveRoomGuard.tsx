import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { roomService } from '@/services/roomService';
import { useRooms } from '@/hooks/useRooms';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { ActiveRoomSummary } from '@/types/room';
import {
  ActiveRoomPendingAction,
  ActiveRoomConflictDialog,
} from '@/components/ActiveRoomConflictDialog';
import { ROUTES } from '@/constants';
import { apiFailureMessage } from '@/utils/apiEnvelope';

type PendingAction = { kind: 'join'; targetRoomId: string } | { kind: 'match' };

export function useActiveRoomGuard() {
  const navigate = useNavigate();
  const { joinRoom, leaveRoom } = useRooms();
  const { joinMatchmaking } = useMatchmaking();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<ActiveRoomSummary | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [isBusy, setIsBusy] = useState(false);

  const navigateToRoom = useCallback(
    (roomId: string) => {
      navigate(`${ROUTES.FOCUS_ROOM}/${roomId}`);
    },
    [navigate]
  );

  const performJoinRoom = useCallback(
    async (roomId: string) => {
      const result = await joinRoom(roomId);
      if (joinRoomThunkFulfilled(result)) {
        navigateToRoom(roomId);
        return true;
      }
      return false;
    },
    [joinRoom, navigateToRoom]
  );

  const openConflictDialog = useCallback(
    (room: ActiveRoomSummary, action: PendingAction) => {
      setActiveRoom(room);
      setPendingAction(action);
      setDialogOpen(true);
    },
    []
  );

  const requestJoinRoom = useCallback(
    async (targetRoomId: string) => {
      try {
        const res = await roomService.getCurrentRoom();
        if (res.error || !res.data) {
          throw new Error(apiFailureMessage(res));
        }
        const current = res.data;

        if (!current.hasActiveRoom || !current.room) {
          await performJoinRoom(targetRoomId);
          return;
        }

        if (current.room.id === targetRoomId) {
          await performJoinRoom(targetRoomId);
          return;
        }

        openConflictDialog(current.room, {
          kind: 'join',
          targetRoomId,
        });
      } catch {
        toast.error('Không thể kiểm tra room hiện tại');
      }
    },
    [performJoinRoom, openConflictDialog]
  );

  const requestMatchmaking = useCallback(async () => {
    try {
      const res = await roomService.getCurrentRoom();
      if (res.error || !res.data) {
        throw new Error(apiFailureMessage(res));
      }
      const current = res.data;

      if (!current.hasActiveRoom || !current.room) {
        await joinMatchmaking();
        return;
      }

      openConflictDialog(current.room, { kind: 'match' });
    } catch {
      toast.error('Không thể kiểm tra room hiện tại');
    }
  }, [joinMatchmaking, openConflictDialog]);

  const resetDialog = useCallback(() => {
    setDialogOpen(false);
    setActiveRoom(null);
    setPendingAction(null);
  }, []);

  const handleRejoin = useCallback(async () => {
    if (!activeRoom) return;

    setIsBusy(true);
    try {
      await performJoinRoom(activeRoom.id);
      resetDialog();
    } finally {
      setIsBusy(false);
    }
  }, [activeRoom, performJoinRoom, resetDialog]);

  const handleLeaveAndProceed = useCallback(async () => {
    if (!activeRoom || !pendingAction) return;

    setIsBusy(true);
    try {
      const leaveResult = await leaveRoom(activeRoom.id);
      if (!leaveRoomThunkFulfilled(leaveResult)) {
        return;
      }

      if (pendingAction.kind === 'join') {
        await performJoinRoom(pendingAction.targetRoomId);
      } else {
        await joinMatchmaking();
      }

      resetDialog();
    } finally {
      setIsBusy(false);
    }
  }, [
    activeRoom,
    pendingAction,
    leaveRoom,
    performJoinRoom,
    joinMatchmaking,
    resetDialog,
  ]);

  const pendingActionKind: ActiveRoomPendingAction | null =
    pendingAction?.kind === 'match'
      ? 'match'
      : pendingAction?.kind === 'join'
        ? 'join'
        : null;

  const conflictDialog = (
    <ActiveRoomConflictDialog
      open={dialogOpen}
      activeRoom={activeRoom}
      pendingAction={pendingActionKind}
      isBusy={isBusy}
      onRejoin={handleRejoin}
      onLeaveAndProceed={handleLeaveAndProceed}
      onCancel={resetDialog}
    />
  );

  return {
    requestJoinRoom,
    requestMatchmaking,
    conflictDialog,
  };
}

function joinRoomThunkFulfilled(result: {
  meta: { requestStatus: string };
  payload?: unknown;
}): boolean {
  return result.meta.requestStatus === 'fulfilled' && Boolean(result.payload);
}

function leaveRoomThunkFulfilled(result: {
  meta: { requestStatus: string };
}): boolean {
  return result.meta.requestStatus === 'fulfilled';
}
