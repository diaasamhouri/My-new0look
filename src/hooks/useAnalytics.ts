import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  interaction_type: 'generated' | 'liked' | 'disliked' | 'shared' | 'saved' | 'viewed';
  outfit_data: any;
  confidence_score?: number;
  style_category?: string;
  color_palette?: string[];
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    if (!user) {
      // Store in localStorage for anonymous users
      const anonymousEvents = JSON.parse(localStorage.getItem('anonymous_analytics') || '[]');
      anonymousEvents.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('anonymous_analytics', JSON.stringify(anonymousEvents.slice(-100))); // Keep last 100 events
      return;
    }

    try {
      const { error } = await supabase
        .from('outfit_analytics')
        .insert({
          user_id: user.id,
          outfit_data: event.outfit_data,
          interaction_type: event.interaction_type,
          confidence_score: event.confidence_score,
          style_category: event.style_category,
          color_palette: event.color_palette
        });

      if (error) {
        console.error('Error tracking analytics:', error);
      }
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  }, [user]);

  const getAnalytics = useCallback(async (timeframe: 'week' | 'month' | 'all' = 'month') => {
    if (!user) return [];

    try {
      let query = supabase
        .from('outfit_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (timeframe !== 'all') {
        const days = timeframe === 'week' ? 7 : 30;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        query = query.gte('timestamp', fromDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }, [user]);

  const getStyleInsights = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('outfit_analytics')
        .select('style_category, color_palette, confidence_score, interaction_type')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching insights:', error);
        return null;
      }

      // Analyze the data
      const styleFrequency: Record<string, number> = {};
      const colorFrequency: Record<string, number> = {};
      const likedStyles: string[] = [];
      let totalConfidence = 0;
      let totalItems = 0;

      data?.forEach(item => {
        if (item.style_category) {
          styleFrequency[item.style_category] = (styleFrequency[item.style_category] || 0) + 1;
          if (item.interaction_type === 'liked') {
            likedStyles.push(item.style_category);
          }
        }

        if (item.color_palette && Array.isArray(item.color_palette)) {
          item.color_palette.forEach((color: string) => {
            colorFrequency[color] = (colorFrequency[color] || 0) + 1;
          });
        }

        if (item.confidence_score) {
          totalConfidence += item.confidence_score;
          totalItems++;
        }
      });

      return {
        mostViewedStyles: Object.entries(styleFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([style, count]) => ({ style, count })),
        favoriteColors: Object.entries(colorFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 8)
          .map(([color, count]) => ({ color, count })),
        averageConfidence: totalItems > 0 ? totalConfidence / totalItems : 0,
        totalOutfits: data?.length || 0,
        likedStylesCount: likedStyles.length
      };
    } catch (error) {
      console.error('Error getting style insights:', error);
      return null;
    }
  }, [user]);

  return {
    trackEvent,
    getAnalytics,
    getStyleInsights
  };
};