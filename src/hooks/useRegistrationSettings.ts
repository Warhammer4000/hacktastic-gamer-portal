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
        .maybeSingle();

      if (error) {
        console.error("Error fetching registration settings:", error);
        throw error;
      }

      // If no settings exist, return default values
      if (!data) {
        console.log("No registration settings found, using defaults");
        return {
          participant_registration_enabled: true,
          mentor_registration_enabled: true,
          admin_registration_enabled: true,
          participant_registration_start: null,
          participant_registration_end: null,
          mentor_registration_start: null,
          mentor_registration_end: null,
        };
      }

      console.log("Fetched registration settings:", data);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}