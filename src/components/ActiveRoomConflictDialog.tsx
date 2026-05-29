import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ActiveRoomSummary } from '@/types/room';
import { LuLoaderCircle as Loader2 } from 'react-icons/lu';

export type ActiveRoomPendingAction = 'join' | 'match';

interface ActiveRoomConflictDialogProps {
  open: boolean;
  activeRoom: ActiveRoomSummary | null;
  pendingAction: ActiveRoomPendingAction | null;
  isBusy: boolean;
  onRejoin: () => void;
  onLeaveAndProceed: () => void;
  onCancel: () => void;
}

function getRoomDisplayName(room: ActiveRoomSummary): string {
  if (room.topic) {
    return room.topic;
  }
  return room.type === 'MATCH' ? 'Match Room' : 'Focus Room';
}

export function ActiveRoomConflictDialog({
  open,
  activeRoom,
  pendingAction,
  isBusy,
  onRejoin,
  onLeaveAndProceed,
  onCancel,
}: ActiveRoomConflictDialogProps) {
  const roomName = activeRoom ? getRoomDisplayName(activeRoom) : 'current room';
  const proceedLabel =
    pendingAction === 'match'
      ? 'Leave room and start matching'
      : 'Leave room and join a new room';

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen && !isBusy) {
          onCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You are currently in a room</DialogTitle>
          <DialogDescription>
            You are in room &quot;{roomName}&quot;. Do you want to return to
            this room or leave to{' '}
            {pendingAction === 'match'
              ? 'start a new match'
              : 'join your selected room'}
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button
            type="button"
            className="w-full"
            onClick={onRejoin}
            disabled={isBusy || !activeRoom}
          >
            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Return to current room
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onLeaveAndProceed}
            disabled={isBusy || !activeRoom}
          >
            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {proceedLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={isBusy}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
