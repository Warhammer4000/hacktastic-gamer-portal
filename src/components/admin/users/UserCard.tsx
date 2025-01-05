import { Github, Linkedin, Pencil, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserCardProps {
  user: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    github_username: string | null;
    linkedin_profile_id: string | null;
    status: string;
  };
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  // Query to fetch team information for the user
  const { data: teamInfo } = useQuery({
    queryKey: ['user-team', user.id],
    queryFn: async () => {
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .select(`
          team:teams (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return teamMember?.team;
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url || ''} alt={user.full_name || ''} />
          <AvatarFallback>{user.full_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{user.full_name || user.email}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {teamInfo && (
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Team: {teamInfo.name}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {user.github_username && (
              <a
                href={`https://github.com/${user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            )}
            {user.linkedin_profile_id && (
              <a
                href={`https://linkedin.com/in/${user.linkedin_profile_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{user.status}</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(user.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(user.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}