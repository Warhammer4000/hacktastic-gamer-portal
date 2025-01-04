import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  techStackId: z.string().uuid("Please select a technology stack"),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
  });

  const { data: techStacks, isLoading: isLoadingTechStacks } = useQuery({
    queryKey: ['technology-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  async function onSubmit(data: CreateTeamForm) {
    try {
      // Generate a random 6-character join code
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          tech_stack_id: data.techStackId,
          join_code: joinCode,
          leader_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      // Add the creator as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      setOpen(false);
      navigate(0); // Refresh the page to show the new team
    } catch (error) {
      toast.error("Failed to create team. Please try again.");
      console.error("Error creating team:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Create your team and invite others to join using a team code.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStackId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Stack</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a technology stack" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTechStacks ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        techStacks?.map((stack) => (
                          <SelectItem key={stack.id} value={stack.id}>
                            {stack.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}