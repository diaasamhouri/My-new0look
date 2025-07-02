import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ImageSetupScreen } from '@/components/ImageSetupScreen';
import { PersonalInfoScreen } from '@/components/PersonalInfoScreen';
import { OutfitGenerationScreen } from '@/components/OutfitGenerationScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { StoriesScreen } from '@/components/StoriesScreen';

type AppStage = 'welcome' | 'image-setup' | 'personal-info' | 'generation' | 'results' | 'stories';

interface PersonalInfo {
  gender: 'male' | 'female' | '';
  amputationType: 'right-arm' | 'left-arm' | 'right-leg' | 'left-leg' | '';
  usesProsthetic: 'yes' | 'no' | '';
}

const Index = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>('welcome');
  const [imageData, setImageData] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    gender: '',
    amputationType: '',
    usesProsthetic: ''
  });
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);

  const handleStartExperience = () => {
    setCurrentStage('image-setup');
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

  switch (currentStage) {
    case 'welcome':
      return <WelcomeScreen onStartExperience={handleStartExperience} />;
    
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
