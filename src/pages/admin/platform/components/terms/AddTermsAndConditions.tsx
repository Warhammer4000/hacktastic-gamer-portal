import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TermsAndConditionsForm } from "./components/TermsAndConditionsForm";
import { generateVersion } from "../privacy/utils/versionUtils";

type AddTermsAndConditionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTerms?: {
    id: string;
    content: string;
    version: string;
    status: 'draft' | 'published';
  } | null;
};

export function AddTermsAndConditions({ open, onOpenChange, editingTerms }: AddTermsAndConditionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultValues = {
    content: editingTerms?.content || "",
    version: editingTerms?.version || generateVersion(),
  };

  const handleSubmit = async (values: typeof defaultValues, status: 'draft' | 'published') => {
    try {
      setIsSubmitting(true);

      if (editingTerms) {
        const { error } = await supabase
          .from("terms_and_conditions")
          .update({
            content: values.content,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null,
          })
          .eq("id", editingTerms.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Terms and conditions updated successfully",
        });
      } else {
        const { error } = await supabase.from("terms_and_conditions").insert({
          content: values.content,
          version: values.version,
          status,
          published_at: status === 'published' ? new Date().toISOString() : null,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Terms and conditions created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["terms-and-conditions"] });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save terms and conditions",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingTerms ? "Edit Terms and Conditions" : "Create Terms and Conditions"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <TermsAndConditionsForm
            defaultValues={defaultValues}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}