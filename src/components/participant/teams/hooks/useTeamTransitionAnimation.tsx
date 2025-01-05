import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useTeamTransitionAnimation() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const queryClient = useQueryClient();

  const handleTransition = async () => {
    setIsTransitioning(true);
    await queryClient.invalidateQueries({ queryKey: ['participant-team'] });
  };

  return {
    isTransitioning,
    handleTransition
  };
}