import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
import type { TechnologyStacksTable } from "@/integrations/supabase/types/tables/technology-stacks";

type TechStack = TechnologyStacksTable["Row"];

const techStackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon_url: z.string().url("Must be a valid URL"),
});

interface EditTechnologyStackProps {
  stack: TechStack | null;
  onClose: () => void;
}

export const EditTechnologyStack = ({ stack, onClose }: EditTechnologyStackProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof techStackSchema>>({
    resolver: zodResolver(techStackSchema),
    defaultValues: {
      name: stack?.name || "",
      icon_url: stack?.icon_url || "",
    },
  });

  const editTechStack = useMutation({
    mutationFn: async (values: z.infer<typeof techStackSchema>) => {
      if (!stack?.id) return;
      
      const { error } = await supabase
        .from("technology_stacks")
        .update({
          name: values.name,
          icon_url: values.icon_url,
        })
        .eq("id", stack.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techStacks"] });
      onClose();
      form.reset();
      toast({
        title: "Success",
        description: "Technology stack updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update technology stack: " + error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof techStackSchema>) => {
    editTechStack.mutate(values);
  };

  return (
    <Dialog open={!!stack} onOpenChange={(open) => !open && onClose()}>
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
                    <Input placeholder="React" {...field} />
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
                    <Input placeholder="https://example.com/icon.svg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Update Stack</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};