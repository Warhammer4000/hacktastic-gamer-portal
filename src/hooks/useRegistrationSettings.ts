import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRegistrationSettings() {
  return useQuery({
    queryKey: ["registrationSettings"],
    queryFn: async () => {
      console.log("Fetching registration settings...");
      
      const { data, error } = await supabase
        .from("registration_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching registration settings:", error);
        throw error;
      }

      console.log("Fetched registration settings:", data);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}