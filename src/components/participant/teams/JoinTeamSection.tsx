import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Filter, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const joinTeamSchema = z.object({
  joinCode: z.string().length(6, "Team code must be exactly 6 characters"),
});

type JoinTeamForm = z.infer<typeof joinTeamSchema>;

export function JoinTeamSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState<string>("");
  
  const form = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamSchema),
  });

  const { data: techStacks } = useQuery({
    queryKey: ['tech-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  const { data: availableTeams, refetch } = useQuery({
    queryKey: ['available-teams', searchQuery, selectedTechStack],
    queryFn: async () => {
      let query = supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          tech_stack:tech_stack_id (
            name,
            icon_url
          ),
          team_members (
            id
          )
        `)
        .neq('status', 'locked');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (selectedTechStack) {
        query = query.eq('tech_stack_id', selectedTechStack);
      }

      const { data: teams, error } = await query;
      if (error) throw error;
      return teams.filter(team => team.team_members.length < 3);
    },
  });

  async function onSubmit(data: JoinTeamForm) {
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('join_code', data.joinCode.toUpperCase())
        .maybeSingle();

      if (teamError || !team) {
        toast.error("Invalid team code. Please try again.");
        return;
      }

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.error("You are already a member of this team.");
        } else {
          toast.error("Failed to join team. Please try again.");
        }
        return;
      }

      toast.success("Successfully joined team!");
      form.reset();
      refetch();
    } catch (error) {
      toast.error("Failed to join team. Please try again.");
      console.error("Error joining team:", error);
    }
  }

  const handleJoinTeam = async (teamId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("You are already a member of this team");
        } else {
          toast.error("Failed to join team");
        }
        return;
      }

      toast.success("Successfully joined team!");
      refetch();
    } catch (error) {
      toast.error("Failed to join team");
      console.error("Error joining team:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tech Stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tech Stacks</SelectItem>
                {techStacks?.map((stack) => (
                  <SelectItem key={stack.id} value={stack.id}>
                    {stack.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {availableTeams?.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {team.description}
                      </p>
                    )}
                    {team.tech_stack && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Tech Stack: {team.tech_stack.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Members: {team.team_members.length}/3
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJoinTeam(team.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}