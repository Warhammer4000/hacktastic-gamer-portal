import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/integrations/supabase/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_roles: Database["public"]["Tables"]["user_roles"]["Row"][];
};

interface ParticipantTableProps {
  participants: Profile[];
  isLoading: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function ParticipantTable({ 
  participants, 
  isLoading,
  onEdit,
  onDelete 
}: ParticipantTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>GitHub</TableHead>
          <TableHead>LinkedIn</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((participant) => (
          <TableRow key={participant.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant.avatar_url || ''} alt={participant.full_name || ''} />
                <AvatarFallback>{participant.full_name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <span>{participant.full_name || participant.email}</span>
            </TableCell>
            <TableCell>{participant.email}</TableCell>
            <TableCell>{participant.github_username || '-'}</TableCell>
            <TableCell>{participant.linkedin_profile_id || '-'}</TableCell>
            <TableCell>
              <Badge variant="outline">{participant.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(participant.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(participant.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}