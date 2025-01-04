import React from "react";
import type { TechnologyStacksTable } from "@/integrations/supabase/types/tables/technology-stacks";
import { TechStackCard } from "./TechStackCard";

type TechStacksGridProps = {
  techStacks: TechnologyStacksTable["Row"][];
};

export const TechStacksGrid = ({ techStacks }: TechStacksGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center">
      {techStacks.map((tech) => (
        <TechStackCard key={tech.id} tech={tech} />
      ))}
    </div>
  );
};