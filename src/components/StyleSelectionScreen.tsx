
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, Briefcase, Dumbbell, Crown, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface StyleSelectionScreenProps {
  onStylesSelected: (selectedStyles: string[]) => void;
  onBack: () => void;
}

interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  useCase: string;
}

export const StyleSelectionScreen = ({ onStylesSelected, onBack }: StyleSelectionScreenProps) => {
  const { t } = useTranslation();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const styleOptions: StyleOption[] = [
    {
      id: 'formal',
      name: 'Professional',
      description: 'Business attire and elegant formal wear',
      icon: Briefcase,
      color: 'bg-healing-blue/10 border-healing-blue/30 hover:bg-healing-blue/20',
      useCase: 'Work meetings, interviews, formal events'
    },
    {
      id: 'casual',
      name: 'Everyday',
      description: 'Comfortable and stylish daily outfits',
      icon: Shirt,
      color: 'bg-healing-green/10 border-healing-green/30 hover:bg-healing-green/20',
      useCase: 'Daily wear, social outings, relaxed settings'
    },
    {
      id: 'sportswear',
      name: 'Active',
      description: 'Sporty and comfortable activewear',
      icon: Dumbbell,
      color: 'bg-warm-orange/10 border-warm-orange/30 hover:bg-warm-orange/20',
      useCase: 'Exercise, sports activities, active lifestyle'
    },
    {
      id: 'traditional',
      name: 'Cultural',
      description: 'Traditional and cultural attire',
      icon: Crown,
      color: 'bg-healing-purple/10 border-healing-purple/30 hover:bg-healing-purple/20',
      useCase: 'Cultural events, celebrations, heritage occasions'
    }
  ];

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
    <div className="min-h-screen bg-gradient-confidence flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-healing rounded-full flex items-center justify-center animate-gentle-bounce">
              <Shirt className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Choose Your Styles</h2>
            <p className="text-muted-foreground leading-relaxed">
              Select the outfit styles you'd like to see. You can choose multiple options to get a complete wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {styleOptions.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              const IconComponent = style.icon;
              
              return (
                <Card
                  key={style.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? 'border-healing-blue bg-healing-blue/10 shadow-md scale-[1.02]' 
                      : `${style.color} border-dashed`
                  }`}
                  onClick={() => toggleStyle(style.id)}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-healing-blue text-white' : 'bg-accent'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{style.name}</h3>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="bg-healing-blue text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground pl-13">
                      {style.useCase}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedStyles.length > 0 && (
            <div className="bg-gradient-to-r from-healing-green/10 to-healing-blue/10 rounded-lg p-4 border border-healing-green/20">
              <p className="text-sm text-foreground/80 text-center">
                ✨ <span className="font-medium">Great choice!</span> We'll generate {selectedStyles.length} personalized outfit{selectedStyles.length > 1 ? 's' : ''} for you
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={selectedStyles.length === 0}
              variant="warm"
              className="flex-1 py-6"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
