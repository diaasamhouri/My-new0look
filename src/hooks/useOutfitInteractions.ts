import { useState, useCallback } from 'react';

interface OutfitRating {
  outfitId: string;
  rating: 'like' | 'dislike';
  timestamp: number;
}

interface OutfitInteraction {
  favorites: string[];
  ratings: OutfitRating[];
  viewHistory: string[];
}

export const useOutfitInteractions = () => {
  const [interactions, setInteractions] = useState<OutfitInteraction>(() => {
    const saved = localStorage.getItem('outfitInteractions');
    return saved ? JSON.parse(saved) : {
      favorites: [],
      ratings: [],
      viewHistory: []
    };
  });

  const saveToStorage = useCallback((newInteractions: OutfitInteraction) => {
    localStorage.setItem('outfitInteractions', JSON.stringify(newInteractions));
    setInteractions(newInteractions);
  }, []);

  const toggleFavorite = useCallback((outfitId: string) => {
    const newFavorites = interactions.favorites.includes(outfitId)
      ? interactions.favorites.filter(id => id !== outfitId)
      : [...interactions.favorites, outfitId];
    
    const newInteractions = { ...interactions, favorites: newFavorites };
    saveToStorage(newInteractions);
  }, [interactions, saveToStorage]);

  const rateOutfit = useCallback((outfitId: string, rating: 'like' | 'dislike') => {
    const existingRatingIndex = interactions.ratings.findIndex(r => r.outfitId === outfitId);
    const newRating: OutfitRating = {
      outfitId,
      rating,
      timestamp: Date.now()
    };

    let newRatings;
    if (existingRatingIndex >= 0) {
      newRatings = [...interactions.ratings];
      newRatings[existingRatingIndex] = newRating;
    } else {
      newRatings = [...interactions.ratings, newRating];
    }

    const newInteractions = { ...interactions, ratings: newRatings };
    saveToStorage(newInteractions);
  }, [interactions, saveToStorage]);

  const addToViewHistory = useCallback((outfitId: string) => {
    const newViewHistory = [outfitId, ...interactions.viewHistory.filter(id => id !== outfitId)].slice(0, 50);
    const newInteractions = { ...interactions, viewHistory: newViewHistory };
    saveToStorage(newInteractions);
  }, [interactions, saveToStorage]);

  const getOutfitRating = useCallback((outfitId: string): 'like' | 'dislike' | null => {
    const rating = interactions.ratings.find(r => r.outfitId === outfitId);
    return rating ? rating.rating : null;
  }, [interactions.ratings]);

  const isFavorite = useCallback((outfitId: string): boolean => {
    return interactions.favorites.includes(outfitId);
  }, [interactions.favorites]);

  const getRecommendations = useCallback((currentOutfitId: string, allOutfits: any[]) => {
    // Simple recommendation based on liked outfits and same category
    const likedOutfits = interactions.ratings
      .filter(r => r.rating === 'like')
      .map(r => r.outfitId);

    const currentOutfit = allOutfits.find(o => o.id === currentOutfitId);
    if (!currentOutfit) return [];

    // Find outfits in the same category or similar confidence scores
    const similar = allOutfits.filter(outfit => 
      outfit.id !== currentOutfitId && (
        outfit.category === currentOutfit.category ||
        Math.abs(outfit.confidence - currentOutfit.confidence) <= 10
      )
    );

    // Sort by whether they're liked and confidence
    return similar
      .sort((a, b) => {
        const aLiked = likedOutfits.includes(a.id) ? 1 : 0;
        const bLiked = likedOutfits.includes(b.id) ? 1 : 0;
        if (aLiked !== bLiked) return bLiked - aLiked;
        return b.confidence - a.confidence;
      })
      .slice(0, 3);
  }, [interactions.ratings]);

  return {
    interactions,
    toggleFavorite,
    rateOutfit,
    addToViewHistory,
    getOutfitRating,
    isFavorite,
    getRecommendations
  };
};