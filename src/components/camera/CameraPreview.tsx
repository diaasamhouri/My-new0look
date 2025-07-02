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
        
        {/* Enhanced Camera Guidelines - only show when video is ready */}
        {isVideoReady && !cameraError && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Instructions */}
            <div className="absolute top-4 left-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-center space-y-1">
                <p className="text-white text-xs font-medium">
                  📐 Stand 1-1.5 meters away
                </p>
                <p className="text-white/80 text-xs">
                  Center yourself • Choose good lighting • Clear background
                </p>
              </div>
            </div>
            
            {/* Center guide with enhanced visuals */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-36 h-44 border-2 border-healing-blue/70 rounded-lg shadow-lg backdrop-blur-sm"></div>
                {/* Corner guides */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-healing-blue rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-healing-blue rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-healing-blue rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-healing-blue rounded-br-lg"></div>
                {/* Center alignment dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-healing-blue rounded-full animate-confidence-pulse"></div>
              </div>
            </div>

            {/* Bottom Tips */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-2 backdrop-blur-sm">
              <p className="text-white/90 text-xs text-center">
                💡 <span className="font-medium">Pro tip:</span> Natural lighting works best • Face the camera directly
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";