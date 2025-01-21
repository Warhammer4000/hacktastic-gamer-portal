import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Upload, UserPlus } from "lucide-react";

interface MentorHeaderProps {
  onAddMentor: () => void;
  onBulkUpload: () => void;
  onExport: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTechStacks: string[];
  onTechStacksChange: (techStacks: string[]) => void;
}

export function MentorHeader({
  onAddMentor,
  onBulkUpload,
  onExport,
  searchQuery,
  onSearchChange,
  selectedTechStacks,
  onTechStacksChange,
}: MentorHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="space-x-2">
          <Button onClick={onAddMentor}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Mentor
          </Button>
          <Button variant="outline" onClick={onBulkUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}