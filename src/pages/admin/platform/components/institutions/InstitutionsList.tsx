import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { InstitutionCard } from "./components/InstitutionCard";
import type { Institution } from "@/integrations/supabase/types/tables/institutions";

interface InstitutionsListProps {
  search: string;
  typeFilter: string;
}

export function InstitutionsList({ search, typeFilter }: InstitutionsListProps) {
  const { data: institutions, isLoading } = useQuery({
    queryKey: ["institutions", search, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("institutions")
        .select("*")
        .order("name");

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Institution[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[200px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!institutions?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No institutions found
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {institutions.map((institution) => (
        <InstitutionCard key={institution.id} institution={institution} />
      ))}
    </div>
  );
}