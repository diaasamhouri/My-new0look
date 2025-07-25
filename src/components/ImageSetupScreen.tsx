import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useCameraCapture } from "@/hooks/useCameraCapture";
import { CameraPreview } from "./camera/CameraPreview";
import { CameraControls } from "./camera/CameraControls";
import { PhotoPreview } from "./camera/PhotoPreview";
import { UploadButton } from "./camera/UploadButton";
import { useTranslation } from 'react-i18next';

interface ImageSetupScreenProps {
  onImageCapture: (imageData: string) => void;
  onBack: () => void;
}

export const ImageSetupScreen = ({ onImageCapture, onBack }: ImageSetupScreenProps) => {
  const { t } = useTranslation();
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
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-confidence rounded-full flex items-center justify-center animate-gentle-bounce">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t('imageSetup.sharePhoto')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('imageSetup.chooseMethod')}
            </p>
            
            {/* Enhanced privacy reminder */}
            <div className="bg-gradient-to-r from-healing-green/10 to-healing-blue/10 rounded-lg p-3 border border-healing-green/20">
              <p className="text-xs text-foreground/80">
                🔒 <span className="font-medium">{t('imageSetup.privacyProtected')}</span> {t('imageSetup.privacyDescription')}
              </p>
            </div>
          </div>

          {cameraMode === 'none' && (
            <div className="space-y-4">
              <Button
                onClick={startCamera}
                variant="default"
                className="w-full py-6 text-lg"
              >
                <Camera className="w-6 h-6 mr-3" />
                {t('imageSetup.takeAPhoto')}
              </Button>

              <div className="text-center text-sm text-muted-foreground">{t('imageSetup.or')}</div>

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
            {t('imageSetup.backToWelcome')}
          </Button>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Card>
    </div>
  );
};