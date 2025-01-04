import type { Database } from "@/integrations/supabase/types/database";

export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type PartnerFormData = Pick<Partner, "name" | "icon_url" | "website_url">;