import { Button } from "@/components/ui/button";
import { Edit, Power, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "../../types/session-form";

interface SessionCardActionsProps {
  session: Session;
  onEdit: (session: Session) => void;
}

export function SessionCardActions({ session, onEdit }: SessionCardActionsProps) {
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
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleStatus.mutate()}
      >
        <Power className={session.status === 'active' ? 'text-green-500' : 'text-red-500'} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(session)}
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
  );
}