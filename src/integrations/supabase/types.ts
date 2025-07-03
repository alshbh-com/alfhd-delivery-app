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
      allowed_cities: {
        Row: {
          created_at: string | null
          delivery_price: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          delivery_price?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          delivery_price?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      group_orders: {
        Row: {
          created_at: string
          creator_user_id: string
          current_amount: number | null
          expires_at: string | null
          id: string
          name: string
          participants: Json | null
          status: string | null
          sub_category_id: string | null
          target_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_user_id: string
          current_amount?: number | null
          expires_at?: string | null
          id?: string
          name: string
          participants?: Json | null
          status?: string | null
          sub_category_id?: string | null
          target_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_user_id?: string
          current_amount?: number | null
          expires_at?: string | null
          id?: string
          name?: string
          participants?: Json | null
          status?: string | null
          sub_category_id?: string | null
          target_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_orders_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          level: string
          points: number
          total_orders: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          total_orders?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          total_orders?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      main_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_city: string
          customer_location: string | null
          customer_name: string
          customer_phone: string
          delivery_fee: number
          id: string
          items: Json
          status: string | null
          sub_category_id: string | null
          total_amount: number
          whatsapp_sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          customer_city: string
          customer_location?: string | null
          customer_name: string
          customer_phone: string
          delivery_fee: number
          id?: string
          items: Json
          status?: string | null
          sub_category_id?: string | null
          total_amount: number
          whatsapp_sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          customer_city?: string
          customer_location?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number
          id?: string
          items?: Json
          status?: string | null
          sub_category_id?: string | null
          total_amount?: number
          whatsapp_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      points_history: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: Json | null
          average_rating: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          nutritional_info: Json | null
          price: number
          review_count: number | null
          sort_order: number | null
          sub_category_id: string | null
          tags: Json | null
        }
        Insert: {
          allergens?: Json | null
          average_rating?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          nutritional_info?: Json | null
          price: number
          review_count?: number | null
          sort_order?: number | null
          sub_category_id?: string | null
          tags?: Json | null
        }
        Update: {
          allergens?: Json | null
          average_rating?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          nutritional_info?: Json | null
          price?: number
          review_count?: number | null
          sort_order?: number | null
          sub_category_id?: string | null
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          images: Json | null
          product_id: string | null
          rating: number
          sub_category_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          product_id?: string | null
          rating: number
          sub_category_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          product_id?: string | null
          rating?: number
          sub_category_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          average_rating: number | null
          created_at: string | null
          cuisine_type: string | null
          delivery_fee: number | null
          delivery_time_max: number | null
          delivery_time_min: number | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_open: boolean | null
          main_category_id: string | null
          minimum_order: number | null
          name: string
          payment_methods: Json | null
          review_count: number | null
          sort_order: number | null
          whatsapp_number: string | null
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_open?: boolean | null
          main_category_id?: string | null
          minimum_order?: number | null
          name: string
          payment_methods?: Json | null
          review_count?: number | null
          sort_order?: number | null
          whatsapp_number?: string | null
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_open?: boolean | null
          main_category_id?: string | null
          minimum_order?: number | null
          name?: string
          payment_methods?: Json | null
          review_count?: number | null
          sort_order?: number | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_main_category_id_fkey"
            columns: ["main_category_id"]
            isOneToOne: false
            referencedRelation: "main_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_user_id: string
          following_user_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_user_id: string
          following_user_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_user_id?: string
          following_user_id?: string
          id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dietary_preferences: Json | null
          favorite_categories: Json | null
          favorite_products: Json | null
          favorite_sub_categories: Json | null
          id: string
          price_range: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_preferences?: Json | null
          favorite_categories?: Json | null
          favorite_products?: Json | null
          favorite_sub_categories?: Json | null
          id?: string
          price_range?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_preferences?: Json | null
          favorite_categories?: Json | null
          favorite_products?: Json | null
          favorite_sub_categories?: Json | null
          id?: string
          price_range?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          is_public: boolean | null
          items: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          items?: Json | null
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          items?: Json | null
          name?: string
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
