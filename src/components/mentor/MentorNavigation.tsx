import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UserCircle, 
  Calendar,
  Users,
  MessageSquare,
  LogOut
} from "lucide-react";

export default function MentorNavigation() {
  const location = useLocation();
  
  const { data: profile } = useQuery({
    queryKey: ['mentor-profile'],
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

  const isApproved = profile?.status === 'approved';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
      href: "/mentor/dashboard",
      requiresApproval: true
    },
    {
      label: "Profile",
      icon: <UserCircle className="w-4 h-4 mr-2" />,
      href: "/mentor/profile",
      requiresApproval: false
    },
    {
      label: "Schedule",
      icon: <Calendar className="w-4 h-4 mr-2" />,
      href: "/mentor/schedule",
      requiresApproval: true
    },
    {
      label: "Participants",
      icon: <Users className="w-4 h-4 mr-2" />,
      href: "/mentor/participants",
      requiresApproval: true
    },
    {
      label: "Messages",
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
      href: "/mentor/messages",
      requiresApproval: true
    }
  ];

  return (
    <nav className="space-y-2 px-4 py-6">
      {navItems.map((item) => {
        const isDisabled = item.requiresApproval && !isApproved;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={isDisabled ? "#" : item.href}
            className={`w-full`}
            onClick={(e) => {
              if (isDisabled) e.preventDefault();
            }}
          >
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </nav>
  );
}