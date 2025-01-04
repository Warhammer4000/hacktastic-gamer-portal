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

interface MentorTableProps {
  mentors: any[];
  onEdit: (mentorId: string) => void;
  onDelete: (mentorId: string) => void;
}

export function MentorTable({ mentors, onEdit, onDelete }: MentorTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>GitHub</TableHead>
          <TableHead>LinkedIn</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mentors.map((mentor) => (
          <TableRow key={mentor.id}>
            <TableCell>{mentor.full_name}</TableCell>
            <TableCell>{mentor.email}</TableCell>
            <TableCell>{mentor.github_username}</TableCell>
            <TableCell>{mentor.linkedin_profile_id}</TableCell>
            <TableCell>{mentor.status}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(mentor.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(mentor.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}