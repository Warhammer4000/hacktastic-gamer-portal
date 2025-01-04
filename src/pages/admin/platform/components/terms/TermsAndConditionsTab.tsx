import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddTermsAndConditions } from "./AddTermsAndConditions";
import { TermsAndConditionsList } from "./TermsAndConditionsList";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export function TermsAndConditionsTab() {
  const [showAddTerms, setShowAddTerms] = useState(false);
  const [editingTerms, setEditingTerms] = useState<any>(null);

  const { data: terms, isLoading } = useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terms_and_conditions")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const handleEdit = (terms: any) => {
    setEditingTerms(terms);
    setShowAddTerms(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Terms and Conditions</h2>
        {!terms && (
          <Button onClick={() => {
            setEditingTerms(null);
            setShowAddTerms(true);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Create Terms
          </Button>
        )}
      </div>

      <TermsAndConditionsList 
        terms={terms} 
        isLoading={isLoading} 
        onEdit={handleEdit}
      />
      
      <AddTermsAndConditions 
        open={showAddTerms} 
        onOpenChange={setShowAddTerms}
        editingTerms={editingTerms}
      />
    </div>
  );
}