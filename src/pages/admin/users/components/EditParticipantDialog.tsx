import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParticipantProfileForm } from "@/components/participant/profile/ParticipantProfileForm";

interface EditParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: any;
}

export default function EditParticipantDialog({
  open,
  onOpenChange,
  participant,
}: EditParticipantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Edit Participant Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 pt-0">
            {participant && (
              <ParticipantProfileForm profile={participant} />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}