import { ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
  onApprove: (mentorId: string) => void;
  onReject: (mentorId: string) => void;
  isSelected: boolean;
  onToggleSelect: (mentorId: string) => void;
}

export function MentorCard({ 
  mentor, 
  onApprove, 
  onReject, 
  isSelected,
  onToggleSelect 
}: MentorCardProps) {
  return (
    <Card className="relative">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(mentor.id)}
        className="absolute top-4 right-4"
      />
      <CardHeader>
        <div className="flex items-center gap-4">
          {mentor.avatar_url && (
            <img
              src={mentor.avatar_url}
              alt={mentor.full_name || ""}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <CardTitle>{mentor.full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{mentor.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{mentor.bio}</p>
        <div className="flex gap-2">
          {mentor.linkedin_profile_id && (
            <a
              href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Badge variant="secondary">
                LinkedIn
                <ExternalLink className="ml-1 h-3 w-3" />
              </Badge>
            </a>
          )}
          {mentor.github_username && (
            <a
              href={`https://github.com/${mentor.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Badge variant="secondary">
                GitHub
                <ExternalLink className="ml-1 h-3 w-3" />
              </Badge>
            </a>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onReject(mentor.id)}
        >
          <XCircle className="mr-2" />
          Reject
        </Button>
        <Button
          variant="default"
          onClick={() => onApprove(mentor.id)}
        >
          <CheckCircle className="mr-2" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}