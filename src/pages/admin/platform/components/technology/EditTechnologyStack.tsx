import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { TechnologyStacksTable } from "@/integrations/supabase/types/tables/technology-stacks";

type TechStack = TechnologyStacksTable["Row"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  icon_url: z.string().url("Must be a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTechnologyStackProps {
  stack: TechStack | null;
  onClose: () => void;
}

export const EditTechnologyStack = ({ stack, onClose }: EditTechnologyStackProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon_url: "",
    },
  });

  // Update form values when stack changes
  useEffect(() => {
    if (stack) {
      form.reset({
        name: stack.name,
        icon_url: stack.icon_url,
      });
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [stack, form]);

  const updateStack = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!stack) throw new Error("No stack selected");

      const { error } = await supabase
        .from("technology_stacks")
        .update({
          name: values.name,
          icon_url: values.icon_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", stack.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techStacks"] });
      toast({
        title: "Success",
        description: "Technology stack updated successfully",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update technology stack: " + error.message,
      });
    },
  });

  const handleClose = () => {
    setOpen(false);
    form.reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    updateStack.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Technology Stack</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter technology name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter icon URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateStack.isPending}
              >
                {updateStack.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};