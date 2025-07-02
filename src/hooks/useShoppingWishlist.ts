import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface WishlistItem {
  id: string;
  item_name: string;
  brand?: string;
  price?: number;
  url?: string;
  image_url?: string;
  category?: string;
  priority: number;
  is_adaptive_clothing: boolean;
  notes?: string;
  created_at: string;
}

export const useShoppingWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistItems = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopping_wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToWishlist = useCallback(async (item: Omit<WishlistItem, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('shopping_wishlists')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setWishlistItems(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }, [user]);

  const updateWishlistItem = useCallback(async (id: string, updates: Partial<WishlistItem>) => {
    try {
      const { data, error } = await supabase
        .from('shopping_wishlists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setWishlistItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_wishlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }, []);

  const getAdaptiveClothingRecommendations = useCallback(() => {
    return wishlistItems.filter(item => item.is_adaptive_clothing);
  }, [wishlistItems]);

  const getBudgetAnalysis = useCallback(() => {
    const totalPrice = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const highPriorityItems = wishlistItems.filter(item => item.priority >= 4);
    const highPriorityTotal = highPriorityItems.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      totalWishlistValue: totalPrice,
      highPriorityValue: highPriorityTotal,
      itemCount: wishlistItems.length,
      highPriorityCount: highPriorityItems.length
    };
  }, [wishlistItems]);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
  }, [user, fetchWishlistItems]);

  return {
    wishlistItems,
    loading,
    addToWishlist,
    updateWishlistItem,
    removeFromWishlist,
    getAdaptiveClothingRecommendations,
    getBudgetAnalysis,
    refetchItems: fetchWishlistItems
  };
};