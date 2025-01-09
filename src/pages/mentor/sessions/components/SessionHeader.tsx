import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Session {
  id: string;
  name: string;
  description: string;
  duration: number;
  tech_stack_id?: string;
  start_date: string;
  end_date: string;
  max_slots_per_mentor: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  technology_stacks?: {
    id: string;
    name: string;
    icon_url: string;
  };
}

interface SessionHeaderProps {
  session: Session;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => navigate('/mentor/sessions')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sessions
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{session.name}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{session.duration} minutes per session</span>
                </div>
              </CardDescription>
            </div>
            {session.technology_stacks && (
              <Badge variant="secondary">
                {session.technology_stacks.name}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}