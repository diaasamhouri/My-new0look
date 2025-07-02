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
      challenge_participations: {
        Row: {
          challenge_id: string
          description: string | null
          id: string
          outfit_image_url: string | null
          submission_date: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          description?: string | null
          id?: string
          outfit_image_url?: string | null
          submission_date?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          description?: string | null
          id?: string
          outfit_image_url?: string | null
          submission_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "style_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          id: string
          images: string[] | null
          is_anonymous: boolean | null
          likes_count: number | null
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outfit_analytics: {
        Row: {
          color_palette: Json | null
          confidence_score: number | null
          id: string
          interaction_type: string
          outfit_data: Json
          style_category: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          color_palette?: Json | null
          confidence_score?: number | null
          id?: string
          interaction_type: string
          outfit_data: Json
          style_category?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          color_palette?: Json | null
          confidence_score?: number | null
          id?: string
          interaction_type?: string
          outfit_data?: Json
          style_category?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      outfit_combinations: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          items: Json
          last_worn_date: string | null
          name: string
          notes: string | null
          occasion: string | null
          season: string | null
          updated_at: string
          user_id: string
          weather_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          items: Json
          last_worn_date?: string | null
          name: string
          notes?: string | null
          occasion?: string | null
          season?: string | null
          updated_at?: string
          user_id: string
          weather_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          items?: Json
          last_worn_date?: string | null
          name?: string
          notes?: string | null
          occasion?: string | null
          season?: string | null
          updated_at?: string
          user_id?: string
          weather_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_outfits: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          name: string | null
          outfit_data: Json
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string | null
          outfit_data: Json
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string | null
          outfit_data?: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_wishlists: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          is_adaptive_clothing: boolean | null
          item_name: string
          notes: string | null
          price: number | null
          priority: number | null
          url: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_adaptive_clothing?: boolean | null
          item_name: string
          notes?: string | null
          price?: number | null
          priority?: number | null
          url?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_adaptive_clothing?: boolean | null
          item_name?: string
          notes?: string | null
          price?: number | null
          priority?: number | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      style_challenges: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          participants_count: number | null
          start_date: string
          theme: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          participants_count?: number | null
          start_date: string
          theme: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          participants_count?: number | null
          start_date?: string
          theme?: string
          title?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accessibility_settings: Json | null
          body_measurements: Json | null
          created_at: string
          id: string
          preferred_colors: Json | null
          preferred_styles: Json | null
          style_personality: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          body_measurements?: Json | null
          created_at?: string
          id?: string
          preferred_colors?: Json | null
          preferred_styles?: Json | null
          style_personality?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          body_measurements?: Json | null
          created_at?: string
          id?: string
          preferred_colors?: Json | null
          preferred_styles?: Json | null
          style_personality?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          brand: string | null
          care_instructions: string | null
          category: string
          color: string | null
          created_at: string
          id: string
          image_url: string | null
          is_adaptive_clothing: boolean | null
          last_worn_date: string | null
          name: string
          purchase_date: string | null
          size_info: Json | null
          tags: string[] | null
          updated_at: string
          user_id: string
          wear_count: number | null
        }
        Insert: {
          brand?: string | null
          care_instructions?: string | null
          category: string
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_adaptive_clothing?: boolean | null
          last_worn_date?: string | null
          name: string
          purchase_date?: string | null
          size_info?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          wear_count?: number | null
        }
        Update: {
          brand?: string | null
          care_instructions?: string | null
          category?: string
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_adaptive_clothing?: boolean | null
          last_worn_date?: string | null
          name?: string
          purchase_date?: string | null
          size_info?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          wear_count?: number | null
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
