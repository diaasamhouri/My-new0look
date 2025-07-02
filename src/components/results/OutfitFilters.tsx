import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Star, TrendingUp, Calendar } from "lucide-react";

interface OutfitFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export const OutfitFilters = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites
}: OutfitFiltersProps) => {
  const categories = [
    { id: 'all', label: 'All Styles', icon: Filter },
    { id: 'formal', label: 'Formal', icon: TrendingUp },
    { id: 'casual', label: 'Casual', icon: Calendar },
    { id: 'sportswear', label: 'Sportswear', icon: Calendar },
    { id: 'traditional', label: 'Traditional', icon: Star }
  ];

  return (
    <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0 mb-6">
      <div className="p-4 space-y-4">
        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-healing-purple" />
            Filter by Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                  className={`${isSelected ? 'bg-healing-purple hover:bg-healing-purple/90' : ''}`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Sort and Additional Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Sort by:</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleFavorites}
            className={`${showFavoritesOnly ? 'bg-healing-purple hover:bg-healing-purple/90' : ''}`}
          >
            <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites Only
          </Button>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || showFavoritesOnly) && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="capitalize">
                {selectedCategory}
              </Badge>
            )}
            {showFavoritesOnly && (
              <Badge variant="secondary">
                Favorites
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};