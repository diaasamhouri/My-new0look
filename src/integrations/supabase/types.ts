export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_model_performance: {
        Row: {
          created_at: string
          generation_time_ms: number | null
          id: string
          model_type: string
          model_version: string
          performance_metrics: Json
          success_rate: number | null
          user_feedback_score: number | null
        }
        Insert: {
          created_at?: string
          generation_time_ms?: number | null
          id?: string
          model_type: string
          model_version: string
          performance_metrics: Json
          success_rate?: number | null
          user_feedback_score?: number | null
        }
        Update: {
          created_at?: string
          generation_time_ms?: number | null
          id?: string
          model_type?: string
          model_version?: string
          performance_metrics?: Json
          success_rate?: number | null
          user_feedback_score?: number | null
        }
        Relationships: []
      }
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
      emotion_analytics: {
        Row: {
          created_at: string
          emotion_data: Json
          engagement_score: number | null
          id: string
          outfit_id: string
          session_id: string | null
          user_id: string | null
          viewing_duration: number | null
        }
        Insert: {
          created_at?: string
          emotion_data: Json
          engagement_score?: number | null
          id?: string
          outfit_id: string
          session_id?: string | null
          user_id?: string | null
          viewing_duration?: number | null
        }
        Update: {
          created_at?: string
          emotion_data?: Json
          engagement_score?: number | null
          id?: string
          outfit_id?: string
          session_id?: string | null
          user_id?: string | null
          viewing_duration?: number | null
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
      outfit_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          is_clicked: boolean | null
          is_saved: boolean | null
          recommendation_type: string
          recommended_outfit: Json
          source_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          is_clicked?: boolean | null
          is_saved?: boolean | null
          recommendation_type: string
          recommended_outfit: Json
          source_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          is_clicked?: boolean | null
          is_saved?: boolean | null
          recommendation_type?: string
          recommended_outfit?: Json
          source_data?: Json | null
          updated_at?: string
          user_id?: string
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
      user_similarities: {
        Row: {
          created_at: string
          id: string
          shared_preferences: Json | null
          similarity_score: number
          updated_at: string
          user_a_id: string
          user_b_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shared_preferences?: Json | null
          similarity_score?: number
          updated_at?: string
          user_a_id: string
          user_b_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shared_preferences?: Json | null
          similarity_score?: number
          updated_at?: string
          user_a_id?: string
          user_b_id?: string
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
