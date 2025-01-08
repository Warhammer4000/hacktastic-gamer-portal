import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { data: session, isLoading, error } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth error:", error);
        if (error.message.includes("refresh_token_not_found")) {
          toast.error("Your session has expired. Please login again.");
          navigate("/login");
        }
        return null;
      }
      return session;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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