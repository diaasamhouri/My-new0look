import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface UploadButtonProps {
  onFileUpload: (file: File) => void;
}

export const UploadButton = ({ onFileUpload }: UploadButtonProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          className="w-full py-6 text-lg"
        >
          <Upload className="w-6 h-6 mr-3" />
          {t('imageSetup.uploadExisting')}
        </Button>

        {/* Upload suggestions */}
        <div className="bg-gradient-to-r from-healing-blue/5 to-healing-purple/5 rounded-lg p-3 border border-healing-blue/10">
          <div className="flex items-center space-x-2 mb-2">
            <Image className="w-4 h-4 text-healing-blue" />
            <p className="text-xs font-medium text-foreground">{t('imageSetup.bestPhotoTips')}</p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• {t('imageSetup.fullBodyBest')}</li>
            <li>• {t('imageSetup.goodLighting')}</li>
            <li>• {t('imageSetup.standStraight')}</li>
          </ul>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};