import { Database } from '../database';

export interface TermsAndConditionsTable {
  Row: {
    id: string;
    content: string;
    version: string;
    status: Database["public"]["Enums"]["terms_and_conditions_status"];
    published_at: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
  };
  Insert: {
    id?: string;
    content: string;
    version: string;
    status?: Database["public"]["Enums"]["terms_and_conditions_status"];
    published_at?: string | null;
    created_at?: string;
    updated_at?: string;
    created_by?: string | null;
  };
  Update: {
    id?: string;
    content?: string;
    version?: string;
    status?: Database["public"]["Enums"]["terms_and_conditions_status"];
    published_at?: string | null;
    created_at?: string;
    updated_at?: string;
    created_by?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "terms_and_conditions_created_by_fkey";
      columns: ["created_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}