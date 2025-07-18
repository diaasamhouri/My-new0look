
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
          className="w-full min-h-[60vh] sm:min-h-[50vh] lg:h-96 object-cover"
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
        
        {/* Enhanced Camera Guidelines - responsive sizing */}
        {isVideoReady && !cameraError && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Instructions */}
            <div className="absolute top-4 left-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-center space-y-1">
                <p className="text-white text-xs sm:text-sm font-medium">
                  📐 Stand arm's length away (about 1 meter)
                </p>
                <p className="text-white/80 text-xs">
                  Use the frame below as your guide • Good lighting helps
                </p>
              </div>
            </div>
            
            {/* Center guide with responsive sizing */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Responsive frame - larger on mobile for better visibility */}
                <div className="w-48 h-60 sm:w-40 sm:h-48 lg:w-36 lg:h-44 border-2 border-healing-blue/70 rounded-lg shadow-lg backdrop-blur-sm"></div>
                {/* Corner guides */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-healing-blue rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-healing-blue rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-healing-blue rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-healing-blue rounded-br-lg"></div>
                {/* Center alignment dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-healing-blue rounded-full animate-confidence-pulse"></div>
              </div>
            </div>

            {/* Bottom Tips - mobile optimized */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-white/90 text-xs sm:text-sm text-center">
                💡 <span className="font-medium">Tip:</span> Fill the frame comfortably • Face the camera directly
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";
