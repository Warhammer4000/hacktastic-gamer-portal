import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstitutionsList } from "./InstitutionsList";
import { AddInstitution } from "./AddInstitution";
import { BulkInstitutionsUpload } from "./BulkInstitutionsUpload";
import { ExportInstitutions } from "./ExportInstitutions";

export function InstitutionsTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Institutions</h2>
        <div className="flex items-center gap-2">
          <ExportInstitutions />
          <BulkInstitutionsUpload />
          <AddInstitution />
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search institutions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
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