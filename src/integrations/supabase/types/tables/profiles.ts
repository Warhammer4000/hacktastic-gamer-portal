export interface ProfilesTable {
  Row: {
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    email: string;
    full_name: string | null;
    id: string;
    updated_at: string;
    linkedin_profile_id: string | null;
    github_username: string | null;
    is_profile_approved: boolean | null;
    is_profile_completed: boolean | null;
    status: 'incomplete' | 'pending_approval' | 'approved' | 'flagged';
  };
  Insert: {
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    email: string;
    full_name?: string | null;
    id: string;
    updated_at?: string;
    linkedin_profile_id?: string | null;
    github_username?: string | null;
    is_profile_approved?: boolean | null;
    is_profile_completed?: boolean | null;
    status?: 'incomplete' | 'pending_approval' | 'approved' | 'flagged';
  };
  Update: {
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string;
    email?: string;
    full_name?: string | null;
    id?: string;
    updated_at?: string;
    linkedin_profile_id?: string | null;
    github_username?: string | null;
    is_profile_approved?: boolean | null;
    is_profile_completed?: boolean | null;
    status?: 'incomplete' | 'pending_approval' | 'approved' | 'flagged';
  };
  Relationships: [];
}