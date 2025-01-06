import { MessageSquare } from "lucide-react";
import MentorNavigationItem from "./navigation/MentorNavigationItem";
import LogoutButton from "./navigation/LogoutButton";

export default function MentorNavigation() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col justify-between">
      <nav className="space-y-2 p-4">
        <MentorNavigationItem to="/mentor/dashboard" icon="LayoutDashboard">
          Dashboard
        </MentorNavigationItem>
        <MentorNavigationItem to="/mentor/profile" icon="User">
          Profile
        </MentorNavigationItem>
        <MentorNavigationItem to="/mentor/preferences" icon="Settings">
          Preferences
        </MentorNavigationItem>
        <MentorNavigationItem to="/mentor/benefits" icon="Gift">
          Benefits
        </MentorNavigationItem>
        <MentorNavigationItem to="/mentor/mentees" icon="Users">
          Mentees
        </MentorNavigationItem>
        <MentorNavigationItem to="/mentor/messages" icon={MessageSquare}>
          Messages
        </MentorNavigationItem>
      </nav>
      <div className="p-4">
        <LogoutButton />
      </div>
    </div>
  );
}