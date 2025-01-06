import { 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  Settings, 
  Gift, 
  Users 
} from "lucide-react";
import { MentorNavigationItem } from "./navigation/MentorNavigationItem";
import { LogoutButton } from "./navigation/LogoutButton";

export default function MentorNavigation() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col justify-between">
      <nav className="space-y-2 p-4">
        <MentorNavigationItem 
          to="/mentor/dashboard" 
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={false}
          isDisabled={false}
        />
        <MentorNavigationItem 
          to="/mentor/profile" 
          icon={User}
          label="Profile"
          isActive={false}
          isDisabled={false}
        />
        <MentorNavigationItem 
          to="/mentor/preferences" 
          icon={Settings}
          label="Preferences"
          isActive={false}
          isDisabled={false}
        />
        <MentorNavigationItem 
          to="/mentor/benefits" 
          icon={Gift}
          label="Benefits"
          isActive={false}
          isDisabled={false}
        />
        <MentorNavigationItem 
          to="/mentor/mentees" 
          icon={Users}
          label="Mentees"
          isActive={false}
          isDisabled={false}
        />
        <MentorNavigationItem 
          to="/mentor/messages" 
          icon={MessageSquare}
          label="Messages"
          isActive={false}
          isDisabled={false}
        />
      </nav>
      <div className="p-4">
        <LogoutButton />
      </div>
    </div>
  );
}