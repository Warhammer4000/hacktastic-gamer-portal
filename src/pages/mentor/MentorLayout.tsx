import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  return <Outlet />;
}