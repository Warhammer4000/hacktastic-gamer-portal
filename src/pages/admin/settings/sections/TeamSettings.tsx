import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function TeamSettings() {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['team-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (maxTeamSize: number) => {
      setIsUpdating(true);
      const { error } = await supabase
        .from('team_settings')
        .update({ max_team_size: maxTeamSize })
        .eq('id', settings?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Team settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ['team-settings'] });
    },
    onError: (error) => {
      console.error('Error updating team settings:', error);
      toast.error("Failed to update team settings");
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const maxTeamSize = parseInt(formData.get('maxTeamSize') as string);
    
    if (isNaN(maxTeamSize) || maxTeamSize < 2) {
      toast.error("Team size must be at least 2");
      return;
    }

    updateSettings.mutate(maxTeamSize);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
          <CardDescription>Configure team-related settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Settings</CardTitle>
        <CardDescription>Configure team-related settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
            <Input
              id="maxTeamSize"
              name="maxTeamSize"
              type="number"
              defaultValue={settings?.max_team_size}
              min={2}
              required
            />
          </div>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}