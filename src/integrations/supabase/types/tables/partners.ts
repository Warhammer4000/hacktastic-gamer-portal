export interface PartnersTable {
  Row: {
    id: string;
    name: string;
    icon_url: string;
    website_url: string;
    sort_order: number;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    name: string;
    icon_url: string;
    website_url: string;
    sort_order?: number;
    status?: "active" | "inactive";
  };
  Update: {
    name?: string;
    icon_url?: string;
    website_url?: string;
    sort_order?: number;
    status?: "active" | "inactive";
  };
  Relationships: [];
}