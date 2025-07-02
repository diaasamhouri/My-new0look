import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useCameraCapture } from "@/hooks/useCameraCapture";
import { CameraPreview } from "./camera/CameraPreview";
import { CameraControls } from "./camera/CameraControls";
import { PhotoPreview } from "./camera/PhotoPreview";
import { UploadButton } from "./camera/UploadButton";

interface ImageSetupScreenProps {
  onImageCapture: (imageData: string) => void;
  onBack: () => void;
}

export const ImageSetupScreen = ({ onImageCapture, onBack }: ImageSetupScreenProps) => {
  const {
    cameraMode,
    capturedPhotos,
    selectedPhoto,
    isLoading,
    cameraError,
    isVideoReady,
    videoRef,
    canvasRef,
    startCamera,
    switchCamera,
    stopCamera,
    capturePhoto,
    deletePhoto,
    retakePhoto,
    handleFileUpload,
    setSelectedPhoto
  } = useCameraCapture();

  const confirmPhoto = () => {
    if (selectedPhoto) {
      onImageCapture(selectedPhoto);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-confidence flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Share Your Photo</h2>
            <p className="text-muted-foreground">
              Choose how you'd like to provide your image for styling
            </p>
          </div>

          {cameraMode === 'none' && (
            <div className="space-y-4">
              <Button
                onClick={startCamera}
                variant="healing"
                className="w-full py-6 text-lg"
              >
                <Camera className="w-6 h-6 mr-3" />
                Take a Photo
              </Button>

              <div className="text-center text-sm text-muted-foreground">or</div>

              <UploadButton onFileUpload={handleFileUpload} />
            </div>
          )}

          {cameraMode === 'live' && (
            <div className="space-y-4">
              <CameraPreview
                ref={videoRef}
                isLoading={isLoading}
                isVideoReady={isVideoReady}
                cameraError={cameraError}
                onStartCamera={startCamera}
              />

              <CameraControls
                onCapture={capturePhoto}
                onSwitchCamera={switchCamera}
                onStopCamera={stopCamera}
              />
            </div>
          )}

          {cameraMode === 'preview' && selectedPhoto && (
            <PhotoPreview
              selectedPhoto={selectedPhoto}
              capturedPhotos={capturedPhotos}
              onConfirm={confirmPhoto}
              onRetake={retakePhoto}
              onSelectPhoto={setSelectedPhoto}
              onDeletePhoto={deletePhoto}
            />
          )}

          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full"
          >
            Back to Welcome
          </Button>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Card>
    </div>
  );
};