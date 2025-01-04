export interface RegistrationSettingsTable {
  Row: {
    id: string;
    participant_registration_enabled: boolean | null;
    participant_registration_start: string | null;
    participant_registration_end: string | null;
    mentor_registration_enabled: boolean | null;
    mentor_registration_start: string | null;
    mentor_registration_end: string | null;
    admin_registration_enabled: boolean | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    participant_registration_enabled?: boolean | null;
    participant_registration_start?: string | null;
    participant_registration_end?: string | null;
    mentor_registration_enabled?: boolean | null;
    mentor_registration_start?: string | null;
    mentor_registration_end?: string | null;
    admin_registration_enabled?: boolean | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    participant_registration_enabled?: boolean | null;
    participant_registration_start?: string | null;
    participant_registration_end?: string | null;
    mentor_registration_enabled?: boolean | null;
    mentor_registration_start?: string | null;
    mentor_registration_end?: string | null;
    admin_registration_enabled?: boolean | null;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
}