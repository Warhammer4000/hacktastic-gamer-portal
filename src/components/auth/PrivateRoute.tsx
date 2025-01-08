import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading, error } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth error:", error);
        return null;
      }
      return session;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error("Session error:", error);
    return <Navigate to="/login" />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
}