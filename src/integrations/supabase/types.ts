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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          available_count: number
          date: string
          id: string
          room_id: string
        }
        Insert: {
          available_count?: number
          date: string
          id?: string
          room_id: string
        }
        Update: {
          available_count?: number
          date?: string
          id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          acessibilidade: boolean | null
          avaliacao_media: number | null
          cidade: string
          comodidades: string[] | null
          criado_em: string
          descricao: string | null
          endereco: string
          fotos: string[] | null
          id: string
          nome: string
          sustentavel: boolean | null
        }
        Insert: {
          acessibilidade?: boolean | null
          avaliacao_media?: number | null
          cidade?: string
          comodidades?: string[] | null
          criado_em?: string
          descricao?: string | null
          endereco: string
          fotos?: string[] | null
          id?: string
          nome: string
          sustentavel?: boolean | null
        }
        Update: {
          acessibilidade?: boolean | null
          avaliacao_media?: number | null
          cidade?: string
          comodidades?: string[] | null
          criado_em?: string
          descricao?: string | null
          endereco?: string
          fotos?: string[] | null
          id?: string
          nome?: string
          sustentavel?: boolean | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          criado_em: string
          id: string
          provider_response: Json | null
          reservation_id: string
          status: string
          transacao_id: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          provider_response?: Json | null
          reservation_id: string
          status?: string
          transacao_id?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          provider_response?: Json | null
          reservation_id?: string
          status?: string
          transacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          telefone: string | null
          two_fa_secret: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id: string
          nome: string
          telefone?: string | null
          two_fa_secret?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          telefone?: string | null
          two_fa_secret?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_fim: string
          data_inicio: string
          id: string
          noites: number
          room_id: string
          status: string
          taxa_limpeza: number
          user_id: string
          valor_total: number
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_fim: string
          data_inicio: string
          id?: string
          noites: number
          room_id: string
          status?: string
          taxa_limpeza?: number
          user_id: string
          valor_total: number
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          noites?: number
          room_id?: string
          status?: string
          taxa_limpeza?: number
          user_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comentario: string | null
          criado_em: string
          hostel_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comentario?: string | null
          criado_em?: string
          hostel_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comentario?: string | null
          criado_em?: string
          hostel_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacidade: number
          criado_em: string
          descricao: string | null
          hostel_id: string
          id: string
          tarifa_noite: number
          taxa_limpeza: number | null
          tipo: string
          tipo_cama: string | null
        }
        Insert: {
          capacidade: number
          criado_em?: string
          descricao?: string | null
          hostel_id: string
          id?: string
          tarifa_noite: number
          taxa_limpeza?: number | null
          tipo: string
          tipo_cama?: string | null
        }
        Update: {
          capacidade?: number
          criado_em?: string
          descricao?: string | null
          hostel_id?: string
          id?: string
          tarifa_noite?: number
          taxa_limpeza?: number | null
          tipo?: string
          tipo_cama?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
