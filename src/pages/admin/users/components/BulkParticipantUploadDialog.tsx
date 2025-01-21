import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface BulkParticipantUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkParticipantUploadDialog({
  open,
  onOpenChange,
}: BulkParticipantUploadDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const downloadTemplate = () => {
    const csvContent = "email,full_name,github_username,institution_name,bio,avatar_url\nexample@email.com,John Doe,johndoe,Example University,A brief bio about the participant,https://example.com/avatar.jpg";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n");
        const headers = rows[0].split(",");
        const participants = [];

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(",");
          const participant = {
            email: values[0].trim(),
            full_name: values[1].trim(),
            github_username: values[2]?.trim() || null,
            institution_name: values[3]?.trim() || null,
            bio: values[4]?.trim() || null,
            avatar_url: values[5]?.trim() || null,
            password: Math.random().toString(36).slice(-8),
          };
          participants.push(participant);
        }

        for (const participant of participants) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: participant.email,
            password: participant.password,
            options: {
              data: {
                full_name: participant.full_name,
              },
            },
          });

          if (authError) throw authError;
          if (!authData.user) continue;

          // Get institution ID if provided
          let institutionId = null;
          if (participant.institution_name) {
            const { data: institution } = await supabase
              .from("institutions")
              .select("id")
              .eq("name", participant.institution_name)
              .single();
            
            institutionId = institution?.id;
          }

          // Add participant role
          await supabase
            .from("user_roles")
            .insert([{ user_id: authData.user.id, role: "participant" }]);

          // Update profile with additional information
          await supabase
            .from("profiles")
            .update({
              github_username: participant.github_username,
              institution_id: institutionId,
              bio: participant.bio,
              avatar_url: participant.avatar_url,
              status: 'pending_approval'
            })
            .eq("id", authData.user.id);
        }

        toast.success(`${participants.length} participants created successfully`);
        queryClient.invalidateQueries({ queryKey: ["participants"] });
        onOpenChange(false);
      } catch (error) {
        console.error("Error uploading participants:", error);
        toast.error("Failed to upload participants");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Participants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>

          <div className="grid w-full items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: email, full_name, 
            github_username, institution_name, bio, avatar_url. Only email and 
            full_name are required fields.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}