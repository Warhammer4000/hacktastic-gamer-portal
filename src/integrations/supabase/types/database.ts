import { LevelsTable } from './tables/levels';
import { ProfilesTable } from './tables/profiles';
import { RegistrationSettingsTable } from './tables/registration-settings';
import { UserRolesTable } from './tables/user-roles';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      levels: LevelsTable;
      profiles: ProfilesTable;
      registration_settings: RegistrationSettingsTable;
      user_roles: UserRolesTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "participant" | "mentor" | "admin" | "organizer" | "moderator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}