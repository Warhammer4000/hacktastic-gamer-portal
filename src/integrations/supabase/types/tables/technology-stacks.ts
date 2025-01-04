export interface TechnologyStacksTable {
  Row: {
    id: string;
    name: string;
    icon_url: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    icon_url: string;
    status?: "active" | "inactive";
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    icon_url?: string;
    status?: "active" | "inactive";
    created_at?: string;
    updated_at?: string;
  };
}