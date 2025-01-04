import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminSearchBar({ searchQuery, setSearchQuery }: AdminSearchBarProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Search administrators..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}