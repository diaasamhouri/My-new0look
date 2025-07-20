-- Create table for user similarity and collaborative filtering
CREATE TABLE public.user_similarities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a_id UUID NOT NULL,
  user_b_id UUID NOT NULL,
  similarity_score NUMERIC(3,2) NOT NULL DEFAULT 0.0,
  shared_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_a_id, user_b_id)
);

-- Create table for emotion tracking during outfit viewing
CREATE TABLE public.emotion_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  outfit_id TEXT NOT NULL,
  emotion_data JSONB NOT NULL,
  viewing_duration INTEGER DEFAULT 0,
  engagement_score NUMERIC(3,2) DEFAULT 0.0,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for outfit recommendations
CREATE TABLE public.outfit_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommended_outfit JSONB NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'similar_users', 'style_based', 'emotion_based'
  confidence_score NUMERIC(3,2) DEFAULT 0.0,
  source_data JSONB DEFAULT '{}',
  is_clicked BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI model performance tracking
CREATE TABLE public.ai_model_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type TEXT NOT NULL, -- 'image_generation', 'recommendation', 'emotion_analysis'
  model_version TEXT NOT NULL,
  performance_metrics JSONB NOT NULL,
  user_feedback_score NUMERIC(3,2),
  generation_time_ms INTEGER,
  success_rate NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_similarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_similarities
CREATE POLICY "Users can view their own similarities" 
ON public.user_similarities 
FOR SELECT 
USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "System can manage similarities" 
ON public.user_similarities 
FOR ALL 
USING (true);

-- Create RLS policies for emotion_analytics
CREATE POLICY "Users can manage their own emotion data" 
ON public.emotion_analytics 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for outfit_recommendations
CREATE POLICY "Users can manage their own recommendations" 
ON public.outfit_recommendations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for ai_model_performance (admin only for now)
CREATE POLICY "Allow read access to AI performance" 
ON public.ai_model_performance 
FOR SELECT 
USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_similarities_updated_at
BEFORE UPDATE ON public.user_similarities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outfit_recommendations_updated_at
BEFORE UPDATE ON public.outfit_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_similarities_user_a ON public.user_similarities(user_a_id);
CREATE INDEX idx_user_similarities_user_b ON public.user_similarities(user_b_id);
CREATE INDEX idx_emotion_analytics_user_id ON public.emotion_analytics(user_id);
CREATE INDEX idx_emotion_analytics_outfit_id ON public.emotion_analytics(outfit_id);
CREATE INDEX idx_outfit_recommendations_user_id ON public.outfit_recommendations(user_id);
CREATE INDEX idx_outfit_recommendations_type ON public.outfit_recommendations(recommendation_type);
CREATE INDEX idx_ai_model_performance_type ON public.ai_model_performance(model_type);