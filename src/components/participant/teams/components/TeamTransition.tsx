import { motion, AnimatePresence } from "framer-motion";
import { CreateTeamSection } from "../page/CreateTeamSection";
import { TeamCard } from "../TeamCard";

interface TeamTransitionProps {
  team: any;
  isJoining: boolean;
  currentUserId: string;
  onEditTeam: () => void;
  onDeleteTeam: () => void;
  onTeamJoined: () => Promise<void>;
}

export function TeamTransition({
  team,
  isJoining,
  currentUserId,
  onEditTeam,
  onDeleteTeam,
  onTeamJoined
}: TeamTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {!team ? (
        <motion.div
          key="create-team"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <CreateTeamSection 
            maxMembers={3} 
            onTeamJoined={onTeamJoined}
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
            onEditTeam={onEditTeam}
            onDeleteTeam={onDeleteTeam}
            isLocked={team.status === 'locked'}
            currentUserId={currentUserId}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}