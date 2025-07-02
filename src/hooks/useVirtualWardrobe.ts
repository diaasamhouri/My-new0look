import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color?: string;
  brand?: string;
  size_info?: any;
  care_instructions?: string;
  image_url?: string;
  tags?: string[];
  is_adaptive_clothing: boolean;
  purchase_date?: string;
  last_worn_date?: string;
  wear_count: number;
}

interface OutfitCombination {
  id: string;
  name: string;
  occasion?: string;
  season?: string;
  weather_type?: string;
  items: any;
  notes?: string;
  is_favorite: boolean;
  last_worn_date?: string;
}

export const useVirtualWardrobe = () => {
  const { user } = useAuth();
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfitCombinations, setOutfitCombinations] = useState<OutfitCombination[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWardrobeItems = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWardrobeItems(data || []);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchOutfitCombinations = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('outfit_combinations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOutfitCombinations(data || []);
    } catch (error) {
      console.error('Error fetching outfit combinations:', error);
    }
  }, [user]);

  const addWardrobeItem = useCallback(async (item: Omit<WardrobeItem, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setWardrobeItems(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      throw error;
    }
  }, [user]);

  const updateWardrobeItem = useCallback(async (id: string, updates: Partial<WardrobeItem>) => {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setWardrobeItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (error) {
      console.error('Error updating wardrobe item:', error);
      throw error;
    }
  }, []);

  const deleteWardrobeItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWardrobeItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting wardrobe item:', error);
      throw error;
    }
  }, []);

  const createOutfitCombination = useCallback(async (outfit: Omit<OutfitCombination, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('outfit_combinations')
        .insert([{ ...outfit, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setOutfitCombinations(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating outfit combination:', error);
      throw error;
    }
  }, [user]);

  const generateSmartCombinations = useCallback((occasion?: string, season?: string) => {
    // AI-powered logic to suggest outfit combinations based on wardrobe items
    const categories = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];
    const suggestions = [];

    // Group items by category
    const itemsByCategory = wardrobeItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, WardrobeItem[]>);

    // Generate combinations based on available categories
    const tops = itemsByCategory.tops || [];
    const bottoms = itemsByCategory.bottoms || [];
    const shoes = itemsByCategory.shoes || [];

    for (let i = 0; i < Math.min(3, tops.length); i++) {
      for (let j = 0; j < Math.min(3, bottoms.length); j++) {
        for (let k = 0; k < Math.min(2, shoes.length); k++) {
          const combination = [tops[i].id, bottoms[j].id, shoes[k].id];
          
          // Add accessories if available
          if (itemsByCategory.accessories?.length) {
            combination.push(itemsByCategory.accessories[0].id);
          }

          suggestions.push({
            items: combination,
            confidence: Math.random() * 0.3 + 0.7, // Mock confidence score
            occasion: occasion || 'casual',
            season: season || 'current'
          });

          if (suggestions.length >= 5) break;
        }
        if (suggestions.length >= 5) break;
      }
      if (suggestions.length >= 5) break;
    }

    return suggestions;
  }, [wardrobeItems]);

  useEffect(() => {
    if (user) {
      fetchWardrobeItems();
      fetchOutfitCombinations();
    }
  }, [user, fetchWardrobeItems, fetchOutfitCombinations]);

  return {
    wardrobeItems,
    outfitCombinations,
    loading,
    addWardrobeItem,
    updateWardrobeItem,
    deleteWardrobeItem,
    createOutfitCombination,
    generateSmartCombinations,
    refetchItems: fetchWardrobeItems,
    refetchCombinations: fetchOutfitCombinations
  };
};