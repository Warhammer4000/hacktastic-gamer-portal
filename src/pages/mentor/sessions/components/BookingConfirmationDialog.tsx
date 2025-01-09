import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate?: Date;
  selectedSlot?: {
    start_time: string | null;
    end_time: string | null;
  };
  isPending: boolean;
}

export function BookingConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  selectedSlot,
  isPending,
}: BookingConfirmationDialogProps) {
  if (!selectedDate || !selectedSlot) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to book this session for{" "}
            {format(selectedDate, "MMMM d, yyyy")} from{" "}
            {selectedSlot.start_time && format(parseISO(`2000-01-01T${selectedSlot.start_time}`), "h:mm a")} to{" "}
            {selectedSlot.end_time && format(parseISO(`2000-01-01T${selectedSlot.end_time}`), "h:mm a")}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onConfirm}>
            Confirm Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}