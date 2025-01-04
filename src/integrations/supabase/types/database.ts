import { LevelsTable } from './tables/levels';
import { ProfilesTable } from './tables/profiles';
import { RegistrationSettingsTable } from './tables/registration-settings';
import { UserRolesTable } from './tables/user-roles';
import { TechnologyStacksTable } from './tables/technology-stacks';
import { PartnersTable } from './tables/partners';
import { GalleryPostsTable } from './tables/gallery-posts';
import { TermsAndConditionsTable } from './tables/terms-and-conditions';

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
      technology_stacks: TechnologyStacksTable;
      partners: PartnersTable;
      gallery_posts: GalleryPostsTable;
      terms_and_conditions: TermsAndConditionsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "participant" | "mentor" | "admin" | "organizer" | "moderator";
      tech_stack_status: "active" | "inactive";
      partner_status: "active" | "inactive";
      terms_and_conditions_status: "draft" | "published";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}