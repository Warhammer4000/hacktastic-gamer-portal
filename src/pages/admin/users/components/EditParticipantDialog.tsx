import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Participant Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {participant && (
            <ParticipantProfileForm profile={participant} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}