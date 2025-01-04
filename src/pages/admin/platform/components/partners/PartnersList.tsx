import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { EditPartner } from "./EditPartner";
import type { Partner } from "./types";

export const PartnersList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as Partner[];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      const { error } = await supabase
        .from("partners")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Success",
        description: "Partner status updated",
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

  const deletePartner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete partner: " + error.message,
      });
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, sort_order }: { id: string; sort_order: number }) => {
      const { error } = await supabase
        .from("partners")
        .update({ sort_order })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !partners) return;

    const items = Array.from(partners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for all affected items
    items.forEach((item, index) => {
      updateOrder.mutate({ id: item.id, sort_order: index });
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {partners?.map((partner) => (
        <div
          key={partner.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-card"
        >
          <div className="flex items-center space-x-4">
            <img
              src={partner.icon_url}
              alt={partner.name}
              className="w-12 h-12 object-contain rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div>
              <h3 className="font-medium">{partner.name}</h3>
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                {partner.website_url}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={partner.status === "active"}
              onCheckedChange={(checked) =>
                toggleStatus.mutate({
                  id: partner.id,
                  status: checked ? "active" : "inactive",
                })
              }
            />
            <EditPartner partner={partner} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deletePartner.mutate(partner.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};