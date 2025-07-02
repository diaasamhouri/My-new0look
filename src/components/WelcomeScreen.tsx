import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Shield, Camera } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface WelcomeScreenProps {
  onStartExperience: () => void;
}

export const WelcomeScreen = ({ onStartExperience }: WelcomeScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-healing flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in mx-auto">
        <div className="p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6">
          {/* Digital Character Avatar */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6">
            <div className="w-full h-full bg-gradient-confidence rounded-full flex items-center justify-center animate-gentle-bounce shadow-warm">
              <Heart className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-warm-orange rounded-full flex items-center justify-center animate-confidence-pulse">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-healing-green rounded-full flex items-center justify-center animate-gentle-bounce">
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Digital Character Greeting */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-r from-healing-blue/10 to-healing-purple/10 rounded-xl p-3 sm:p-4 border border-healing-blue/20">
              <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-2 sm:mb-3">
                {t('welcome.title')}
              </h1>
              <p className="text-foreground/90 leading-relaxed text-xs sm:text-sm">
                {t('welcome.description')}
              </p>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                {t('welcome.subtitle')}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {t('welcome.description')}
              </p>
            </div>
          </div>

          {/* Privacy & Security Features */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-healing-purple/10">
              <Shield className="w-4 h-4 text-healing-purple mx-auto mb-1" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">100% Private</span>
                <span className="text-xs">Images processed temporarily</span>
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-healing-blue/10">
              <Sparkles className="w-4 h-4 text-healing-blue mx-auto mb-1" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">AI Powered</span>
                <span className="text-xs">Personalized for you</span>
              </p>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-healing-purple/15 to-healing-blue/15 rounded-lg p-3 sm:p-4 border border-healing-purple/25">
            <p className="text-xs sm:text-sm italic text-foreground/85 font-medium">
              "Beauty begins the moment you decide to be yourself."
            </p>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStartExperience}
            variant="warm"
            size="lg"
            className="w-full text-base sm:text-lg font-semibold py-4 sm:py-6 mt-4 sm:mt-6 min-h-[52px]"
          >
            {t('welcome.getStarted')}
          </Button>

          {/* Optional Sign In Notice */}
          <div className="text-xs text-muted-foreground text-center space-y-2">
            <p className="font-medium">✨ Want to save your outfits?</p>
            <p>Sign in later to unlock profile features and community access</p>
          </div>

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