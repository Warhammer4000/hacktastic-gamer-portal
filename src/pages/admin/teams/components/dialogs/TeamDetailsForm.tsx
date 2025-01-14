import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const teamDetailsSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().optional(),
  techStackId: z.string().uuid("Please select a technology stack"),
});

type TeamFormValues = z.infer<typeof teamDetailsSchema>;

interface TeamDetailsFormProps {
  onSubmit: (data: TeamFormValues) => Promise<void>;
  techStacks: { id: string; name: string; }[] | undefined;
  isLoadingTechStacks: boolean;
  team: {
    name: string;
    description: string | null;
    tech_stack_id: string | null;
  };
  onCancel: () => void;
}

export function TeamDetailsForm({
  onSubmit,
  techStacks,
  isLoadingTechStacks,
  team,
  onCancel,
}: TeamDetailsFormProps) {
  const { data: teamSettings } = useQuery({
    queryKey: ['team-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamDetailsSchema),
    defaultValues: {
      name: team.name,
      description: team.description || "",
      techStackId: team.tech_stack_id || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                    <SelectValue placeholder="Select tech stack" />
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
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}