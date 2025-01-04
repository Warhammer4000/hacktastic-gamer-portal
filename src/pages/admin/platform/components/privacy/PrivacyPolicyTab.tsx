import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddPrivacyPolicy } from "./AddPrivacyPolicy";
import { PrivacyPolicyList } from "./PrivacyPolicyList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PrivacyPolicyTab() {
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["privacy-policies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("privacy_policies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setShowAddPolicy(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Privacy Policies</h2>
        <Button onClick={() => {
          setEditingPolicy(null);
          setShowAddPolicy(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Policy
        </Button>
      </div>

      <PrivacyPolicyList 
        policies={policies} 
        isLoading={isLoading} 
        onEdit={handleEdit}
      />
      
      <AddPrivacyPolicy 
        open={showAddPolicy} 
        onOpenChange={setShowAddPolicy}
        editingPolicy={editingPolicy}
      />
    </div>
  );
}