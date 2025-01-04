import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditTechnologyStack } from "./EditTechnologyStack";
import { useState } from "react";
import type { TechnologyStacksTable } from "@/integrations/supabase/types/tables/technology-stacks";

type TechStack = TechnologyStacksTable["Row"];

export const TechnologyStackList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);

  const { data: techStacks, isLoading } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as TechStack[];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      const { error } = await supabase
        .from("technology_stacks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techStacks"] });
      toast({
        title: "Success",
        description: "Technology stack status updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status: " + error.message,
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {techStacks?.map((stack) => (
        <div
          key={stack.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <img
              src={stack.icon_url}
              alt={stack.name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <span className="font-medium">{stack.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              checked={stack.status === "active"}
              onCheckedChange={(checked) =>
                toggleStatus.mutate({
                  id: stack.id,
                  status: checked ? "active" : "inactive",
                })
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingStack(stack)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <EditTechnologyStack
        stack={editingStack}
        onClose={() => setEditingStack(null)}
      />
    </div>
  );
};