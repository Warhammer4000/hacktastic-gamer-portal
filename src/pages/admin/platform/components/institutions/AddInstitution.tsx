import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { InsertInstitution } from "@/integrations/supabase/types/tables/institutions";
import { InstitutionForm, type InstitutionFormValues } from "./components/InstitutionForm";

interface AddInstitutionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInstitution({ open, onOpenChange }: AddInstitutionProps) {
  const queryClient = useQueryClient();

  const addInstitution = useMutation({
    mutationFn: async (values: InstitutionFormValues) => {
      const institution: InsertInstitution = {
        name: values.name,
        type: values.type,
        logo_url: values.logo_url,
        location: values.location || null,
        email: values.email || null,
        phone: values.phone || null,
        website_url: values.website_url || null,
      };

      const { error } = await supabase.from("institutions").insert([institution]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      onOpenChange(false);
      toast.success("Institution added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add institution: " + error.message);
    },
  });

  const defaultValues: InstitutionFormValues = {
    name: "",
    type: "university",
    logo_url: "",
    location: "",
    email: "",
    phone: "",
    website_url: "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Institution</DialogTitle>
        </DialogHeader>
        <InstitutionForm
          defaultValues={defaultValues}
          onSubmit={(values) => addInstitution.mutate(values)}
          submitLabel="Add Institution"
        />
      </DialogContent>
    </Dialog>
  );
}