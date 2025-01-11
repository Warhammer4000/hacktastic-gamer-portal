import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamBasicInfoFieldsProps {
  name: string;
  description: string;
  techStackId: string;
  repositoryUrl: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTechStackChange: (value: string) => void;
  onRepositoryUrlChange: (value: string) => void;
  techStacks?: Array<{ id: string; name: string }>;
}

export function TeamBasicInfoFields({
  name,
  description,
  techStackId,
  repositoryUrl,
  onNameChange,
  onDescriptionChange,
  onTechStackChange,
  onRepositoryUrlChange,
  techStacks,
}: TeamBasicInfoFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech-stack">Technology Stack</Label>
        <Select value={techStackId} onValueChange={onTechStackChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select tech stack" />
          </SelectTrigger>
          <SelectContent>
            {techStacks?.map((stack) => (
              <SelectItem key={stack.id} value={stack.id}>
                {stack.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="repository">Repository URL</Label>
        <Input
          id="repository"
          value={repositoryUrl}
          onChange={(e) => onRepositoryUrlChange(e.target.value)}
          placeholder="https://github.com/org/repo"
        />
      </div>
    </div>
  );
}