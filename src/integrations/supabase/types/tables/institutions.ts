import type { Database } from "../database";

export interface InstitutionsTable {
  Row: {
    id: string;
    type: "university" | "organization";
    name: string;
    logo_url: string;
    location: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    type: "university" | "organization";
    name: string;
    logo_url: string;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    type?: "university" | "organization";
    name?: string;
    logo_url?: string;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export type Institution = InstitutionsTable["Row"];
export type InsertInstitution = InstitutionsTable["Insert"];
export type UpdateInstitution = InstitutionsTable["Update"];