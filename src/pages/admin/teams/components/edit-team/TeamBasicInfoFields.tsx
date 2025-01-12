import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamBasicInfoFieldsProps {
  name: string;
  description: string;
  techStackId: string | null;
  onUpdate: (data: { name: string; description: string; tech_stack_id: string | null }) => Promise<void>;
}

export function TeamBasicInfoFields({
  name: initialName,
  description: initialDescription,
  techStackId: initialTechStackId,
  onUpdate,
}: TeamBasicInfoFieldsProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [techStackId, setTechStackId] = useState(initialTechStackId);
  const [isEditing, setIsEditing] = useState(false);

  const { data: techStacks } = useQuery({
    queryKey: ["tech-stacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    await onUpdate({ 
      name, 
      description, 
      tech_stack_id: techStackId 
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="techStack">Technology Stack</Label>
          <select
            id="techStack"
            value={techStackId || ""}
            onChange={(e) => setTechStackId(e.target.value || null)}
            disabled={!isEditing}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select a technology stack</option>
            {techStacks?.map((stack) => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}