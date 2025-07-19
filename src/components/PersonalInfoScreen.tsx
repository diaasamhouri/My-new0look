import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface PersonalInfo {
  gender: 'male' | 'female' | '';
  amputationType: 'right-arm' | 'left-arm' | 'right-leg' | 'left-leg' | '';
  usesProsthetic: 'yes' | 'no' | '';
}

interface PersonalInfoScreenProps {
  onInfoSubmit: (info: PersonalInfo) => void;
  onBack: () => void;
}

export const PersonalInfoScreen = ({ onInfoSubmit, onBack }: PersonalInfoScreenProps) => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<PersonalInfo>({
    gender: '',
    amputationType: '',
    usesProsthetic: ''
  });

  const isFormValid = info.gender && info.amputationType && info.usesProsthetic;

  const handleSubmit = () => {
    if (isFormValid) {
      onInfoSubmit(info);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-healing flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{t('personalInfo.tellUsAbout')}</h2>
            <p className="text-muted-foreground">
              {t('personalInfo.helpsPerfectStyles')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t('personalInfo.gender')}</Label>
              <RadioGroup
                value={info.gender}
                onValueChange={(value) => setInfo({ ...info, gender: value as 'male' | 'female' })}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer flex-1">{t('personalInfo.male')}</Label>
                </div>
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer flex-1">{t('personalInfo.female')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Amputation Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t('personalInfo.amputationType')}</Label>
              <RadioGroup
                value={info.amputationType}
                onValueChange={(value) => setInfo({ ...info, amputationType: value as any })}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="right-arm" id="right-arm" />
                  <Label htmlFor="right-arm" className="cursor-pointer flex-1 text-sm">{t('personalInfo.rightArm')}</Label>
                </div>
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="left-arm" id="left-arm" />
                  <Label htmlFor="left-arm" className="cursor-pointer flex-1 text-sm">{t('personalInfo.leftArm')}</Label>
                </div>
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="right-leg" id="right-leg" />
                  <Label htmlFor="right-leg" className="cursor-pointer flex-1 text-sm">{t('personalInfo.rightLeg')}</Label>
                </div>
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="left-leg" id="left-leg" />
                  <Label htmlFor="left-leg" className="cursor-pointer flex-1 text-sm">{t('personalInfo.leftLeg')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Prosthetic Use */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t('personalInfo.usesProsthetic')}</Label>
              <RadioGroup
                value={info.usesProsthetic}
                onValueChange={(value) => setInfo({ ...info, usesProsthetic: value as 'yes' | 'no' })}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="yes" id="prosthetic-yes" />
                  <Label htmlFor="prosthetic-yes" className="cursor-pointer flex-1">{t('personalInfo.yes')}</Label>
                </div>
                <div className="flex items-center space-x-2 bg-accent/50 p-4 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="no" id="prosthetic-no" />
                  <Label htmlFor="prosthetic-no" className="cursor-pointer flex-1">{t('personalInfo.no')}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              variant="default"
              className="w-full py-6 text-lg"
            >
              {t('personalInfo.generateStyles')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              {t('personalInfo.backToPhoto')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};