import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Palette, TrendingUp, Info, ThumbsUp, ThumbsDown } from "lucide-react";

interface Outfit {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
  confidence: number;
}

interface OutfitDetailsModalProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
  onRate: (outfitId: string, rating: 'like' | 'dislike') => void;
}

export const OutfitDetailsModal = ({ outfit, isOpen, onClose, onRate }: OutfitDetailsModalProps) => {
  const [rating, setRating] = useState<'like' | 'dislike' | null>(null);

  if (!outfit) return null;

  const handleRate = (newRating: 'like' | 'dislike') => {
    setRating(newRating);
    onRate(outfit.id, newRating);
  };

  const getStyleAnalysis = () => {
    const analyses = {
      formal: {
        dominantColors: ['Navy Blue', 'Charcoal Gray', 'Crisp White'],
        styleNotes: ['Professional silhouette', 'Classic color palette', 'Adaptive design'],
        occasions: ['Business meetings', 'Interviews', 'Professional events']
      },
      casual: {
        dominantColors: ['Soft Denim', 'Earth Tones', 'Gentle Pastels'],
        styleNotes: ['Comfortable fit', 'Versatile pieces', 'Effortless elegance'],
        occasions: ['Weekend outings', 'Coffee dates', 'Casual gatherings']
      },
      sportswear: {
        dominantColors: ['Dynamic Blues', 'Energetic Greens', 'Clean Whites'],
        styleNotes: ['Functional design', 'Moisture-wicking fabrics', 'Freedom of movement'],
        occasions: ['Workouts', 'Sports activities', 'Active lifestyle']
      },
      traditional: {
        dominantColors: ['Rich Burgundy', 'Golden Accents', 'Deep Emerald'],
        styleNotes: ['Cultural heritage', 'Timeless elegance', 'Meaningful details'],
        occasions: ['Cultural events', 'Celebrations', 'Special occasions']
      }
    };
    
    return analyses[outfit.category as keyof typeof analyses] || analyses.casual;
  };

  const analysis = getStyleAnalysis();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-healing-purple" />
            <span>Outfit Details & Analysis</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Image */}
          <div className="aspect-[3/4] bg-accent rounded-lg overflow-hidden relative">
            <img 
              src={outfit.imageUrl}
              alt={outfit.description}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                {outfit.category}
              </Badge>
            </div>
          </div>

          {/* Confidence Score */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-healing-blue" />
                <span className="font-medium">AI Confidence Score</span>
              </div>
              <span className="text-lg font-bold text-healing-purple">{outfit.confidence}%</span>
            </div>
            <Progress value={outfit.confidence} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              This outfit was generated with high confidence based on your preferences and adaptive fashion principles.
            </p>
          </Card>

          {/* Color Palette */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="w-4 h-4 text-healing-green" />
              <span className="font-medium">Dominant Colors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.dominantColors.map((color, index) => (
                <Badge key={index} variant="outline" className="bg-accent/50">
                  {color}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Style Notes */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-warm-orange" />
              <span className="font-medium">Style Analysis</span>
            </div>
            <ul className="space-y-2">
              {analysis.styleNotes.map((note, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-healing-purple rounded-full" />
                  <span className="text-sm">{note}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Perfect For */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Perfect For</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.occasions.map((occasion, index) => (
                <Badge key={index} variant="secondary">
                  {occasion}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Rating */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Rate this outfit</h4>
            <div className="flex space-x-3">
              <Button 
                variant={rating === 'like' ? "default" : "outline"}
                onClick={() => handleRate('like')}
                className="flex-1"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Love it!
              </Button>
              <Button 
                variant={rating === 'dislike' ? "destructive" : "outline"}
                onClick={() => handleRate('dislike')}
                className="flex-1"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Not for me
              </Button>
            </div>
            {rating && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Thanks for your feedback! This helps us improve future recommendations.
              </p>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};