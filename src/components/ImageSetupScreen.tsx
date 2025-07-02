import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, RotateCcw, SwitchCamera, Trash2, Check, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageSetupScreenProps {
  onImageCapture: (imageData: string) => void;
  onBack: () => void;
}

export const ImageSetupScreen = ({ onImageCapture, onBack }: ImageSetupScreenProps) => {
  const [cameraMode, setCameraMode] = useState<'none' | 'photo' | 'live' | 'preview'>('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      setIsVideoReady(false);
      
      console.log('Starting camera with facingMode:', facingMode);
      
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', mediaStream);
      
      setStream(mediaStream);
      setCameraMode('live');
      
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setIsLoading(false);
          setIsVideoReady(true);
        };
        
        video.onerror = (e) => {
          console.error('Video error:', e);
          setCameraError('Failed to display camera feed');
          setIsLoading(false);
        };
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      setIsLoading(false);
      
      let errorMessage = "Camera access failed";
      let description = "Please try uploading a photo instead.";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera Access Denied";
        description = "Please allow camera access in your browser settings.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No Camera Found";
        description = "No camera device was found on your device.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera In Use";
        description = "Camera is being used by another application.";
      }
      
      setCameraError(errorMessage);
      toast({
        title: errorMessage,
        description,
        variant: "destructive"
      });
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    if (stream) {
      stopCamera();
      // Small delay to ensure camera is fully stopped
      setTimeout(startCamera, 100);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode('none');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhotos(prev => [...prev, imageData]);
        setSelectedPhoto(imageData);
        setCameraMode('preview');
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedPhoto(imageData);
        setCameraMode('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (selectedPhoto) {
      onImageCapture(selectedPhoto);
    }
  };

  const retakePhoto = () => {
    setSelectedPhoto('');
    setCameraMode('none');
  };

  const deletePhoto = (photoToDelete: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo !== photoToDelete));
    if (selectedPhoto === photoToDelete) {
      setSelectedPhoto('');
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

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="confidence"
                className="w-full py-6 text-lg"
              >
                <Upload className="w-6 h-6 mr-3" />
                Upload Existing Photo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {cameraMode === 'live' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  webkit-playsinline="true"
                  className="w-full h-64 object-cover"
                />
                
                {/* Loading overlay */}
                {(isLoading || !isVideoReady) && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-white text-center space-y-2">
                      <Loader className="w-8 h-8 animate-spin mx-auto" />
                      <p className="text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
                {/* Error overlay */}
                {cameraError && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-white text-center space-y-4 p-4">
                      <p className="text-sm">{cameraError}</p>
                      <Button
                        onClick={startCamera}
                        variant="outline"
                        size="sm"
                        className="text-black"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Camera Guidelines - only show when video is ready */}
                {isVideoReady && !cameraError && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 right-4 bg-black/50 rounded p-2">
                      <p className="text-white text-xs text-center">
                        Stand 1-1.5 meters away • Center yourself • Good lighting
                      </p>
                    </div>
                    
                    {/* Center guide */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-40 border-2 border-white/50 rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={capturePhoto}
                  variant="warm"
                  className="flex-1 py-4"
                >
                  Take Photo
                </Button>
                
                <Button
                  onClick={switchCamera}
                  variant="outline"
                  className="py-4"
                >
                  <SwitchCamera className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="py-4"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {cameraMode === 'preview' && selectedPhoto && (
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
                  <p className="text-sm text-muted-foreground text-center">Choose your best photo:</p>
                  <div className="flex space-x-2 overflow-x-auto">
                    {capturedPhotos.map((photo, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                            selectedPhoto === photo ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedPhoto(photo)}
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-5 h-5"
                          onClick={() => deletePhoto(photo)}
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
                  onClick={confirmPhoto}
                  variant="warm"
                  className="flex-1 py-4"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use This Photo
                </Button>
                
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  className="py-4"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>
            </div>
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