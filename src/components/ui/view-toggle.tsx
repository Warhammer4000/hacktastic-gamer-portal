import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "./button";

interface ViewToggleProps {
  view: "table" | "card";
  onViewChange: (view: "table" | "card") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={view === "table" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("table")}
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "card" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("card")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}