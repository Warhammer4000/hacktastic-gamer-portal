import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function TechnologyStackPreference() {
  const queryClient = useQueryClient();

  const { data: techStacks } = useQuery({
    queryKey: ['technology-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: selectedTechStacks } = useQuery({
    queryKey: ['mentor-tech-stacks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('mentor_tech_stacks')
        .select('tech_stack_id')
        .eq('mentor_id', user.id);
      
      if (error) throw error;
      return data.map(stack => stack.tech_stack_id);
    },
  });

  const toggleTechStack = useMutation({
    mutationFn: async (techStackId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const isSelected = selectedTechStacks?.includes(techStackId);

      if (isSelected) {
        const { error } = await supabase
          .from('mentor_tech_stacks')
          .delete()
          .eq('mentor_id', user.id)
          .eq('tech_stack_id', techStackId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mentor_tech_stacks')
          .insert({
            mentor_id: user.id,
            tech_stack_id: techStackId,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-tech-stacks'] });
      toast.success('Technology stack preferences updated');
    },
    onError: (error) => {
      toast.error(`Failed to update technology stack: ${error.message}`);
    },
  });

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Technology Stacks</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {techStacks?.map((stack) => {
          const isSelected = selectedTechStacks?.includes(stack.id);
          
          return (
            <Button
              key={stack.id}
              variant={isSelected ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => toggleTechStack.mutate(stack.id)}
            >
              {isSelected ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {stack.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}