import { Button } from "@/components/ui/button";
import { SwitchCamera, RotateCcw } from "lucide-react";

interface CameraControlsProps {
  onCapture: () => void;
  onSwitchCamera: () => void;
  onStopCamera: () => void;
}

export const CameraControls = ({ onCapture, onSwitchCamera, onStopCamera }: CameraControlsProps) => {
  return (
    <div className="flex space-x-3">
      <Button
        onClick={onCapture}
        variant="warm"
        className="flex-1 py-4"
      >
        Take Photo
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