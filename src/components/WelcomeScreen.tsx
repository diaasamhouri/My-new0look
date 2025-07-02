import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStartExperience: () => void;
}

export const WelcomeScreen = ({ onStartExperience }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-healing flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-8 text-center space-y-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 bg-gradient-confidence rounded-full flex items-center justify-center animate-gentle-bounce">
              <Heart className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-warm-orange rounded-full flex items-center justify-center animate-confidence-pulse">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Welcome to Your New Look
              <span className="block text-lg font-medium text-healing-purple">AI Edition</span>
            </h1>
            
            <p className="text-muted-foreground leading-relaxed">
              Discover your unique style and embrace your confident, beautiful self. 
              This personalized experience is designed just for you.
            </p>
          </div>

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-healing-purple/10 to-healing-blue/10 rounded-lg p-4 border border-healing-purple/20">
            <p className="text-sm italic text-foreground/80">
              "Beauty begins the moment you decide to be yourself."
            </p>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStartExperience}
            variant="warm"
            size="lg"
            className="w-full text-lg font-semibold py-6"
          >
            Start Your Experience
          </Button>

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground">
            Your privacy is protected. Images are processed temporarily and never stored.
          </p>
        </div>
      </Card>
    </div>
  );
};