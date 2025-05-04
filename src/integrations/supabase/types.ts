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
      activity_responses: {
        Row: {
          ar_activity_id: string
          ar_phase_id: string
          ar_project_id: string
          ar_response: Json
          ar_step_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          ar_activity_id: string
          ar_phase_id: string
          ar_project_id: string
          ar_response?: Json
          ar_step_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          ar_activity_id?: string
          ar_phase_id?: string
          ar_project_id?: string
          ar_response?: Json
          ar_step_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_responses_project_id_fkey"
            columns: ["ar_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          prompt_key: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          prompt_key: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          prompt_key?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      dashboard_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          project_id: string
          revoked_at: string | null
          show_pattern_insights: boolean
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          project_id: string
          revoked_at?: string | null
          show_pattern_insights?: boolean
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          project_id?: string
          revoked_at?: string | null
          show_pattern_insights?: boolean
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      form_identifiers: {
        Row: {
          created_at: string
          fi_project_id: string
          form_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fi_project_id: string
          form_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fi_project_id?: string
          form_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_identifiers_project_id_fkey"
            columns: ["fi_project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_responses: {
        Row: {
          created_at: string
          id: string
          pr_project_id: string | null
          question_id: string
          question_text: string
          response: string
          story_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pr_project_id?: string | null
          question_id: string
          question_text: string
          response: string
          story_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pr_project_id?: string | null
          question_id?: string
          question_text?: string
          response?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_responses_project_id_fkey"
            columns: ["pr_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_responses_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_provider: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          ai_provider?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          ai_provider?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_template: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_template?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_template?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      slider_responses: {
        Row: {
          created_at: string
          id: string
          left_label: string | null
          question_id: number
          question_text: string
          response_type: string
          right_label: string | null
          sr_project_id: string | null
          story_id: string
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          left_label?: string | null
          question_id: number
          question_text: string
          response_type?: string
          right_label?: string | null
          sr_project_id?: string | null
          story_id: string
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          left_label?: string | null
          question_id?: number
          question_text?: string
          response_type?: string
          right_label?: string | null
          sr_project_id?: string | null
          story_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "slider_responses_project_id_fkey"
            columns: ["sr_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slider_responses_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          additional_comments: string | null
          audio_url: string | null
          created_at: string
          emotional_response: string | null
          has_audio: boolean | null
          id: string
          is_imported: boolean
          is_public: boolean
          st_project_id: string | null
          text: string
          title: string
          user_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          audio_url?: string | null
          created_at?: string
          emotional_response?: string | null
          has_audio?: boolean | null
          id?: string
          is_imported?: boolean
          is_public?: boolean
          st_project_id?: string | null
          text: string
          title: string
          user_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          audio_url?: string | null
          created_at?: string
          emotional_response?: string | null
          has_audio?: boolean | null
          id?: string
          is_imported?: boolean
          is_public?: boolean
          st_project_id?: string | null
          text?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_project_id_fkey"
            columns: ["st_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      upgrade_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          is_used: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      user_role_expirations: {
        Row: {
          code_id: string
          created_at: string | null
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          code_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          code_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_expirations_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "upgrade_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_story: {
        Args: { story_id_param: string }
        Returns: boolean
      }
      delete_story_responses: {
        Args: { story_id_param: string; table_name: string }
        Returns: boolean
      }
      delete_story_with_responses: {
        Args: { story_id_param: string }
        Returns: Json
      }
      ensure_template_project: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fetch_activity_response: {
        Args: {
          project_id: string
          phase_id: string
          step_id: string
          activity_id: string
        }
        Returns: Json
      }
      get_project_existence: {
        Args: { project_id: string }
        Returns: boolean
      }
      get_project_id_by_form_id: {
        Args: { p_form_id: string }
        Returns: string
      }
      get_user_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
        }[]
      }
      get_user_roles: {
        Args: { user_id: string }
        Returns: {
          role_name: string
        }[]
      }
      handle_expired_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_public_form_id: {
        Args: { project_id: string }
        Returns: boolean
      }
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      insert_activity_response: {
        Args: {
          project_id: string
          phase_id: string
          step_id: string
          activity_id: string
          response_data: Json
          updated_at?: string
        }
        Returns: Json
      }
      is_valid_public_token: {
        Args: { project_id: string }
        Returns: boolean
      }
      redeem_upgrade_code: {
        Args: { code_text: string }
        Returns: Json
      }
      validate_dashboard_token: {
        Args: { token_value: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "user" | "admin" | "superuser" | "superadmin" | "demo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin", "superuser", "superadmin", "demo"],
    },
  },
} as const
