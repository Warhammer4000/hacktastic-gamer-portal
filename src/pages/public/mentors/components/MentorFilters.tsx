import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MentorFiltersProps {
  selectedTechStacks: string[];
  onTechStacksChange: (techStacks: string[]) => void;
}

export function MentorFilters({ selectedTechStacks, onTechStacksChange }: MentorFiltersProps) {
  const { data: techStacks } = useQuery({
    queryKey: ["tech-stacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const toggleTechStack = (techStackId: string) => {
    if (selectedTechStacks.includes(techStackId)) {
      onTechStacksChange(selectedTechStacks.filter(id => id !== techStackId));
    } else {
      onTechStacksChange([...selectedTechStacks, techStackId]);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Technology</h3>
      <div className="flex flex-wrap gap-2">
        {techStacks?.map((tech) => (
          <Badge
            key={tech.id}
            variant={selectedTechStacks.includes(tech.id) ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80"
            onClick={() => toggleTechStack(tech.id)}
          >
            {tech.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}