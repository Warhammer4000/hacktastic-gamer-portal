import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PrivacyPolicyForm } from "./components/PrivacyPolicyForm";
import { generateVersion } from "./utils/versionUtils";

type AddPrivacyPolicyProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPolicy?: {
    id: string;
    content: string;
    version: string;
    status: 'draft' | 'published';
  } | null;
};

export function AddPrivacyPolicy({ open, onOpenChange, editingPolicy }: AddPrivacyPolicyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultValues = {
    content: editingPolicy?.content || "",
    version: editingPolicy?.version || generateVersion(),
  };

  const handleSubmit = async (values: typeof defaultValues, status: 'draft' | 'published') => {
    try {
      setIsSubmitting(true);

      if (editingPolicy) {
        const { error } = await supabase
          .from("privacy_policies")
          .update({
            content: values.content,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null,
          })
          .eq("id", editingPolicy.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Privacy policy updated successfully",
        });
      } else {
        const { error } = await supabase.from("privacy_policies").insert({
          content: values.content,
          version: values.version,
          status,
          published_at: status === 'published' ? new Date().toISOString() : null,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Privacy policy created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["privacy-policies"] });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save privacy policy",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingPolicy ? "Edit Privacy Policy" : "Create Privacy Policy"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <PrivacyPolicyForm
            defaultValues={defaultValues}
            isSubmitting={isSubmitting}
            isPreview={isPreview}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            onTogglePreview={() => setIsPreview(!isPreview)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}