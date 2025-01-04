import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type SortButtonProps = {
  direction: 'asc' | 'desc';
  onToggle: () => void;
};

export function SortButton({ direction, onToggle }: SortButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="flex items-center gap-2"
    >
      Sort by Date
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
}