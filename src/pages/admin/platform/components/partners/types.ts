export interface Partner {
  id: string;
  name: string;
  icon_url: string;
  website_url: string;
  sort_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export type PartnerFormData = Pick<Partner, "name" | "icon_url" | "website_url">;