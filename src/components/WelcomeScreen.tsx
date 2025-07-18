
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface WelcomeScreenProps {
  onStartExperience: () => void;
}

export const WelcomeScreen = ({ onStartExperience }: WelcomeScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <Card className="max-w-md w-full bg-card shadow-sm border mx-auto">
        <div className="p-6 text-center space-y-6">
          {/* Simple Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Simple Greeting */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {t('welcome.title')}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t('welcome.description')}
            </p>
          </div>

          {/* Simple Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 rounded-lg p-3 border">
              <Shield className="w-4 h-4 text-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">Private</span>
                <span className="text-xs">Images not stored</span>
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 border">
              <Sparkles className="w-4 h-4 text-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground block">AI Powered</span>
                <span className="text-xs">Smart suggestions</span>
              </p>
            </div>
          </div>

          {/* Simple Quote */}
          <div className="bg-muted/30 rounded-lg p-4 border">
            <p className="text-sm italic text-muted-foreground">
              "Beauty begins the moment you decide to be yourself."
            </p>
          </div>

          {/* Simple Start Button */}
          <Button 
            onClick={onStartExperience}
            size="lg"
            className="w-full font-semibold py-6"
          >
            {t('welcome.getStarted')}
          </Button>

          {/* Simple Notice */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p>🔒 Your privacy is our priority</p>
            <p>Images are processed temporarily and never stored.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
