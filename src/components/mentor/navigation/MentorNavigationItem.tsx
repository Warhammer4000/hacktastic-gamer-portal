import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MentorNavigationItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isDisabled: boolean;
}

export function MentorNavigationItem({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  isDisabled 
}: MentorNavigationItemProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isActive && "bg-accent",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={isDisabled}
    >
      <Link to={to}>
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}