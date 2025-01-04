export interface Mentor {
  id: string;
  full_name: string | null;
  email: string;
  linkedin_profile_id: string | null;
  github_username: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'pending_approval' | 'approved' | 'flagged' | 'incomplete';
}