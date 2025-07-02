import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Plus, 
  Heart, 
  Star, 
  ExternalLink, 
  DollarSign,
  Filter,
  Search,
  ShoppingCart,
  Trash2,
  Edit
} from 'lucide-react';
import { useShoppingWishlist } from '@/hooks/useShoppingWishlist';
import { useToast } from '@/hooks/use-toast';
import { AddWishlistItemModal } from './AddWishlistItemModal';

interface ShoppingIntegrationScreenProps {
  onBack: () => void;
}

export const ShoppingIntegrationScreen = ({ onBack }: ShoppingIntegrationScreenProps) => {
  const { 
    wishlistItems, 
    loading, 
    addToWishlist, 
    removeFromWishlist, 
    getBudgetAnalysis,
    getAdaptiveClothingRecommendations 
  } = useShoppingWishlist();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wishlist');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const budgetAnalysis = getBudgetAnalysis();
  const adaptiveItems = getAdaptiveClothingRecommendations();

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || 
                           (priorityFilter === 'high' && item.priority >= 4) ||
                           (priorityFilter === 'medium' && item.priority === 3) ||
                           (priorityFilter === 'low' && item.priority <= 2);
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-500 bg-red-50';
    if (priority === 3) return 'text-orange-500 bg-orange-50';
    return 'text-green-500 bg-green-50';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromWishlist(id);
      toast({
        title: "Item Removed",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive"
      });
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
                    <ShoppingCart className="w-6 h-6 text-healing-purple" />
                    <span>Shopping & Wishlist</span>
                  </CardTitle>
                  <CardDescription>
                    Discover adaptive fashion and manage your style wishlist
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-healing-purple hover:bg-healing-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
            <TabsTrigger value="adaptive">Adaptive Fashion</TabsTrigger>
            <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="wishlist" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search wishlist items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="bg-card/95 backdrop-blur-sm shadow-gentle border-0 hover:shadow-warm transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.item_name}</h3>
                          {item.brand && (
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {getPriorityLabel(item.priority)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {item.image_url && (
                        <div className="aspect-square bg-accent rounded-lg overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {item.price && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-healing-green" />
                            <span className="font-medium">${item.price}</span>
                          </div>
                        )}

                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        )}

                        {item.is_adaptive_clothing && (
                          <Badge className="bg-healing-purple/10 text-healing-purple">
                            <Heart className="w-3 h-3 mr-1" />
                            Adaptive Fashion
                          </Badge>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}

                      {item.url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Item
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredItems.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery || priorityFilter !== 'all' ? 'No items match your filters' : 'Your wishlist is empty'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || priorityFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start adding items you would like to purchase'
                    }
                  </p>
                  {!searchQuery && priorityFilter === 'all' && (
                    <Button 
                      onClick={() => setShowAddModal(true)}
                      className="bg-healing-purple hover:bg-healing-purple/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="adaptive" className="space-y-6">
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-healing-purple" />
                  <span>Adaptive Fashion Collection</span>
                </CardTitle>
                <CardDescription>
                  Discover clothing designed for accessibility and comfort
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {adaptiveItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adaptiveItems.map((item) => (
                      <Card key={item.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{item.item_name}</h4>
                          {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                          {item.price && <p className="text-sm font-medium">${item.price}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No adaptive fashion items in your wishlist yet</p>
                    <p className="text-sm text-muted-foreground">Add items marked as adaptive clothing to see them here</p>
                  </div>
                )}

                <div className="bg-healing-purple/5 border border-healing-purple/20 rounded-lg p-6">
                  <h4 className="font-semibold text-healing-purple mb-3">Featured Adaptive Fashion Brands</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Seated Apparel</p>
                      <p className="text-muted-foreground">Clothing designed for wheelchair users</p>
                    </div>
                    <div>
                      <p className="font-medium">Adaptive Clothing Showroom</p>
                      <p className="text-muted-foreground">Wide range of adaptive options</p>
                    </div>
                    <div>
                      <p className="font-medium">Buck & Buck</p>
                      <p className="text-muted-foreground">Dignified clothing for seniors</p>
                    </div>
                    <div>
                      <p className="font-medium">Tommy Adaptive</p>
                      <p className="text-muted-foreground">Mainstream adaptive fashion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-healing-green mx-auto mb-3" />
                  <p className="text-2xl font-bold">${budgetAnalysis.totalWishlistValue}</p>
                  <p className="text-sm text-muted-foreground">Total Wishlist Value</p>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-healing-purple mx-auto mb-3" />
                  <p className="text-2xl font-bold">${budgetAnalysis.highPriorityValue}</p>
                  <p className="text-sm text-muted-foreground">High Priority Items</p>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-8 h-8 text-healing-blue mx-auto mb-3" />
                  <p className="text-2xl font-bold">{budgetAnalysis.itemCount}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <CardHeader>
                <CardTitle>Budget Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-healing-blue/5 border border-healing-blue/20 rounded-lg p-4">
                  <h4 className="font-medium text-healing-blue mb-2">Smart Shopping Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Focus on high-priority items first</li>
                    <li>• Look for sales on adaptive fashion brands</li>
                    <li>• Consider versatile pieces that work for multiple occasions</li>
                    <li>• Set monthly budget goals for gradual purchases</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-healing-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
                <p className="text-muted-foreground mb-6">
                  AI-powered shopping recommendations based on your style preferences and needs
                </p>
                <Button className="bg-healing-purple hover:bg-healing-purple/90">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddWishlistItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={addToWishlist}
        />
      </div>
    </div>
  );
};