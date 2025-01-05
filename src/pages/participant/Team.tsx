import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TeamDetailsDialog } from "@/components/participant/teams/TeamDetailsDialog";
import { DeleteTeamDialog } from "@/components/participant/teams/DeleteTeamDialog";
import { CreateTeamSection } from "@/components/participant/teams/page/CreateTeamSection";
import { TeamCard } from "@/components/participant/teams/TeamCard";
import { AnimatePresence, motion } from "framer-motion";

const MAX_TEAM_MEMBERS = 3;

export default function TeamPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: team, refetch } = useQuery({
    queryKey: ['participant-team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!teamMember) return null;

      const { data: team } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          join_code,
          status,
          mentor_id,
          leader_id,
          repository_url,
          description,
          tech_stack_id,
          tech_stack:tech_stack_id (
            name,
            icon_url
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      return team;
    },
  });

  const handleTeamJoined = async () => {
    setIsJoining(true);
    await refetch();
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Team</h1>
      
      <AnimatePresence mode="wait">
        {!team ? (
          <motion.div
            key="create-team"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <CreateTeamSection 
              maxMembers={MAX_TEAM_MEMBERS} 
              onTeamJoined={handleTeamJoined}
            />
          </motion.div>
        ) : (
          <motion.div
            key="team-card"
            initial={isJoining ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TeamCard
              team={team}
              onEditTeam={() => setIsEditDialogOpen(true)}
              onDeleteTeam={() => setIsDeleteDialogOpen(true)}
              isLocked={team.status === 'locked'}
              currentUserId={currentUser?.id || ''}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TeamDetailsDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        team={team}
      />

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleTeamJoined}
      />
    </div>
  );
}