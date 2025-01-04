import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MentorNavigation from "@/components/mentor/MentorNavigation";

export default function MentorLayout() {
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (profile && !profile.is_profile_completed) {
      toast.warning("Please complete your profile first");
      navigate("/mentor/profile");
    }
  }, [profile, navigate]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-primary">Mentor Portal</h1>
        </div>
        <MentorNavigation />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}