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
      branches: {
        Row: {
          address: string | null
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      mission_roles: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      permission_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: number
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: number
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: number
          name: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description: string
          id?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          granted_at: string | null
          id: number
          permission_id: number
          role_id: number
        }
        Insert: {
          granted_at?: string | null
          id?: number
          permission_id: number
          role_id: number
        }
        Update: {
          granted_at?: string | null
          id?: number
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: number
          setting_key: string
          setting_type: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          setting_key: string
          setting_type?: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          setting_key?: string
          setting_type?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          branch: string
          company: string
          created_at: string
          driver: string
          end_km: number | null
          id: number
          notes: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          start_km: number | null
          status: string | null
          user_ids: string[] | null
          user_roles: Json | null
          van: string
        }
        Insert: {
          branch: string
          company: string
          created_at?: string
          driver: string
          end_km?: number | null
          id?: number
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          start_km?: number | null
          status?: string | null
          user_ids?: string[] | null
          user_roles?: Json | null
          van: string
        }
        Update: {
          branch?: string
          company?: string
          created_at?: string
          driver?: string
          end_km?: number | null
          id?: number
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          start_km?: number | null
          status?: string | null
          user_ids?: string[] | null
          user_roles?: Json | null
          van?: string
        }
        Relationships: []
      }
      user_groups: {
        Row: {
          color: string
          description: string
          id: string
          name: string
          permissions: string[] | null
          role_id: number | null
        }
        Insert: {
          color: string
          description: string
          id: string
          name: string
          permissions?: string[] | null
          role_id?: number | null
        }
        Update: {
          color?: string
          description?: string
          id?: string
          name?: string
          permissions?: string[] | null
          role_id?: number | null
        }
        Relationships: []
      }
      user_mission_roles: {
        Row: {
          assigned_at: string
          id: string
          mission_role_id: string
          user_id: number
        }
        Insert: {
          assigned_at?: string
          id?: string
          mission_role_id: string
          user_id: number
        }
        Update: {
          assigned_at?: string
          id?: string
          mission_role_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_roles_mission_role_id_fkey"
            columns: ["mission_role_id"]
            isOneToOne: false
            referencedRelation: "mission_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mission_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          auth_user_id: string | null
          badge_number: string | null
          blood_type: string | null
          carte_national: string | null
          carte_national_expiry_date: string | null
          carte_national_start_date: string | null
          company_assignment_date: string | null
          created_at: string
          date_of_birth: string | null
          driver_license: string | null
          driver_license_category: string[] | null
          driver_license_category_dates: Json | null
          driver_license_expiry_date: string | null
          driver_license_start_date: string | null
          email: string | null
          id: number
          identification_national: string | null
          last_trip: string | null
          name: string
          phone: string | null
          place_of_birth: string | null
          profile_image: string | null
          role_id: number | null
          status: string
          total_trips: number | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          badge_number?: string | null
          blood_type?: string | null
          carte_national?: string | null
          carte_national_expiry_date?: string | null
          carte_national_start_date?: string | null
          company_assignment_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license?: string | null
          driver_license_category?: string[] | null
          driver_license_category_dates?: Json | null
          driver_license_expiry_date?: string | null
          driver_license_start_date?: string | null
          email?: string | null
          id?: number
          identification_national?: string | null
          last_trip?: string | null
          name: string
          phone?: string | null
          place_of_birth?: string | null
          profile_image?: string | null
          role_id?: number | null
          status: string
          total_trips?: number | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          badge_number?: string | null
          blood_type?: string | null
          carte_national?: string | null
          carte_national_expiry_date?: string | null
          carte_national_start_date?: string | null
          company_assignment_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license?: string | null
          driver_license_category?: string[] | null
          driver_license_category_dates?: Json | null
          driver_license_expiry_date?: string | null
          driver_license_start_date?: string | null
          email?: string | null
          id?: number
          identification_national?: string | null
          last_trip?: string | null
          name?: string
          phone?: string | null
          place_of_birth?: string | null
          profile_image?: string | null
          role_id?: number | null
          status?: string
          total_trips?: number | null
        }
        Relationships: []
      }
      van_logs: {
        Row: {
          category: string
          cost: number | null
          created_at: string
          created_by: string | null
          date: string
          details: string | null
          id: string
          next_due_date: string | null
          next_due_km: number | null
          odometer_km: number | null
          performed_by: string | null
          title: string
          van_id: string
        }
        Insert: {
          category: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          date: string
          details?: string | null
          id?: string
          next_due_date?: string | null
          next_due_km?: number | null
          odometer_km?: number | null
          performed_by?: string | null
          title: string
          van_id: string
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          date?: string
          details?: string | null
          id?: string
          next_due_date?: string | null
          next_due_km?: number | null
          odometer_km?: number | null
          performed_by?: string | null
          title?: string
          van_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "van_logs_van_id_fkey"
            columns: ["van_id"]
            isOneToOne: false
            referencedRelation: "vans"
            referencedColumns: ["id"]
          },
        ]
      }
      vans: {
        Row: {
          control_date: string | null
          created_at: string
          current_location: string | null
          current_odometer_km: number | null
          current_responsible_id: number | null
          driver_id: string | null
          id: string
          insurance_date: string | null
          insurer: string | null
          license_plate: string | null
          model: string
          notes: string | null
          reference_code: string
          status: string | null
        }
        Insert: {
          control_date?: string | null
          created_at?: string
          current_location?: string | null
          current_odometer_km?: number | null
          current_responsible_id?: number | null
          driver_id?: string | null
          id?: string
          insurance_date?: string | null
          insurer?: string | null
          license_plate?: string | null
          model: string
          notes?: string | null
          reference_code: string
          status?: string | null
        }
        Update: {
          control_date?: string | null
          created_at?: string
          current_location?: string | null
          current_odometer_km?: number | null
          current_responsible_id?: number | null
          driver_id?: string | null
          id?: string
          insurance_date?: string | null
          insurer?: string | null
          license_plate?: string | null
          model?: string
          notes?: string | null
          reference_code?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vans_current_responsible_id_fkey"
            columns: ["current_responsible_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_assign_permission_to_role: {
        Args: { p_role_id: number; p_permission_name: string }
        Returns: boolean
      }
      admin_create_role: {
        Args: {
          p_name: string
          p_description: string
          p_color?: string
          p_permissions?: string[]
        }
        Returns: {
          id: string
          name: string
          description: string
          color: string
          role_id: number
          permissions: string[]
        }[]
      }
      admin_remove_permission_from_role: {
        Args: { p_role_id: number; p_permission_name: string }
        Returns: boolean
      }
      admin_update_role: {
        Args: {
          p_role_id: string
          p_name?: string
          p_description?: string
          p_color?: string
          p_permissions?: string[]
        }
        Returns: boolean
      }
      current_user_can_create_companies: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_create_trips: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_create_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_create_vans: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_delete_companies: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_delete_trips: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_delete_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_delete_vans: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_read_companies: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_read_trips: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_read_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_read_vans: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_update_companies: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_update_trips: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_update_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_can_update_vans: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_current_user_rbac: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          auth_user_id: string | null
          badge_number: string | null
          blood_type: string | null
          carte_national: string | null
          carte_national_expiry_date: string | null
          carte_national_start_date: string | null
          company_assignment_date: string | null
          created_at: string
          date_of_birth: string | null
          driver_license: string | null
          driver_license_category: string[] | null
          driver_license_category_dates: Json | null
          driver_license_expiry_date: string | null
          driver_license_start_date: string | null
          email: string | null
          id: number
          identification_national: string | null
          last_trip: string | null
          name: string
          phone: string | null
          place_of_birth: string | null
          profile_image: string | null
          role_id: number | null
          status: string
          total_trips: number | null
        }
      }
      log_permission_change: {
        Args: {
          p_action: string
          p_target_type: string
          p_target_id: string
          p_details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
