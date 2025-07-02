-- Create wardrobe items table
CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear'
  color TEXT,
  brand TEXT,
  size_info JSONB,
  care_instructions TEXT,
  image_url TEXT,
  tags TEXT[],
  is_adaptive_clothing BOOLEAN DEFAULT false,
  purchase_date DATE,
  last_worn_date DATE,
  wear_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create outfit combinations table
CREATE TABLE public.outfit_combinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  occasion TEXT, -- 'work', 'casual', 'formal', 'special_event'
  season TEXT, -- 'spring', 'summer', 'fall', 'winter'
  weather_type TEXT, -- 'sunny', 'rainy', 'cold', 'hot'
  items JSONB NOT NULL, -- array of wardrobe_item ids
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  last_worn_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  images TEXT[],
  tags TEXT[],
  post_type TEXT NOT NULL, -- 'transformation', 'inspiration', 'challenge', 'story'
  is_anonymous BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community comments table
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community likes table
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create style challenges table
CREATE TABLE public.style_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  theme TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image_url TEXT,
  participants_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge participations table
CREATE TABLE public.challenge_participations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.style_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_image_url TEXT,
  description TEXT,
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create shopping wishlists table
CREATE TABLE public.shopping_wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10,2),
  url TEXT,
  image_url TEXT,
  category TEXT,
  priority INTEGER DEFAULT 1, -- 1-5 scale
  is_adaptive_clothing BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for wardrobe items
CREATE POLICY "Users can manage their own wardrobe items" ON public.wardrobe_items FOR ALL USING (auth.uid() = user_id);

-- Create policies for outfit combinations
CREATE POLICY "Users can manage their own outfit combinations" ON public.outfit_combinations FOR ALL USING (auth.uid() = user_id);

-- Create policies for community posts
CREATE POLICY "Users can view all community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Create policies for community comments
CREATE POLICY "Users can view all comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Create policies for community likes
CREATE POLICY "Users can view all likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON public.community_likes FOR ALL USING (auth.uid() = user_id);

-- Create policies for style challenges
CREATE POLICY "Users can view all challenges" ON public.style_challenges FOR SELECT USING (true);

-- Create policies for challenge participations
CREATE POLICY "Users can view all participations" ON public.challenge_participations FOR SELECT USING (true);
CREATE POLICY "Users can manage their own participations" ON public.challenge_participations FOR ALL USING (auth.uid() = user_id);

-- Create policies for shopping wishlists
CREATE POLICY "Users can manage their own wishlist items" ON public.shopping_wishlists FOR ALL USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_wardrobe_items_updated_at
  BEFORE UPDATE ON public.wardrobe_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outfit_combinations_updated_at
  BEFORE UPDATE ON public.outfit_combinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_category ON public.wardrobe_items(category);
CREATE INDEX idx_outfit_combinations_user_id ON public.outfit_combinations(user_id);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_posts_post_type ON public.community_posts(post_type);
CREATE INDEX idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX idx_challenge_participations_challenge_id ON public.challenge_participations(challenge_id);

-- Insert some sample style challenges
INSERT INTO public.style_challenges (title, description, theme, start_date, end_date) VALUES
('Adaptive Elegance Challenge', 'Show how adaptive clothing can be elegant and stylish', 'Adaptive Fashion', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
('Confidence Color Challenge', 'Style yourself in colors that make you feel confident', 'Color Psychology', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '37 days'),
('Seasonal Transition Challenge', 'Create outfits perfect for the changing season', 'Seasonal Style', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '44 days');