export interface ProfilesTable {
  Row: {
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    email: string;
    full_name: string | null;
    id: string;
    updated_at: string;
  };
  Insert: {
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    email: string;
    full_name?: string | null;
    id: string;
    updated_at?: string;
  };
  Update: {
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    email?: string;
    full_name?: string | null;
    id?: string;
    updated_at?: string;
  };
  Relationships: [];
}