export interface LevelsTable {
  Row: {
    created_at: string;
    id: string;
    level: number | null;
    updated_at: string;
    user_id: string | null;
    xp: number | null;
  };
  Insert: {
    created_at?: string;
    id?: string;
    level?: number | null;
    updated_at?: string;
    user_id?: string | null;
    xp?: number | null;
  };
  Update: {
    created_at?: string;
    id?: string;
    level?: number | null;
    updated_at?: string;
    user_id?: string | null;
    xp?: number | null;
  };
  Relationships: [];
}