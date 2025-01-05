import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const teamDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  techStackId: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamDetailsSchema>;

interface TeamDetailsFormProps {
  onSubmit: (data: TeamFormValues) => Promise<void>;
  techStacks: {
    id: string;
    name: string;
    icon_url: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
  }[];
  isLoadingTechStacks: boolean;
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    tech_stack: {
      name: string;
    } | null;
    tech_stack_id: string | null;
    repository_url: string | null;
    leader_id: string;
  };
  onCancel: () => void;
}

export function TeamDetailsForm({ onSubmit, techStacks, isLoadingTechStacks, team, onCancel }: TeamDetailsFormProps) {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamDetailsSchema),
    defaultValues: {
      name: team.name,
      description: team.description || "",
      techStackId: team.tech_stack_id || "",
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    reset({
      name: team.name,
      description: team.description || "",
      techStackId: team.tech_stack_id || "",
    });
  }, [team, reset]);

  const handleFormSubmit = async (data: TeamFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Team Name</label>
        <Input {...form.register("name")} placeholder="Enter team name" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input {...form.register("description")} placeholder="Enter team description" />
      </div>
      <div>
        <label className="block text-sm font-medium">Tech Stack</label>
        <Select {...form.register("techStackId")}>
          <SelectTrigger>
            <SelectValue placeholder="Select tech stack" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingTechStacks ? (
              <SelectItem value="">Loading...</SelectItem>
            ) : (
              techStacks.map((stack) => (
                <SelectItem key={stack.id} value={stack.id}>
                  {stack.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
