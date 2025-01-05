import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Globe } from "lucide-react";
import { useState } from "react";
import { EditInstitution } from "./EditInstitution";
import { DeleteInstitution } from "./DeleteInstitution";
import type { Institution } from "@/integrations/supabase/types/tables/institutions";

interface InstitutionsTableProps {
  search: string;
  typeFilter: string;
}

export function InstitutionsTable({ search, typeFilter }: InstitutionsTableProps) {
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(
    null
  );
  const [deletingInstitution, setDeletingInstitution] =
    useState<Institution | null>(null);

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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions?.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell className="font-medium">{institution.name}</TableCell>
              <TableCell>{institution.type}</TableCell>
              <TableCell>{institution.location || "-"}</TableCell>
              <TableCell>{institution.email || "-"}</TableCell>
              <TableCell>{institution.phone || "-"}</TableCell>
              <TableCell>
                {institution.website_url ? (
                  <a
                    href={institution.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4" />
                    Visit
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingInstitution(institution)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingInstitution(institution)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingInstitution && (
        <EditInstitution
          open={!!editingInstitution}
          onOpenChange={() => setEditingInstitution(null)}
          institution={editingInstitution}
        />
      )}

      {deletingInstitution && (
        <DeleteInstitution
          open={!!deletingInstitution}
          onOpenChange={() => setDeletingInstitution(null)}
          institution={deletingInstitution}
        />
      )}
    </>
  );
}