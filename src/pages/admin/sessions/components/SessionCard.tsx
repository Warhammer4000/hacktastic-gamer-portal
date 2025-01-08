import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Trash2, Edit, Power } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SessionCardProps {
  session: any; // TODO: Add proper type
}

export function SessionCard({ session }: SessionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleStatus = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('session_templates')
        .update({ 
          status: session.status === 'active' ? 'inactive' : 'active' 
        })
        .eq('id', session.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-templates'] });
      toast({
        title: "Success",
        description: `Session ${session.status === 'active' ? 'deactivated' : 'activated'} successfully`,
      });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async () => {
      // First delete availabilities
      await supabase
        .from('session_availabilities')
        .delete()
        .eq('session_template_id', session.id);

      // Then delete the session
      const { error } = await supabase
        .from('session_templates')
        .delete()
        .eq('id', session.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-templates'] });
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{session.name}</CardTitle>
            <CardDescription>{session.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleStatus.mutate()}
            >
              <Power className={session.status === 'active' ? 'text-green-500' : 'text-gray-500'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* TODO: Implement edit */}}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSession.mutate()}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
          {session.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {session.duration} minutes per session
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(session.start_date), 'PP')} - {format(new Date(session.end_date), 'PP')}
        </div>
        {session.technology_stacks && (
          <Badge variant="outline" className="mt-2">
            {session.technology_stacks.name}
          </Badge>
        )}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Available Times:</p>
          {session.session_availabilities?.map((availability: any) => (
            <div key={availability.id} className="text-sm text-muted-foreground">
              {DAYS[availability.day_of_week]}: {availability.start_time} - {availability.end_time}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}