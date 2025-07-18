
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shirt, Briefcase, Dumbbell, Star } from "lucide-react";

interface StyleSelectionScreenProps {
  onStylesSelected: (styles: string[]) => void;
  onBack: () => void;
}

const styleOptions = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'Comfortable everyday wear',
    icon: Shirt,
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Professional and business attire',
    icon: Briefcase,
  },
  {
    id: 'sportswear',
    name: 'Sportswear',
    description: 'Active and athletic clothing',
    icon: Dumbbell,
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Cultural and traditional outfits',
    icon: Star,
  }
];

export const StyleSelectionScreen = ({ onStylesSelected, onBack }: StyleSelectionScreenProps) => {
  const { t } = useTranslation();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleContinue = () => {
    if (selectedStyles.length > 0) {
      onStylesSelected(selectedStyles);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('styles.title', 'Choose Your Style')}
            </h1>
            <p className="text-muted-foreground">
              {t('styles.subtitle', 'Select the styles you want to see')}
            </p>
          </div>
        </div>

        {/* Style Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {styleOptions.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            const Icon = style.icon;
            
            return (
              <Card 
                key={style.id} 
                className={`cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => toggleStyle(style.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{style.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {style.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Selection Summary */}
        {selectedStyles.length > 0 && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Selected: {selectedStyles.length} style{selectedStyles.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex gap-4">
          <Button 
            onClick={handleContinue}
            disabled={selectedStyles.length === 0}
            className="flex-1"
            size="lg"
          >
            {t('styles.continue', 'Continue')} 
            {selectedStyles.length > 0 && ` (${selectedStyles.length})`}
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          {t('styles.helper', 'Select at least one style to continue')}
        </p>
      </div>
    </div>
  );
};
