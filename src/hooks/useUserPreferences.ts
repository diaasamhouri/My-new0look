import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserPreferences {
  preferred_colors: string[];
  preferred_styles: string[];
  body_measurements: Record<string, any>;
  style_personality: Record<string, any>;
  accessibility_settings: Record<string, any>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferred_colors: [],
  preferred_styles: [],
  body_measurements: {},
  style_personality: {},
  accessibility_settings: {}
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          preferred_colors: (data.preferred_colors as string[]) || [],
          preferred_styles: (data.preferred_styles as string[]) || [],
          body_measurements: (data.body_measurements as Record<string, any>) || {},
          style_personality: (data.style_personality as Record<string, any>) || {},
          accessibility_settings: (data.accessibility_settings as Record<string, any>) || {}
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) {
        console.error('Error updating preferences:', error);
        // Revert on error
        setPreferences(preferences);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setPreferences(preferences);
    }
  }, [user, preferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    updatePreferences,
    loading
  };
};