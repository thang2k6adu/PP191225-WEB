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
  const roomName = activeRoom
    ? getRoomDisplayName(activeRoom)
    : 'room hiện tại';
  const proceedLabel =
    pendingAction === 'match'
      ? 'Rời room và bắt đầu match'
      : 'Rời room và vào room mới';

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
          <DialogTitle>Bạn đang trong một room</DialogTitle>
          <DialogDescription>
            Bạn đang trong room &quot;{roomName}&quot;. Bạn muốn quay lại room
            này hay rời room để{' '}
            {pendingAction === 'match'
              ? 'bắt đầu match mới'
              : 'vào room bạn chọn'}
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
            Quay lại room hiện tại
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
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
