import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstitutionsList } from "./InstitutionsList";
import { AddInstitution } from "./AddInstitution";
import { BulkInstitutionsUpload } from "./BulkInstitutionsUpload";
import { ExportInstitutions } from "./ExportInstitutions";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import type { InstitutionType } from "@/integrations/supabase/types/tables/institutions";

export function InstitutionsTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InstitutionType | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Institutions</h2>
        <div className="flex items-center gap-2">
          <ExportInstitutions />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkUploadDialog(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Institution
          </Button>
          <BulkInstitutionsUpload 
            open={showBulkUploadDialog} 
            onOpenChange={setShowBulkUploadDialog}
          />
          <AddInstitution 
            open={showAddDialog} 
            onOpenChange={setShowAddDialog}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search institutions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={(value: InstitutionType | "all") => setTypeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="university">University</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InstitutionsList search={search} typeFilter={typeFilter} />
    </div>
  );
}