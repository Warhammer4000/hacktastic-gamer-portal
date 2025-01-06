import { Toggle } from "@/components/ui/toggle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MentorFiltersProps {
  selectedTechStacks: string[];
  onTechStackChange: (techStackId: string, pressed: boolean) => void;
}

export function MentorFilters({ selectedTechStacks, onTechStackChange }: MentorFiltersProps) {
  const { data: techStacks } = useQuery({
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

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Filter by Technology</h3>
      <div className="flex flex-wrap gap-2">
        {techStacks?.map((stack) => (
          <Toggle
            key={stack.id}
            pressed={selectedTechStacks.includes(stack.id)}
            onPressedChange={(pressed) => onTechStackChange(stack.id, pressed)}
            className="bg-emerald-500 data-[state=on]:bg-emerald-700 text-white hover:bg-emerald-600"
          >
            {stack.name}
          </Toggle>
        ))}
      </div>
    </div>
  );
}