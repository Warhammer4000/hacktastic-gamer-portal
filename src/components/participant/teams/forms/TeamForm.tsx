import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParticipantSelect } from "@/pages/admin/teams/components/forms/fields/ParticipantSelect";

export const teamFormSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().optional(),
  techStackId: z.string().uuid("Please select a technology stack"),
  leaderId: z.string().uuid("Please select a team leader"),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  onSubmit: (data: TeamFormValues) => Promise<void>;
  techStacks: { id: string; name: string; }[] | undefined;
  isLoadingTechStacks: boolean;
  defaultValues?: Partial<TeamFormValues>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function TeamForm({ 
  onSubmit, 
  techStacks, 
  isLoadingTechStacks, 
  defaultValues,
  submitLabel = "Create Team",
  isSubmitting = false
}: TeamFormProps) {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <div className="flex-1 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Team Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a memorable team name" 
                    className="h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your project idea and what kind of teammates you're looking for..."
                    className="min-h-[160px] resize-none text-base leading-relaxed"
                    {...field} 
                  />
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
                <FormLabel className="text-base">Technology Stack</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose your primary technology stack" />
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

          <FormField
            control={form.control}
            name="leaderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Team Leader</FormLabel>
                <FormControl>
                  <ParticipantSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    error={!!form.formState.errors.leaderId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full mt-8"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          )}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}