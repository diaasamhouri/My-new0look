import { Button } from "@/components/ui/button";
import { Check, Camera, Trash2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface PhotoPreviewProps {
  selectedPhoto: string;
  capturedPhotos: string[];
  onConfirm: () => void;
  onRetake: () => void;
  onSelectPhoto: (photo: string) => void;
  onDeletePhoto: (photo: string) => void;
}

export const PhotoPreview = ({ 
  selectedPhoto, 
  capturedPhotos, 
  onConfirm, 
  onRetake, 
  onSelectPhoto, 
  onDeletePhoto 
}: PhotoPreviewProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <img
          src={selectedPhoto}
          alt="Captured photo"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Show captured photos if multiple */}
      {capturedPhotos.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">{t('camera.chooseBest')}</p>
          <div className="flex space-x-2 overflow-x-auto">
            {capturedPhotos.map((photo, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    selectedPhoto === photo ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => onSelectPhoto(photo)}
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5"
                  onClick={() => onDeletePhoto(photo)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={onConfirm}
          variant="warm"
          className="flex-1 py-4"
        >
          <Check className="w-4 h-4 mr-2" />
          {t('camera.useThisPhoto')}
        </Button>
        
        <Button
          onClick={onRetake}
          variant="outline"
          className="py-4"
        >
          <Camera className="w-4 h-4 mr-2" />
          {t('camera.retake')}
        </Button>
      </div>
    </div>
  );
};