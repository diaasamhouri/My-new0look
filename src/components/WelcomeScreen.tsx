import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Shield, Camera } from "lucide-react";

interface WelcomeScreenProps {
  onStartExperience: () => void;
}

export const WelcomeScreen = ({ onStartExperience }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-healing flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-8 text-center space-y-6">
          {/* Digital Character Avatar */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-32 h-32 bg-gradient-confidence rounded-full flex items-center justify-center animate-gentle-bounce shadow-warm">
              <Heart className="w-16 h-16 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-warm-orange rounded-full flex items-center justify-center animate-confidence-pulse">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-healing-green rounded-full flex items-center justify-center animate-gentle-bounce">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Digital Character Greeting */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-healing-blue/10 to-healing-purple/10 rounded-xl p-4 border border-healing-blue/20">
              <h1 className="text-xl font-bold text-foreground leading-tight mb-3">
                Welcome to My New Look!
              </h1>
              <p className="text-foreground/90 leading-relaxed text-sm">
                Here you can explore styles that suit you and see yourself confidently once again. 
                <span className="block mt-2 font-medium text-healing-purple">Are you ready?</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Discover Your Unique Style
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This personalized AI experience will help you explore outfits that celebrate your 
                individuality and boost your confidence. Your journey to self-expression starts here.
              </p>
            </div>
          </div>

          {/* Privacy & Security Features */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-card/50 rounded-lg p-3 border border-healing-purple/10">
              <Shield className="w-4 h-4 text-healing-purple mx-auto mb-1" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">100% Private</span>
                Images processed temporarily
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-3 border border-healing-blue/10">
              <Sparkles className="w-4 h-4 text-healing-blue mx-auto mb-1" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">AI Powered</span>
                Personalized for you
              </p>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-healing-purple/15 to-healing-blue/15 rounded-lg p-4 border border-healing-purple/25">
            <p className="text-sm italic text-foreground/85 font-medium">
              "Beauty begins the moment you decide to be yourself."
            </p>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStartExperience}
            variant="warm"
            size="lg"
            className="w-full text-lg font-semibold py-6 mt-6"
          >
            Start Experience
          </Button>

          {/* Enhanced Privacy Notice */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">🔒 Your privacy is our priority</p>
            <p>Images are processed locally and temporarily. Never stored or shared.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};