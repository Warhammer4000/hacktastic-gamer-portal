import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

interface TeamCountPreferenceProps {
  defaultValue: number;
}

export function TeamCountPreference({ defaultValue }: TeamCountPreferenceProps) {
  const [value, setValue] = useState(String(defaultValue));
  const queryClient = useQueryClient();

  const updateTeamCount = useMutation({
    mutationFn: async (teamCount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('mentor_preferences')
        .upsert({
          user_id: user.id,
          team_count: teamCount,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-preferences'] });
      toast.success('Team count preference updated');
    },
    onError: (error) => {
      toast.error(`Failed to update team count: ${error.message}`);
    },
  });

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    updateTeamCount.mutate(parseInt(newValue));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <Label className="text-base font-medium">Preferred Team Count</Label>
      </div>
      
      <RadioGroup
        value={value}
        onValueChange={handleValueChange}
        className="flex gap-4"
      >
        {[1, 2, 3, 4, 5].map((count) => (
          <div key={count} className="flex items-center space-x-2">
            <RadioGroupItem value={String(count)} id={`count-${count}`} />
            <Label htmlFor={`count-${count}`}>{count}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}