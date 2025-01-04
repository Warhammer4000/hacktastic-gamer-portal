import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRegistrationSettings() {
  return useQuery({
    queryKey: ["registrationSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}