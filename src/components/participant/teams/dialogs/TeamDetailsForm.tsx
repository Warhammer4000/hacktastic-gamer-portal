import { TeamForm, type TeamFormValues } from "../forms/TeamForm";

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
  return (
    <>
      <TeamForm
        onSubmit={onSubmit}
        techStacks={techStacks}
        isLoadingTechStacks={isLoadingTechStacks}
        defaultValues={{
          name: team.name,
          description: team.description || undefined,
          techStackId: team.tech_stack_id || undefined,
        }}
        submitLabel="Save Changes"
      />
      <Button
        variant="outline"
        onClick={onCancel}
        className="mt-2"
      >
        Cancel
      </Button>
    </>
  );
}