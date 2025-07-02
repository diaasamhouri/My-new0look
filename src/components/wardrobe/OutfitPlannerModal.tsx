import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, Check } from 'lucide-react';
import { useVirtualWardrobe } from '@/hooks/useVirtualWardrobe';
import { useToast } from '@/hooks/use-toast';

interface OutfitPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItems: any[];
}

export const OutfitPlannerModal = ({ isOpen, onClose, wardrobeItems }: OutfitPlannerModalProps) => {
  const { createOutfitCombination, generateSmartCombinations } = useVirtualWardrobe();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [season, setSeason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<any[]>([]);

  const occasions = [
    { value: 'casual', label: 'Casual' },
    { value: 'work', label: 'Work/Professional' },
    { value: 'formal', label: 'Formal Event' },
    { value: 'special_event', label: 'Special Occasion' }
  ];

  const seasons = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' }
  ];

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleGenerateSuggestions = () => {
    const suggestions = generateSmartCombinations(occasion, season);
    setSmartSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleUseSuggestion = (suggestion: any) => {
    setSelectedItems(suggestion.items);
    setShowSuggestions(false);
    if (!outfitName) {
      setOutfitName(`${suggestion.occasion} outfit`);
    }
  };

  const handleSaveOutfit = async () => {
    if (!outfitName || selectedItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide an outfit name and select at least one item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createOutfitCombination({
        name: outfitName,
        occasion,
        season,
        weather_type: undefined,
        items: selectedItems,
        notes,
        is_favorite: false
      });

      toast({
        title: "Outfit Saved",
        description: "Your outfit combination has been saved to your wardrobe.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save outfit combination.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryGroups = wardrobeItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Outfit Planner</DialogTitle>
          <DialogDescription>
            Create and plan your perfect outfit combinations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Outfit Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="outfitName">Outfit Name</Label>
              <Input
                id="outfitName"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="e.g., Monday Work Outfit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occ) => (
                    <SelectItem key={occ.value} value={occ.value}>
                      {occ.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Suggestions</Label>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGenerateSuggestions}
                className="w-full"
              >
                Generate Smart Combinations
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this outfit..."
              rows={2}
            />
          </div>

          {/* Smart Suggestions */}
          {showSuggestions && smartSuggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartSuggestions.map((suggestion, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-gentle transition-shadow" onClick={() => handleUseSuggestion(suggestion)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">
                          {Math.round(suggestion.confidence * 100)}% match
                        </Badge>
                        <Button size="sm" variant="outline">
                          Use This
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(Array.isArray(suggestion.items) ? suggestion.items : []).slice(0, 3).map((itemId: string) => {
                          const item = wardrobeItems.find(i => i.id === itemId);
                          return item ? (
                            <div key={itemId} className="text-center">
                              <div className="aspect-square bg-accent rounded-lg mb-1 flex items-center justify-center">
                                <Shirt className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <p className="text-xs truncate">{item.name}</p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Item Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Items for Your Outfit</h3>
            {Object.entries(categoryGroups).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium capitalize">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {items.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <Card 
                        key={item.id} 
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'ring-2 ring-healing-purple bg-healing-purple/5' 
                            : 'hover:shadow-gentle'
                        }`}
                        onClick={() => handleItemToggle(item.id)}
                      >
                        <CardContent className="p-3">
                          <div className="aspect-square bg-accent rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Shirt className="w-6 h-6 text-muted-foreground" />
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 bg-healing-purple/20 flex items-center justify-center">
                                <Check className="w-6 h-6 text-healing-purple" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          {item.color && (
                            <p className="text-xs text-muted-foreground">{item.color}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveOutfit}
              disabled={loading || selectedItems.length === 0}
              className="bg-healing-purple hover:bg-healing-purple/90"
            >
              {loading ? 'Saving...' : 'Save Outfit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};