import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const techStackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon_url: z.string().url("Must be a valid URL"),
});

type TechStack = {
  id: string;
  name: string;
  icon_url: string;
  status: "active" | "inactive";
};

export const PlatformSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof techStackSchema>>({
    resolver: zodResolver(techStackSchema),
    defaultValues: {
      name: "",
      icon_url: "",
    },
  });

  const { data: techStacks, isLoading } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as TechStack[];
    },
  });

  const addTechStack = useMutation({
    mutationFn: async (values: z.infer<typeof techStackSchema>) => {
      const { error } = await supabase.from("technology_stacks").insert([
        {
          name: values.name,
          icon_url: values.icon_url,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techStacks"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Technology stack added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add technology stack: " + error.message,
      });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      const { error } = await supabase
        .from("technology_stacks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techStacks"] });
      toast({
        title: "Success",
        description: "Technology stack status updated",
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

  const onSubmit = (values: z.infer<typeof techStackSchema>) => {
    addTechStack.mutate(values);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Technology Stacks</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Technology Stack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Technology Stack</DialogTitle>
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
                <Button type="submit" className="w-full">Add Stack</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {techStacks?.map((stack) => (
          <div
            key={stack.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={stack.icon_url}
                alt={stack.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <span className="font-medium">{stack.name}</span>
            </div>
            <Switch
              checked={stack.status === "active"}
              onCheckedChange={(checked) =>
                toggleStatus.mutate({
                  id: stack.id,
                  status: checked ? "active" : "inactive",
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};