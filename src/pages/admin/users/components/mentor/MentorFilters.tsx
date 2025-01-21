import { Toggle } from "@/components/ui/toggle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface MentorFiltersProps {
  selectedTechStacks: string[];
  onTechStackChange: (techStackId: string, pressed: boolean) => void;
}

export function MentorFilters({ selectedTechStacks, onTechStackChange }: MentorFiltersProps) {
  const { data: techStacks, isLoading } = useQuery({
    queryKey: ['tech-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading technology stacks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Filter by Technology</h3>
      <div className="flex flex-wrap gap-2">
        {techStacks?.map((stack) => {
          const isSelected = selectedTechStacks.includes(stack.id);
          
          return (
            <Toggle
              key={stack.id}
              pressed={isSelected}
              onPressedChange={(pressed) => onTechStackChange(stack.id, pressed)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {stack.icon_url && (
                <img 
                  src={stack.icon_url} 
                  alt={`${stack.name} icon`}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
              )}
              {stack.name}
            </Toggle>
          );
        })}
      </div>
    </div>
  );
}