import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCircle, 
  GraduationCap,
  Calendar,
  MessageSquare,
  Users
} from "lucide-react";
import { ParticipantNavigationItem } from "./navigation/ParticipantNavigationItem";
import { LogoutButton } from "@/components/mentor/navigation/LogoutButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ParticipantNavigation() {
  const location = useLocation();
  
  const { data: profile } = useQuery({
    queryKey: ['participant-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    },
  });

  const isProfileComplete = profile?.is_profile_completed;
  
  const navItems = [
    {
      to: "/participant/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      requiresProfile: true
    },
    {
      to: "/participant/profile",
      icon: UserCircle,
      label: "Profile",
      requiresProfile: false
    },
    {
      to: "/participant/team",
      icon: Users,
      label: "Team",
      requiresProfile: true
    },
    {
      to: "/participant/courses",
      icon: GraduationCap,
      label: "Courses",
      requiresProfile: true
    },
    {
      to: "/participant/sessions",
      icon: Calendar,
      label: "Sessions",
      requiresProfile: true
    },
    {
      to: "/participant/messages",
      icon: MessageSquare,
      label: "Messages",
      requiresProfile: true
    }
  ];

  return (
    <div className="space-y-2">
      {navItems.map((item) => (
        <ParticipantNavigationItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.to}
          isDisabled={item.requiresProfile && !isProfileComplete}
        />
      ))}
      <LogoutButton />
    </div>
  );
}