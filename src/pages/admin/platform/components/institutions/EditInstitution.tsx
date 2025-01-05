import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Institution } from "@/integrations/supabase/types/tables/institutions";
import { InstitutionForm, type InstitutionFormValues } from "./components/InstitutionForm";

interface EditInstitutionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: Institution;
}

export function EditInstitution({ open, onOpenChange, institution }: EditInstitutionProps) {
  const queryClient = useQueryClient();

  const editInstitution = useMutation({
    mutationFn: async (values: InstitutionFormValues) => {
      const { error } = await supabase
        .from("institutions")
        .update(values)
        .eq("id", institution.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      onOpenChange(false);
      toast.success("Institution updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update institution: " + error.message);
    },
  });

  const defaultValues: InstitutionFormValues = {
    name: institution.name,
    type: institution.type,
    logo_url: institution.logo_url,
    location: institution.location || "",
    email: institution.email || "",
    phone: institution.phone || "",
    website_url: institution.website_url || "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Institution</DialogTitle>
        </DialogHeader>
        <InstitutionForm
          defaultValues={defaultValues}
          onSubmit={(values) => editInstitution.mutate(values)}
          submitLabel="Update Institution"
        />
      </DialogContent>
    </Dialog>
  );
}