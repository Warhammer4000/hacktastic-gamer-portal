export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      github_settings: {
        Row: {
          admin_team_slug: string | null
          created_at: string
          id: string
          mentor_team_slug: string | null
          organization_name: string | null
          participant_team_slug: string | null
          personal_access_token: string | null
          updated_at: string
        }
        Insert: {
          admin_team_slug?: string | null
          created_at?: string
          id?: string
          mentor_team_slug?: string | null
          organization_name?: string | null
          participant_team_slug?: string | null
          personal_access_token?: string | null
          updated_at?: string
        }
        Update: {
          admin_team_slug?: string | null
          created_at?: string
          id?: string
          mentor_team_slug?: string | null
          organization_name?: string | null
          participant_team_slug?: string | null
          personal_access_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          created_at: string
          id: string
          level: number | null
          updated_at: string
          user_id: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number | null
          updated_at?: string
          user_id?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          updated_at?: string
          user_id?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          icon_url: string
          id: string
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["partner_status"] | null
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          icon_url: string
          id?: string
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["partner_status"] | null
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          icon_url?: string
          id?: string
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["partner_status"] | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          github_username: string | null
          id: string
          is_profile_approved: boolean | null
          is_profile_completed: boolean | null
          linkedin_profile_id: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          github_username?: string | null
          id: string
          is_profile_approved?: boolean | null
          is_profile_completed?: boolean | null
          linkedin_profile_id?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          github_username?: string | null
          id?: string
          is_profile_approved?: boolean | null
          is_profile_completed?: boolean | null
          linkedin_profile_id?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      registration_settings: {
        Row: {
          admin_registration_enabled: boolean | null
          created_at: string
          id: string
          mentor_registration_enabled: boolean | null
          mentor_registration_end: string | null
          mentor_registration_start: string | null
          participant_registration_enabled: boolean | null
          participant_registration_end: string | null
          participant_registration_start: string | null
          updated_at: string
        }
        Insert: {
          admin_registration_enabled?: boolean | null
          created_at?: string
          id?: string
          mentor_registration_enabled?: boolean | null
          mentor_registration_end?: string | null
          mentor_registration_start?: string | null
          participant_registration_enabled?: boolean | null
          participant_registration_end?: string | null
          participant_registration_start?: string | null
          updated_at?: string
        }
        Update: {
          admin_registration_enabled?: boolean | null
          created_at?: string
          id?: string
          mentor_registration_enabled?: boolean | null
          mentor_registration_end?: string | null
          mentor_registration_start?: string | null
          participant_registration_enabled?: boolean | null
          participant_registration_end?: string | null
          participant_registration_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      technology_stacks: {
        Row: {
          created_at: string
          icon_url: string
          id: string
          name: string
          status: Database["public"]["Enums"]["tech_stack_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_url: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["tech_stack_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_url?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["tech_stack_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      partner_status: "active" | "inactive"
      profile_status: "incomplete" | "pending_approval" | "approved" | "flagged"
      tech_stack_status: "active" | "inactive"
      user_role: "participant" | "mentor" | "admin" | "organizer" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
