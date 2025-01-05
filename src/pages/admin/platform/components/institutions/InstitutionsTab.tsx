import { useState } from "react";
import { ViewIcon, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddInstitution } from "./AddInstitution";
import { InstitutionsList } from "./InstitutionsList";
import { InstitutionsTable } from "./InstitutionsTable";
import { BulkInstitutionsUpload } from "./BulkInstitutionsUpload";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InstitutionsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Institutions</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkUpload(true)} variant="outline">
            Bulk Upload
          </Button>
          <Button onClick={() => setShowAddModal(true)}>Add Institution</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search institutions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-[300px]"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:max-w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="university">University</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>
        <ToggleGroup type="single" value={view} onValueChange={(v) => setView(v as "grid" | "table")}>
          <ToggleGroupItem value="grid">
            <ViewIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table">
            <TableIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "grid" ? (
        <InstitutionsList search={search} typeFilter={typeFilter} />
      ) : (
        <InstitutionsTable search={search} typeFilter={typeFilter} />
      )}

      <AddInstitution open={showAddModal} onOpenChange={setShowAddModal} />
      <BulkInstitutionsUpload open={showBulkUpload} onOpenChange={setShowBulkUpload} />
    </div>
  );
}