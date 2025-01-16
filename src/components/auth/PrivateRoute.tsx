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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          if (error.message.includes("JWT")) {
            toast.error("Your session has expired. Please login again.");
            // Clear any existing session
            await supabase.auth.signOut();
            navigate("/login");
            return null;
          }
          throw error;
        }

        if (!session) {
          return null;
        }

        // Verify the user still exists
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User verification error:", userError);
          toast.error("Session invalid. Please login again.");
          await supabase.auth.signOut();
          navigate("/login");
          return null;
        }

        return session;
      } catch (error) {
        console.error("Session error:", error);
        toast.error("An error occurred. Please login again.");
        await supabase.auth.signOut();
        navigate("/login");
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
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