import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mentorSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  github_username: z.string().min(1, "GitHub username is required"),
  linkedin_profile_id: z.string().min(1, "LinkedIn profile ID is required"),
});

type MentorFormValues = z.infer<typeof mentorSchema>;

export default function AddMentorDialog({ open, onOpenChange }: AddMentorDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      email: "",
      full_name: "",
      github_username: "",
      linkedin_profile_id: "",
    },
  });

  const addMentor = useMutation({
    mutationFn: async (values: MentorFormValues) => {
      const password = Math.random().toString(36).slice(-8); // Generate random password

      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password,
        options: {
          data: {
            full_name: values.full_name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Add mentor role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'mentor'
        }]);

      if (roleError) throw roleError;

      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          github_username: values.github_username,
          linkedin_profile_id: values.linkedin_profile_id
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      return { email: values.email };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success(`Successfully added mentor: ${result.email}`);
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to add mentor: ${error.message}`);
    },
  });

  const onSubmit = (values: MentorFormValues) => {
    addMentor.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Mentor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_profile_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMentor.isPending}
              >
                {addMentor.isPending ? "Adding..." : "Add Mentor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}