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
      bulk_upload_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_log: Json | null
          failed_records: number | null
          file_name: string | null
          file_size: number | null
          id: string
          processed_records: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["bulk_upload_status"] | null
          successful_records: number | null
          total_records: number | null
          updated_at: string | null
          upload_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          processed_records?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["bulk_upload_status"] | null
          successful_records?: number | null
          total_records?: number | null
          updated_at?: string | null
          upload_type?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          processed_records?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["bulk_upload_status"] | null
          successful_records?: number | null
          total_records?: number | null
          updated_at?: string | null
          upload_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_batches: {
        Row: {
          created_at: string
          description: string | null
          eligible_roles: Database["public"]["Enums"]["user_role"][]
          id: string
          name: string
          redemption_instructions: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          eligible_roles: Database["public"]["Enums"]["user_role"][]
          id?: string
          name: string
          redemption_instructions: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          eligible_roles?: Database["public"]["Enums"]["user_role"][]
          id?: string
          name?: string
          redemption_instructions?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_batches_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "coupon_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_vendors: {
        Row: {
          created_at: string
          icon_url: string
          id: string
          name: string
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          icon_url: string
          id?: string
          name: string
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          icon_url?: string
          id?: string
          name?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          batch_id: string
          code: string
          created_at: string
          id: string
          reveal_date: string | null
          state: Database["public"]["Enums"]["coupon_state"]
          updated_at: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          batch_id: string
          code: string
          created_at?: string
          id?: string
          reveal_date?: string | null
          state?: Database["public"]["Enums"]["coupon_state"]
          updated_at?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          batch_id?: string
          code?: string
          created_at?: string
          id?: string
          reveal_date?: string | null
          state?: Database["public"]["Enums"]["coupon_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "coupon_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string
          end_time: string
          id: string
          roles: Database["public"]["Enums"]["event_role"][]
          start_time: string
          status: Database["public"]["Enums"]["event_status"]
          tech_stacks: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          end_time: string
          id?: string
          roles?: Database["public"]["Enums"]["event_role"][]
          start_time: string
          status?: Database["public"]["Enums"]["event_status"]
          tech_stacks?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          end_time?: string
          id?: string
          roles?: Database["public"]["Enums"]["event_role"][]
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"]
          tech_stacks?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          status: Database["public"]["Enums"]["faq_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["faq_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["faq_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category_id: string
          created_at: string
          id: string
          question: string
          sort_order: number
          status: Database["public"]["Enums"]["faq_status"] | null
          updated_at: string
        }
        Insert: {
          answer: string
          category_id: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          status?: Database["public"]["Enums"]["faq_status"] | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category_id?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["faq_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      institutions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          location: string | null
          logo_url: string
          name: string
          phone: string | null
          status: string | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          logo_url: string
          name: string
          phone?: string | null
          status?: string | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          logo_url?: string
          name?: string
          phone?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          website_url?: string | null
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
      mentor_preferences: {
        Row: {
          created_at: string
          id: string
          team_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_preferences_mentor_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_tech_stacks: {
        Row: {
          created_at: string
          id: string
          tech_stack_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tech_stack_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tech_stack_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_tech_stacks_mentor_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_tech_stacks_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            isOneToOne: false
            referencedRelation: "technology_stacks"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reads: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "team_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_posts: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["news_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["news_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["news_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      privacy_policies: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["privacy_policy_status"] | null
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["privacy_policy_status"] | null
          updated_at?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["privacy_policy_status"] | null
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_policies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          institution_id: string | null
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
          institution_id?: string | null
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
          institution_id?: string | null
          is_profile_approved?: boolean | null
          is_profile_completed?: boolean | null
          linkedin_profile_id?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      session_availabilities: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string | null
          id: string
          session_template_id: string | null
          slot_index: number
          start_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time?: string | null
          id?: string
          session_template_id?: string | null
          slot_index: number
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string | null
          id?: string
          session_template_id?: string | null
          slot_index?: number
          start_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_availabilities_session_template_id_fkey"
            columns: ["session_template_id"]
            isOneToOne: false
            referencedRelation: "session_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      session_bookings: {
        Row: {
          availability_id: string
          booking_date: string
          created_at: string
          id: string
          mentor_id: string
          session_template_id: string
          status: Database["public"]["Enums"]["session_booking_status"]
          updated_at: string
        }
        Insert: {
          availability_id: string
          booking_date: string
          created_at?: string
          id?: string
          mentor_id: string
          session_template_id: string
          status?: Database["public"]["Enums"]["session_booking_status"]
          updated_at?: string
        }
        Update: {
          availability_id?: string
          booking_date?: string
          created_at?: string
          id?: string
          mentor_id?: string
          session_template_id?: string
          status?: Database["public"]["Enums"]["session_booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_bookings_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "session_availabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_bookings_session_template_id_fkey"
            columns: ["session_template_id"]
            isOneToOne: false
            referencedRelation: "session_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      session_templates: {
        Row: {
          created_at: string
          description: string
          duration: number
          end_date: string
          id: string
          max_slots_per_mentor: number
          name: string
          start_date: string
          status: Database["public"]["Enums"]["session_status"] | null
          tech_stack_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: number
          end_date: string
          id?: string
          max_slots_per_mentor?: number
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["session_status"] | null
          tech_stack_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: number
          end_date?: string
          id?: string
          max_slots_per_mentor?: number
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          tech_stack_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_templates_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            isOneToOne: false
            referencedRelation: "technology_stacks"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_links: {
        Row: {
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["social_media_platform"]
          status: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["social_media_platform"]
          status?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["social_media_platform"]
          status?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          is_ready: boolean | null
          joined_at: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_ready?: boolean | null
          joined_at?: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_ready?: boolean | null
          joined_at?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          sender_id: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          sender_id: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          sender_id?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_settings: {
        Row: {
          created_at: string
          id: string
          max_team_size: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_team_size?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_team_size?: number
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          join_code: string
          leader_id: string
          max_members: number | null
          mentor_id: string | null
          name: string
          password: string | null
          repository_url: string | null
          status: Database["public"]["Enums"]["team_status"] | null
          tech_stack_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          join_code: string
          leader_id: string
          max_members?: number | null
          mentor_id?: string | null
          name: string
          password?: string | null
          repository_url?: string | null
          status?: Database["public"]["Enums"]["team_status"] | null
          tech_stack_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          join_code?: string
          leader_id?: string
          max_members?: number | null
          mentor_id?: string | null
          name?: string
          password?: string | null
          repository_url?: string | null
          status?: Database["public"]["Enums"]["team_status"] | null
          tech_stack_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            isOneToOne: false
            referencedRelation: "technology_stacks"
            referencedColumns: ["id"]
          },
        ]
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
      terms_and_conditions: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          status:
            | Database["public"]["Enums"]["terms_and_conditions_status"]
            | null
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?:
            | Database["public"]["Enums"]["terms_and_conditions_status"]
            | null
          updated_at?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?:
            | Database["public"]["Enums"]["terms_and_conditions_status"]
            | null
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_and_conditions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_mentor_to_team: {
        Args: {
          team_id: string
        }
        Returns: string
      }
      delete_session_template_cascade: {
        Args: {
          template_id_input: string
        }
        Returns: boolean
      }
      delete_team_cascade: {
        Args: {
          team_id_input: string
        }
        Returns: boolean
      }
      delete_user_cascade: {
        Args: {
          input_user_id: string
        }
        Returns: undefined
      }
      setup_mentor_data: {
        Args: {
          auth_user_id: string
          mentor_github_username?: string
          mentor_linkedin_profile_id?: string
          mentor_institution_id?: string
          mentor_bio?: string
          mentor_avatar_url?: string
          mentor_team_count?: number
          mentor_tech_stacks?: string[]
        }
        Returns: Json
      }
      update_user_password: {
        Args: {
          user_id: string
          new_password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      bulk_upload_status: "pending" | "processing" | "completed" | "failed"
      coupon_state: "unassigned" | "assigned" | "revealed"
      event_role: "mentor" | "participant" | "public"
      event_status: "draft" | "published"
      faq_status: "draft" | "published"
      institution_type: "university" | "organization"
      news_status: "draft" | "published"
      partner_status: "active" | "inactive"
      privacy_policy_status: "draft" | "published"
      profile_status: "incomplete" | "pending_approval" | "approved" | "flagged"
      session_booking_status: "pending" | "confirmed" | "cancelled"
      session_status: "active" | "inactive"
      social_media_platform:
        | "facebook"
        | "twitter"
        | "instagram"
        | "youtube"
        | "website"
        | "medium"
        | "linkedin"
      team_status: "draft" | "open" | "locked" | "pending_mentor" | "active"
      tech_stack_status: "active" | "inactive"
      terms_and_conditions_status: "draft" | "published"
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
