import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useToast } from "@/hooks/use-toast";
import { Accessibility, Eye, Volume2, MousePointer, Save } from "lucide-react";

export const AccessibilitySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 16,
    reduceMotion: false,
    screenReader: false,
    voiceNavigation: false,
    focusIndicators: true,
    colorBlindMode: 'none',
    textToSpeech: false
  });

  useEffect(() => {
    if (preferences.accessibility_settings) {
      setSettings(prev => ({
        ...prev,
        ...preferences.accessibility_settings
      }));
    }
  }, [preferences]);

  const handleSave = async () => {
    await updatePreferences({
      accessibility_settings: settings
    });

    // Apply settings to document
    applyAccessibilitySettings(settings);

    toast({
      title: "Settings saved",
      description: "Your accessibility preferences have been updated.",
    });
  };

  const applyAccessibilitySettings = (settings: any) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

    // Reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Color blind mode
    root.setAttribute('data-colorblind-mode', settings.colorBlindMode);
  };

  // Apply settings on mount
  useEffect(() => {
    applyAccessibilitySettings(settings);
  }, [settings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Accessibility className="w-5 h-5 mr-2 text-healing-blue" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize the app to better suit your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, highContrast: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="px-3">
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => 
                  setSettings(prev => ({ ...prev, fontSize: value }))
                }
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small (12px)</span>
                <span>Current: {settings.fontSize}px</span>
                <span>Large (24px)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="reduce-motion">Reduce Motion</Label>
            </div>
            <Switch
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, reduceMotion: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
            <Switch
              id="focus-indicators"
              checked={settings.focusIndicators}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, focusIndicators: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Color Vision Support</Label>
            <Select
              value={settings.colorBlindMode}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, colorBlindMode: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No adjustment</SelectItem>
                <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReader}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, screenReader: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="text-to-speech">Text-to-Speech Descriptions</Label>
            <Switch
              id="text-to-speech"
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, textToSpeech: checked }))
              }
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full bg-healing-purple hover:bg-healing-purple/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Accessibility Settings
        </Button>
      </CardContent>
    </Card>
  );
};