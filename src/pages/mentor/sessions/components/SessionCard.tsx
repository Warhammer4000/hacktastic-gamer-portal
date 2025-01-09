import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SessionCardProps {
  session: {
    id: string;
    name: string;
    description: string;
    duration: number;
    start_date: string;
    end_date: string;
    technology_stacks: {
      name: string;
    } | null;
  };
}

export function SessionCard({ session }: SessionCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{session.name}</span>
          {session.technology_stacks && (
            <Badge variant="outline">{session.technology_stacks.name}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{session.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {session.duration} minutes per session
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(session.start_date), 'PP')} - {format(new Date(session.end_date), 'PP')}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/mentor/sessions/${session.id}/book`)}
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
}