import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddPrivacyPolicy } from "./AddPrivacyPolicy";
import { PrivacyPolicyList } from "./PrivacyPolicyList";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export function PrivacyPolicyTab() {
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const { data: policy, isLoading } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("privacy_policies")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setShowAddPolicy(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        {!policy && (
          <Button onClick={() => {
            setEditingPolicy(null);
            setShowAddPolicy(true);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        )}
      </div>

      <PrivacyPolicyList 
        policy={policy} 
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