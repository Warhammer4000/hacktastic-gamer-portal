import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  Calendar,
  MessageSquare,
  Settings
} from "lucide-react";
import { MentorNavigationItem } from "./navigation/MentorNavigationItem";
import { LogoutButton } from "./navigation/LogoutButton";
import { useMentorNavigationProfile } from "@/hooks/useMentorNavigationProfile";

export default function MentorNavigation() {
  const location = useLocation();
  const { isApproved } = useMentorNavigationProfile();
  
  const navItems = [
    {
      to: "/mentor/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      requiresApproval: true
    },
    {
      to: "/mentor/profile",
      icon: UserCircle,
      label: "Profile",
      requiresApproval: false
    },
    {
      to: "/mentor/preferences",
      icon: Settings,
      label: "Preferences",
      requiresApproval: false
    },
    {
      to: "/mentor/mentees",
      icon: Users,
      label: "Mentees",
      requiresApproval: true
    },
    {
      to: "/mentor/sessions",
      icon: Calendar,
      label: "Sessions",
      requiresApproval: true
    },
    {
      to: "/mentor/messages",
      icon: MessageSquare,
      label: "Messages",
      requiresApproval: true
    }
  ];

  return (
    <div className="space-y-2">
      {navItems.map((item) => (
        <MentorNavigationItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.to}
          isDisabled={item.requiresApproval && !isApproved}
        />
      ))}
      <LogoutButton />
    </div>
  );
}