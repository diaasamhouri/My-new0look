import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageSetupScreenProps {
  onImageCapture: (imageData: string) => void;
  onBack: () => void;
}

export const ImageSetupScreen = ({ onImageCapture, onBack }: ImageSetupScreenProps) => {
  const [cameraMode, setCameraMode] = useState<'none' | 'photo' | 'live'>('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setCameraMode('live');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access or try uploading a photo instead.",
        variant: "destructive"
      });
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
        stopCamera();
        onImageCapture(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        onImageCapture(imageData);
      };
      reader.readAsDataURL(file);
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
                  className="w-full h-64 object-cover"
                />
                
                {/* Camera Guidelines */}
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
                  onClick={stopCamera}
                  variant="outline"
                  className="py-4"
                >
                  <RotateCcw className="w-4 h-4" />
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