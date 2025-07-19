import { Button } from "@/components/ui/button";
import { SwitchCamera, RotateCcw } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface CameraControlsProps {
  onCapture: () => void;
  onSwitchCamera: () => void;
  onStopCamera: () => void;
}

export const CameraControls = ({ onCapture, onSwitchCamera, onStopCamera }: CameraControlsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex space-x-3">
      <Button
        onClick={onCapture}
        variant="default"
        className="flex-1 py-4"
      >
        {t('camera.takePhoto')}
      </Button>
      
      <Button
        onClick={onSwitchCamera}
        variant="outline"
        className="py-4"
      >
        <SwitchCamera className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onStopCamera}
        variant="outline"
        className="py-4"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};