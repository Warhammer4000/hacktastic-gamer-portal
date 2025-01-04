import { Database } from '../database';

export interface UserRolesTable {
  Row: {
    created_at: string;
    id: string;
    role: Database["public"]["Enums"]["user_role"];
    user_id: string | null;
  };
  Insert: {
    created_at?: string;
    id?: string;
    role: Database["public"]["Enums"]["user_role"];
    user_id?: string | null;
  };
  Update: {
    created_at?: string;
    id?: string;
    role?: Database["public"]["Enums"]["user_role"];
    user_id?: string | null;
  };
  Relationships: [];
}