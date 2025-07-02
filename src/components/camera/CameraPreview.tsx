import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader, RotateCcw } from "lucide-react";

interface CameraPreviewProps {
  isLoading: boolean;
  isVideoReady: boolean;
  cameraError: string;
  onStartCamera: () => void;
}

export const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(
  ({ isLoading, isVideoReady, cameraError, onStartCamera }, ref) => {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={ref}
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
                onClick={onStartCamera}
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
    );
  }
);

CameraPreview.displayName = "CameraPreview";