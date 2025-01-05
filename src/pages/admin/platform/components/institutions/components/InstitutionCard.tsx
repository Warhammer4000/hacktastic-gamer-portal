import { useState } from "react";
import { Edit2, Trash2, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditInstitution } from "../EditInstitution";
import { DeleteInstitution } from "../DeleteInstitution";
import type { Institution } from "@/integrations/supabase/types/tables/institutions";

interface InstitutionCardProps {
  institution: Institution;
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="line-clamp-1">{institution.name}</CardTitle>
              <Badge variant="secondary">{institution.type}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEdit(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={institution.logo_url}
            alt={institution.name}
            className="w-full h-24 object-contain"
          />
          {institution.website_url && (
            <a
              href={institution.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
            >
              <Globe className="h-4 w-4" />
              Visit Website
            </a>
          )}
          {institution.location && (
            <p className="text-sm text-muted-foreground">
              Location: {institution.location}
            </p>
          )}
          {institution.email && (
            <p className="text-sm text-muted-foreground">
              Email: {institution.email}
            </p>
          )}
          {institution.phone && (
            <p className="text-sm text-muted-foreground">
              Phone: {institution.phone}
            </p>
          )}
        </CardContent>
      </Card>

      <EditInstitution
        open={showEdit}
        onOpenChange={setShowEdit}
        institution={institution}
      />
      <DeleteInstitution
        open={showDelete}
        onOpenChange={setShowDelete}
        institution={institution}
      />
    </>
  );
}