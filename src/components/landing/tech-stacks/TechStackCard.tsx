import React from "react";
import type { TechnologyStacksTable } from "@/integrations/supabase/types/tables/technology-stacks";

type TechStackCardProps = {
  tech: TechnologyStacksTable["Row"];
};

export const TechStackCard = ({ tech }: TechStackCardProps) => {
  return (
    <div
      key={tech.id}
      className="group relative w-full max-w-[240px] aspect-square p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <img
          src={tech.icon_url}
          alt={tech.name}
          className="w-full h-3/4 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white uppercase">
          {tech.name}
        </h3>
      </div>
    </div>
  );
};