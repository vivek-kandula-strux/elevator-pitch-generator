export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      circuit_breaker_state: {
        Row: {
          created_at: string
          failure_count: number
          failure_threshold: number
          id: string
          last_failure_at: string | null
          last_success_at: string | null
          recovery_timeout_minutes: number
          service_name: string
          state: string
          success_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          failure_count?: number
          failure_threshold?: number
          id?: string
          last_failure_at?: string | null
          last_success_at?: string | null
          recovery_timeout_minutes?: number
          service_name: string
          state?: string
          success_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          failure_count?: number
          failure_threshold?: number
          id?: string
          last_failure_at?: string | null
          last_success_at?: string | null
          recovery_timeout_minutes?: number
          service_name?: string
          state?: string
          success_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      elevator_pitches: {
        Row: {
          access_token: string
          category: string
          company: string
          created_at: string
          generated_pitch: string | null
          id: string
          name: string
          specific_ask: string
          updated_at: string
          usp: string
          whatsapp: string
        }
        Insert: {
          access_token?: string
          category: string
          company: string
          created_at?: string
          generated_pitch?: string | null
          id?: string
          name: string
          specific_ask: string
          updated_at?: string
          usp: string
          whatsapp: string
        }
        Update: {
          access_token?: string
          category?: string
          company?: string
          created_at?: string
          generated_pitch?: string | null
          id?: string
          name?: string
          specific_ask?: string
          updated_at?: string
          usp?: string
          whatsapp?: string
        }
        Relationships: []
      }
      job_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_type: string
          max_retries: number
          payload: Json
          priority: number
          retry_count: number
          scheduled_at: string
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type: string
          max_retries?: number
          payload: Json
          priority?: number
          retry_count?: number
          scheduled_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type?: string
          max_retries?: number
          payload?: Json
          priority?: number
          retry_count?: number
          scheduled_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          service_name: string
          timestamp: string
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          service_name: string
          timestamp?: string
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          service_name?: string
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          id: string
          key: string
          max_requests: number
          request_count: number
          updated_at: string
          window_duration_minutes: number
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          max_requests?: number
          request_count?: number
          updated_at?: string
          window_duration_minutes?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          max_requests?: number
          request_count?: number
          updated_at?: string
          window_duration_minutes?: number
          window_start?: string
        }
        Relationships: []
      }
      requirements: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          service_type: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          service_type: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          service_type?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      sync_metadata: {
        Row: {
          created_at: string
          error_details: Json | null
          id: string
          last_sync_row_count: number
          last_sync_timestamp: string
          sync_status: string
          sync_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          id?: string
          last_sync_row_count?: number
          last_sync_timestamp?: string
          sync_status?: string
          sync_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          id?: string
          last_sync_row_count?: number
          last_sync_timestamp?: string
          sync_status?: string
          sync_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_record_tracking: {
        Row: {
          created_at: string
          id: string
          record_id: string
          record_timestamp: string
          sync_type: string
          synced_at: string
          table_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          record_id: string
          record_timestamp: string
          sync_type: string
          synced_at?: string
          table_name: string
        }
        Update: {
          created_at?: string
          id?: string
          record_id?: string
          record_timestamp?: string
          sync_type?: string
          synced_at?: string
          table_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_performance_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_elevator_pitch_by_token: {
        Args: { pitch_id: string; provided_token: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
