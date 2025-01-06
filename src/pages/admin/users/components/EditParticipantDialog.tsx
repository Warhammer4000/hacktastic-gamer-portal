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
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Participant Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          {participant && (
            <ParticipantProfileForm profile={participant} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}