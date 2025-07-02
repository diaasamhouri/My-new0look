import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share, Heart, Sparkles, RotateCcw, MessageCircle, Info, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OutfitDetailsModal } from "@/components/results/OutfitDetailsModal";
import { OutfitFilters } from "@/components/results/OutfitFilters";
import { SocialSharing } from "@/components/results/SocialSharing";
import { useOutfitInteractions } from "@/hooks/useOutfitInteractions";

interface Outfit {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
  confidence: number;
}

interface ResultsScreenProps {
  outfits: Outfit[];
  onRestart: () => void;
  onShowStories: () => void;
}

export const ResultsScreen = ({ outfits, onRestart, onShowStories }: ResultsScreenProps) => {
  const [selectedOutfit, setSelectedOutfit] = useState(outfits[0]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  const { 
    toggleFavorite, 
    rateOutfit, 
    addToViewHistory, 
    getOutfitRating, 
    isFavorite,
    getRecommendations 
  } = useOutfitInteractions();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your personalized look is being saved to your device.",
    });
    
    // Create download link
    const link = document.createElement('a');
    link.href = selectedOutfit.imageUrl;
    link.download = `my-new-look-${selectedOutfit.category}.jpg`;
    link.click();
  };

  const handleShare = () => {
    setShowSharingModal(true);
  };

  const handleOutfitSelect = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    addToViewHistory(outfit.id);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(selectedOutfit.id);
    toast({
      title: isFavorite(selectedOutfit.id) ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite(selectedOutfit.id) ? "Outfit removed from your favorites" : "Outfit saved to your favorites",
    });
  };

  const handleRateOutfit = (outfitId: string, rating: 'like' | 'dislike') => {
    rateOutfit(outfitId, rating);
    toast({
      title: "Thanks for your feedback!",
      description: "This helps us improve future recommendations.",
    });
  };

  // Filter and sort outfits
  const filteredOutfits = outfits.filter(outfit => {
    if (selectedCategory !== 'all' && outfit.category !== selectedCategory) return false;
    if (showFavoritesOnly && !isFavorite(outfit.id)) return false;
    return true;
  });

  const sortedOutfits = [...filteredOutfits].sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.confidence - a.confidence;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'recent':
        return 0; // Keep original order as "recent"
      default:
        return 0;
    }
  });

  const getRecommendation = () => {
    const recommendations = [
      "This style beautifully highlights your confident personality!",
      "The colors in this outfit perfectly complement your natural radiance.",
      "This look showcases your unique sense of style and grace.",
      "You look absolutely stunning in this thoughtfully designed ensemble.",
      "This outfit celebrates your individuality and inner strength."
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-healing p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-healing-purple" />
              <h1 className="text-2xl font-bold text-foreground">Your New Look Collection</h1>
              <Sparkles className="w-6 h-6 text-healing-purple" />
            </div>
            <p className="text-muted-foreground">
              Celebrating your unique beauty and style
            </p>
          </div>
        </Card>

        {/* Filters */}
        <OutfitFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Image Display */}
          <div className="lg:col-span-2">
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <div className="p-6">
                <div className="aspect-[3/4] bg-accent rounded-lg overflow-hidden mb-4 relative">
                  <img 
                    src={selectedOutfit.imageUrl}
                    alt={selectedOutfit.description}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                      {selectedOutfit.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={handleToggleFavorite}
                      className="bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(selectedOutfit.id) ? 'fill-current text-healing-purple' : 'text-healing-purple'}`} />
                    </button>
                    <button 
                      onClick={() => setShowDetailsModal(true)}
                      className="bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors"
                    >
                      <Info className="w-5 h-5 text-healing-blue" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {selectedOutfit.description}
                    </h3>
                    <p className="text-healing-purple font-medium">
                      {getRecommendation()}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleDownload} variant="healing" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Look
                    </Button>
                    <Button onClick={handleShare} variant="confidence" className="flex-1">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Outfit Gallery & Actions */}
          <div className="space-y-6">
            {/* Outfit Selection */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Your Collection</h3>
                  <Badge variant="secondary">{sortedOutfits.length} outfits</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {sortedOutfits.map((outfit) => {
                    const isSelected = selectedOutfit.id === outfit.id;
                    const isFav = isFavorite(outfit.id);
                    
                    return (
                      <button
                        key={outfit.id}
                        onClick={() => handleOutfitSelect(outfit)}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all relative ${
                          isSelected 
                            ? 'border-healing-purple shadow-gentle' 
                            : 'border-transparent hover:border-healing-purple/50'
                        }`}
                      >
                        <img 
                          src={outfit.imageUrl}
                          alt={outfit.description}
                          className="w-full h-full object-cover"
                        />
                        {isFav && (
                          <div className="absolute top-2 right-2">
                            <Star className="w-4 h-4 fill-current text-healing-purple" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs bg-card/80 backdrop-blur-sm">
                            {outfit.confidence}%
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <div className="p-4 space-y-3">
                <Button onClick={onShowStories} variant="warm" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Hear Inspiring Stories
                </Button>
                
                <Button onClick={onRestart} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try New Photos
                </Button>
              </div>
            </Card>

            {/* Confidence Message */}
            <Card className="bg-gradient-to-r from-healing-purple/10 to-healing-blue/10 border border-healing-purple/20">
              <div className="p-4 text-center">
                <Heart className="w-6 h-6 text-healing-purple mx-auto mb-2" />
                <p className="text-sm text-foreground/80 italic">
                  "Your appearance reflects strength, but your true beauty comes from within. Keep shining!"
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <OutfitDetailsModal
          outfit={selectedOutfit}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onRate={handleRateOutfit}
        />

        <SocialSharing
          outfit={selectedOutfit}
          isOpen={showSharingModal}
          onClose={() => setShowSharingModal(false)}
        />
      </div>
    </div>
  );
};