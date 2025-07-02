import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Shirt, Calendar, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { useVirtualWardrobe } from '@/hooks/useVirtualWardrobe';
import { useToast } from '@/hooks/use-toast';
import { WardrobeItemForm } from './WardrobeItemForm';
import { OutfitPlannerModal } from './OutfitPlannerModal';

interface VirtualWardrobeScreenProps {
  onBack: () => void;
}

export const VirtualWardrobeScreen = ({ onBack }: VirtualWardrobeScreenProps) => {
  const { 
    wardrobeItems, 
    outfitCombinations, 
    loading, 
    addWardrobeItem, 
    generateSmartCombinations 
  } = useVirtualWardrobe();
  const { toast } = useToast();
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showOutfitPlanner, setShowOutfitPlanner] = useState(false);
  const [activeTab, setActiveTab] = useState('wardrobe');

  const categoryColors = {
    tops: 'bg-healing-blue/10 text-healing-blue',
    bottoms: 'bg-healing-purple/10 text-healing-purple',
    shoes: 'bg-healing-green/10 text-healing-green',
    accessories: 'bg-warm-orange/10 text-warm-orange',
    outerwear: 'bg-soft-pink/10 text-soft-pink'
  };

  const handleGenerateOutfits = () => {
    const suggestions = generateSmartCombinations();
    if (suggestions.length === 0) {
      toast({
        title: "Need More Items",
        description: "Add more wardrobe items to generate outfit combinations.",
      });
    } else {
      setShowOutfitPlanner(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-healing p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onBack}
                  className="hover:bg-healing-purple/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shirt className="w-6 h-6 text-healing-purple" />
                    <span>Virtual Wardrobe</span>
                  </CardTitle>
                  <CardDescription>
                    Organize your clothes and create perfect outfit combinations
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowAddItemForm(true)}
                  className="bg-healing-purple hover:bg-healing-purple/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button 
                  onClick={handleGenerateOutfits}
                  variant="confidence"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Smart Outfits
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wardrobe">My Wardrobe</TabsTrigger>
            <TabsTrigger value="outfits">Outfit Combinations</TabsTrigger>
            <TabsTrigger value="planner">Outfit Planner</TabsTrigger>
          </TabsList>

          <TabsContent value="wardrobe" className="space-y-6">
            {/* Wardrobe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(categoryColors).map(([category, colorClass]) => {
                const categoryItems = wardrobeItems.filter(item => item.category === category);
                return (
                  <Card key={category} className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${colorClass}`}>
                        <Shirt className="w-6 h-6" />
                      </div>
                      <p className="text-lg font-semibold">{categoryItems.length}</p>
                      <p className="text-sm text-muted-foreground capitalize">{category}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Wardrobe Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {wardrobeItems.map((item) => (
                <Card key={item.id} className="bg-card/95 backdrop-blur-sm shadow-gentle border-0 hover:shadow-warm transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-accent rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Shirt className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-2 truncate">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryColors[item.category as keyof typeof categoryColors] || 'bg-muted'}`}
                      >
                        {item.category}
                      </Badge>
                      {item.is_adaptive_clothing && (
                        <Heart className="w-4 h-4 text-healing-purple" />
                      )}
                    </div>
                    {item.color && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-muted-foreground">{item.color}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {wardrobeItems.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <Shirt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your wardrobe is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your favorite clothing items
                  </p>
                  <Button 
                    onClick={() => setShowAddItemForm(true)}
                    className="bg-healing-purple hover:bg-healing-purple/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Item
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="outfits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfitCombinations.map((outfit) => (
                <Card key={outfit.id} className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{outfit.name}</h3>
                      {outfit.is_favorite && (
                        <Heart className="w-5 h-5 text-healing-purple fill-current" />
                      )}
                    </div>
                    
                    {outfit.occasion && (
                      <Badge variant="secondary" className="mb-3">
                        {outfit.occasion}
                      </Badge>
                    )}
                    
                    <div className="space-y-2">
                      {outfit.notes && (
                        <p className="text-sm text-muted-foreground">{outfit.notes}</p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Created recently</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {outfitCombinations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No outfit combinations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first outfit combination from your wardrobe
                  </p>
                  <Button 
                    onClick={handleGenerateOutfits}
                    variant="confidence"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Smart Outfits
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="planner">
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-healing-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Outfit Planner</h3>
                <p className="text-muted-foreground mb-6">
                  Plan your outfits for different occasions and events
                </p>
                <Button 
                  onClick={() => setShowOutfitPlanner(true)}
                  className="bg-healing-purple hover:bg-healing-purple/90"
                >
                  Open Outfit Planner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showAddItemForm && (
          <WardrobeItemForm
            isOpen={showAddItemForm}
            onClose={() => setShowAddItemForm(false)}
            onSubmit={addWardrobeItem}
          />
        )}

        {showOutfitPlanner && (
          <OutfitPlannerModal
            isOpen={showOutfitPlanner}
            onClose={() => setShowOutfitPlanner(false)}
            wardrobeItems={wardrobeItems}
          />
        )}
      </div>
    </div>
  );
};