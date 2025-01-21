import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface MentorFiltersProps {
  selectedTechStacks: string[];
  onTechStacksChange: (techStacks: string[]) => void;
}

export function MentorFilters({ selectedTechStacks, onTechStacksChange }: MentorFiltersProps) {
  const { data: techStacks, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Technology</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Technology</h3>
      <div className="flex flex-wrap gap-2">
        {techStacks?.map((stack) => (
          <Badge
            key={stack.id}
            variant={selectedTechStacks.includes(stack.id) ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80 flex items-center gap-2"
            onClick={() => {
              if (selectedTechStacks.includes(stack.id)) {
                onTechStacksChange(selectedTechStacks.filter(id => id !== stack.id));
              } else {
                onTechStacksChange([...selectedTechStacks, stack.id]);
              }
            }}
          >
            {stack.icon_url && (
              <img 
                src={stack.icon_url} 
                alt={stack.name} 
                className="w-4 h-4"
                loading="lazy"
              />
            )}
            {stack.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}