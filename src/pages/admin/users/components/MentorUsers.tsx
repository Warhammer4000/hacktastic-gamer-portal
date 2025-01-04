import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface MentorWithProfile {
  user_id: string;
  profile: Profile;
}

export default function MentorUsers() {
  const { toast } = useToast();

  const { data: mentors, isLoading, refetch } = useQuery<MentorWithProfile[]>({
    queryKey: ["mentor-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          profile:profiles!user_roles_user_id_fkey_profiles (*)
        `)
        .eq("role", "mentor");

      if (error) throw error;
      
      return data as MentorWithProfile[];
    },
  });

  const handleDeleteMentor = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "mentor");

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete mentor role",
      });
    } else {
      toast({
        title: "Success",
        description: "Mentor role has been deleted",
      });
      refetch();
    }
  };

  if (isLoading) {
    return <div>Loading mentors...</div>;
  }

  return (
    <div className="space-y-4">
      {mentors?.map((mentor) => (
        <Card key={mentor.user_id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {mentor.profile?.avatar_url && (
                <img
                  src={mentor.profile.avatar_url}
                  alt={mentor.profile?.full_name || "Mentor"}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h3 className="font-medium">{mentor.profile?.full_name}</h3>
                <p className="text-sm text-gray-500">{mentor.profile?.email}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDeleteMentor(mentor.user_id)}
            >
              Remove Mentor Role
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}