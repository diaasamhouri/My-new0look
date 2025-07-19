
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Star, TrendingUp, Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const categories = [
    { id: 'all', label: t('categories.all'), icon: Filter },
    { id: 'formal', label: t('categories.formal'), icon: TrendingUp },
    { id: 'casual', label: t('categories.casual'), icon: Calendar },
    { id: 'sportswear', label: t('categories.sportswear'), icon: Calendar },
    { id: 'traditional', label: t('categories.traditional'), icon: Star }
  ];

  return (
    <Card className="bg-card/95 backdrop-blur-sm shadow-sm border mb-6">
      <div className="p-4 space-y-4">
        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            {t('filters.category')}
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
                  className={`transition-all ${isSelected ? 'shadow-sm' : ''}`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Sort and Additional Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">{t('filters.sortBy')}:</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confidence">{t('filters.confidence')}</SelectItem>
                <SelectItem value="category">{t('filters.category')}</SelectItem>
                <SelectItem value="recent">{t('filters.recent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleFavorites}
            className="transition-all"
          >
            <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            {t('filters.favoritesOnly')}
          </Button>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || showFavoritesOnly) && (
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">{t('common.select')}:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="capitalize">
                {categories.find(cat => cat.id === selectedCategory)?.label}
              </Badge>
            )}
            {showFavoritesOnly && (
              <Badge variant="secondary">
                {t('filters.favoritesOnly')}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
