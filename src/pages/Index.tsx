import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ImageSetupScreen } from '@/components/ImageSetupScreen';
import { PersonalInfoScreen } from '@/components/PersonalInfoScreen';
import { StyleSelectionScreen } from '@/components/StyleSelectionScreen';
import { OutfitGenerationScreen } from '@/components/OutfitGenerationScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { StoriesScreen } from '@/components/StoriesScreen';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { UserProfile } from '@/components/profile/UserProfile';
import { StyleInsights } from '@/components/analytics/StyleInsights';
import { AccessibilitySettings } from '@/components/accessibility/AccessibilitySettings';
import { VirtualWardrobeScreen } from '@/components/wardrobe/VirtualWardrobeScreen';
import { CommunityHubScreen } from '@/components/community/CommunityHubScreen';
import { ShoppingIntegrationScreen } from '@/components/shopping/ShoppingIntegrationScreen';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BarChart3, Settings, LogOut, Shirt, Users, ShoppingCart } from 'lucide-react';

type AppStage = 'welcome' | 'auth' | 'profile' | 'wardrobe' | 'community' | 'shopping' | 'image-setup' | 'personal-info' | 'style-selection' | 'generation' | 'results' | 'stories';

interface PersonalInfo {
  gender: 'male' | 'female' | '';
  amputationType: 'right-arm' | 'left-arm' | 'right-leg' | 'left-leg' | '';
  usesProsthetic: 'yes' | 'no' | '';
}

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { trackEvent } = useAnalytics();
  const [currentStage, setCurrentStage] = useState<AppStage>('welcome');
  const [imageData, setImageData] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    gender: '',
    amputationType: '',
    usesProsthetic: ''
  });
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartExperience = () => {
    setCurrentStage('image-setup');
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
    setCurrentStage('style-selection');
  };

  const handleStylesSelected = (styles: string[]) => {
    setSelectedStyles(styles);
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
    setSelectedStyles([]);
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
      case 'community':
        setCurrentStage('welcome');
        break;
      case 'shopping':
        setCurrentStage('welcome');
        break;
      case 'image-setup':
        setCurrentStage('welcome');
        break;
      case 'personal-info':
        setCurrentStage('image-setup');
        break;
      case 'style-selection':
        setCurrentStage('personal-info');
        break;
      case 'generation':
        setCurrentStage('style-selection');
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
      <div className="min-h-screen bg-background">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {t('welcome.title')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('welcome.subtitle')}
              </p>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="dashboard" className="text-sm py-3">
                  {t('navigation.home')}
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-sm py-3">
                  {t('navigation.profile')}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-sm py-3">
                  {t('navigation.analytics')}
                </TabsTrigger>
                <TabsTrigger value="accessibility" className="text-sm py-3">
                  {t('navigation.accessibility')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" 
                        onClick={() => setCurrentStage('image-setup')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary" />
                        {t('results.title')}
                      </CardTitle>
                      <CardDescription>
                        {t('results.subtitle')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-primary hover:bg-primary/90 min-h-[44px]">
                        {t('welcome.getStarted')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setCurrentStage('wardrobe')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shirt className="w-5 h-5 mr-2 text-primary" />
                        {t('navigation.wardrobe')}
                      </CardTitle>
                      <CardDescription>
                        {t('wardrobe.description', 'Organize your clothes and plan outfits')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full min-h-[44px]">
                        Manage Wardrobe
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setCurrentStage('community')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        {t('navigation.community')}
                      </CardTitle>
                      <CardDescription>
                        {t('community.subtitle')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full min-h-[44px]">
                        Join Community
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setCurrentStage('shopping')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                        {t('navigation.shopping')}
                      </CardTitle>
                      <CardDescription>
                        {t('shopping.subtitle')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full min-h-[44px]">
                        Browse Items
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setCurrentStage('stories')}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                        Success Stories
                      </CardTitle>
                      <CardDescription>
                        Read inspiring stories from our community
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full min-h-[44px]">
                        Browse Stories
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
    
    case 'community':
      return (
        <CommunityHubScreen 
          onBack={handleBack}
        />
      );
    
    case 'shopping':
      return (
        <ShoppingIntegrationScreen 
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
    
    case 'style-selection':
      return (
        <StyleSelectionScreen 
          onStylesSelected={handleStylesSelected}
          onBack={handleBack}
        />
      );
    
    case 'generation':
      return (
        <OutfitGenerationScreen 
          imageData={imageData}
          personalInfo={personalInfo}
          selectedStyles={selectedStyles}
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
