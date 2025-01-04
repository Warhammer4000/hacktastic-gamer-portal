import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
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
import { toast } from "sonner";

const joinTeamSchema = z.object({
  joinCode: z.string().length(6, "Team code must be exactly 6 characters"),
});

type JoinTeamForm = z.infer<typeof joinTeamSchema>;

export function JoinTeamDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamSchema),
  });

  async function onSubmit(data: JoinTeamForm) {
    try {
      // Find the team with the provided join code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('join_code', data.joinCode.toUpperCase())
        .maybeSingle();

      if (teamError || !team) {
        toast.error("Invalid team code. Please try again.");
        return;
      }

      // Add the user as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (memberError) {
        if (memberError.code === '23505') { // Unique violation
          toast.error("You are already a member of this team.");
        } else {
          toast.error("Failed to join team. Please try again.");
        }
        return;
      }

      toast.success("Successfully joined team!");
      setOpen(false);
      navigate(0); // Refresh the page to show the team
    } catch (error) {
      toast.error("Failed to join team. Please try again.");
      console.error("Error joining team:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Join Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Team</DialogTitle>
          <DialogDescription>
            Enter the team code to join an existing team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-character code"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                  </FormControl>
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
                Join Team
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}