import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const joinTeamSchema = z.object({
  joinCode: z.string().length(6, "Team code must be exactly 6 characters"),
});

type JoinTeamForm = z.infer<typeof joinTeamSchema>;

interface JoinTeamFormProps {
  onSubmit: (data: JoinTeamForm) => Promise<void>;
}

export function JoinTeamForm({ onSubmit }: JoinTeamFormProps) {
  const form = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamSchema),
  });

  return (
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
        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Join with Code
        </Button>
      </form>
    </Form>
  );
}