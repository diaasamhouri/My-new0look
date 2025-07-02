import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ImageSetupScreen } from '@/components/ImageSetupScreen';
import { PersonalInfoScreen } from '@/components/PersonalInfoScreen';
import { OutfitGenerationScreen } from '@/components/OutfitGenerationScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { StoriesScreen } from '@/components/StoriesScreen';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { UserProfile } from '@/components/profile/UserProfile';
import { StyleInsights } from '@/components/analytics/StyleInsights';
import { AccessibilitySettings } from '@/components/accessibility/AccessibilitySettings';
import { VirtualWardrobeScreen } from '@/components/wardrobe/VirtualWardrobeScreen';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BarChart3, Settings, LogOut, Shirt } from 'lucide-react';

type AppStage = 'welcome' | 'auth' | 'profile' | 'wardrobe' | 'image-setup' | 'personal-info' | 'generation' | 'results' | 'stories';

interface PersonalInfo {
  gender: 'male' | 'female' | '';
  amputationType: 'right-arm' | 'left-arm' | 'right-leg' | 'left-leg' | '';
  usesProsthetic: 'yes' | 'no' | '';
}

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { trackEvent } = useAnalytics();
  const [currentStage, setCurrentStage] = useState<AppStage>('welcome');
  const [imageData, setImageData] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    gender: '',
    amputationType: '',
    usesProsthetic: ''
  });
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healing-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartExperience = () => {
    if (isAuthenticated) {
      setCurrentStage('image-setup');
    } else {
      setCurrentStage('auth');
    }
  };

  const handleAuthSuccess = () => {
    setCurrentStage('welcome');
  };

  const handleImageCapture = (capturedImageData: string) => {
    setImageData(capturedImageData);
    setCurrentStage('personal-info');
  };

  const handleInfoSubmit = (info: PersonalInfo) => {
    setPersonalInfo(info);
    setCurrentStage('generation');
  };

  const handleViewResults = (outfits: any[]) => {
    setGeneratedOutfits(outfits);
    setCurrentStage('results');
    
    // Track analytics for each outfit
    outfits.forEach(outfit => {
      trackEvent({
        interaction_type: 'generated',
        outfit_data: outfit,
        confidence_score: outfit.confidence,
        style_category: outfit.category
      });
    });
  };

  const handleShowStories = () => {
    setCurrentStage('stories');
  };

  const handleRestart = () => {
    setCurrentStage('welcome');
    setImageData('');
    setPersonalInfo({ gender: '', amputationType: '', usesProsthetic: '' });
    setGeneratedOutfits([]);
  };

  const handleBack = () => {
    switch (currentStage) {
      case 'auth':
        setCurrentStage('welcome');
        break;
      case 'profile':
        setCurrentStage('welcome');
        break;
      case 'wardrobe':
        setCurrentStage('welcome');
        break;
      case 'image-setup':
        setCurrentStage('welcome');
        break;
      case 'personal-info':
        setCurrentStage('image-setup');
        break;
      case 'generation':
        setCurrentStage('personal-info');
        break;
      case 'results':
        setCurrentStage('generation');
        break;
      case 'stories':
        setCurrentStage('results');
        break;
      default:
        setCurrentStage('welcome');
    }
  };

  // Render profile/settings screens for authenticated users
  if (isAuthenticated && currentStage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-healing-purple to-healing-blue bg-clip-text text-transparent mb-4">
                Welcome Back to StyleAI
              </h1>
              <p className="text-muted-foreground text-lg">
                Your personalized styling journey continues
              </p>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="cursor-pointer hover:shadow-warm transition-shadow duration-300" 
                        onClick={() => setCurrentStage('image-setup')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-healing-purple" />
                        Generate New Outfit
                      </CardTitle>
                      <CardDescription>
                        Create a new personalized outfit recommendation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-healing-purple hover:bg-healing-purple/90">
                        Start New Session
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-warm transition-shadow duration-300"
                        onClick={() => setCurrentStage('wardrobe')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shirt className="w-5 h-5 mr-2 text-healing-green" />
                        Virtual Wardrobe
                      </CardTitle>
                      <CardDescription>
                        Organize your clothes and plan outfits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Manage Wardrobe
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <StyleInsights />
              </TabsContent>

              <TabsContent value="profile">
                <UserProfile />
              </TabsContent>

              <TabsContent value="analytics">
                <StyleInsights />
              </TabsContent>

              <TabsContent value="accessibility">
                <AccessibilitySettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  switch (currentStage) {
    case 'welcome':
      return <WelcomeScreen onStartExperience={handleStartExperience} />;
    
    case 'auth':
      return (
        <AuthScreen 
          onBack={handleBack}
          onAuthSuccess={handleAuthSuccess}
        />
      );
    
    case 'wardrobe':
      return (
        <VirtualWardrobeScreen 
          onBack={handleBack}
        />
      );
    
    case 'image-setup':
      return (
        <ImageSetupScreen 
          onImageCapture={handleImageCapture}
          onBack={handleBack}
        />
      );
    
    case 'personal-info':
      return (
        <PersonalInfoScreen 
          onInfoSubmit={handleInfoSubmit}
          onBack={handleBack}
        />
      );
    
    case 'generation':
      return (
        <OutfitGenerationScreen 
          imageData={imageData}
          personalInfo={personalInfo}
          onViewResults={handleViewResults}
          onBack={handleBack}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen 
          outfits={generatedOutfits}
          onRestart={handleRestart}
          onShowStories={handleShowStories}
        />
      );
    
    case 'stories':
      return (
        <StoriesScreen 
          onBack={handleBack}
          onRestart={handleRestart}
        />
      );
    
    default:
      return <WelcomeScreen onStartExperience={handleStartExperience} />;
  }
};

export default Index;
