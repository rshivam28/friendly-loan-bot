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
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_bot: boolean
          message: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_bot: boolean
          message: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_bot?: boolean
          message?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          city: string | null
          company_name: string | null
          completed: boolean | null
          created_at: string
          date_of_birth: string | null
          email_otp: string | null
          email_verified: boolean | null
          employment_type: string | null
          gender: string | null
          id: string
          interest_rate: number | null
          loan_amount: number | null
          loan_status: string | null
          loan_tenure: number | null
          monthly_emi: number | null
          monthly_salary: number | null
          name: string | null
          office_address_line1: string | null
          office_address_line2: string | null
          office_city: string | null
          office_email: string | null
          office_pincode: string | null
          office_state: string | null
          pan_card: string | null
          payslip_url: string | null
          pin_code: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          completed?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          email_otp?: string | null
          email_verified?: boolean | null
          employment_type?: string | null
          gender?: string | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number | null
          loan_status?: string | null
          loan_tenure?: number | null
          monthly_emi?: number | null
          monthly_salary?: number | null
          name?: string | null
          office_address_line1?: string | null
          office_address_line2?: string | null
          office_city?: string | null
          office_email?: string | null
          office_pincode?: string | null
          office_state?: string | null
          pan_card?: string | null
          payslip_url?: string | null
          pin_code?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          completed?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          email_otp?: string | null
          email_verified?: boolean | null
          employment_type?: string | null
          gender?: string | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number | null
          loan_status?: string | null
          loan_tenure?: number | null
          monthly_emi?: number | null
          monthly_salary?: number | null
          name?: string | null
          office_address_line1?: string | null
          office_address_line2?: string | null
          office_city?: string | null
          office_email?: string | null
          office_pincode?: string | null
          office_state?: string | null
          pan_card?: string | null
          payslip_url?: string | null
          pin_code?: string | null
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
      [_ in never]: never
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
