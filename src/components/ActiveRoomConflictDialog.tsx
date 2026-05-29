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
  const proceedLabel = pendingAction === 'match' ? 'Match Now' : 'Join room';

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen && !isBusy) {
          onCancel();
        }
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="space-y-2 px-6 pb-2 pt-6 text-left">
          <DialogTitle>You are currently in a room</DialogTitle>
          <DialogDescription>
            You are in &quot;{roomName}&quot;. Rejoin this room or leave to{' '}
            {pendingAction === 'match' ? 'start matching' : 'join another room'}
            .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-stretch sm:gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full sm:flex-1"
            onClick={onRejoin}
            disabled={isBusy || !activeRoom}
          >
            {isBusy ? (
              <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
            ) : null}
            Rejoin
          </Button>

          <Button
            type="button"
            className="h-10 w-full sm:flex-1"
            onClick={onLeaveAndProceed}
            disabled={isBusy || !activeRoom}
          >
            {isBusy ? (
              <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
            ) : null}
            {proceedLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
