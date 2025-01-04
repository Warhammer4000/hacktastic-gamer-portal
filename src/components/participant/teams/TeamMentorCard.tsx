import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TeamMentorCardProps {
  mentorId: string | null;
}

export function TeamMentorCard({ mentorId }: TeamMentorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mentorId ? "Team Mentor" : "Pending Mentor"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {mentorId 
            ? "Your team has been assigned a mentor"
            : "A mentor will be assigned to your team soon"
          }
        </p>
      </CardContent>
    </Card>
  );
}