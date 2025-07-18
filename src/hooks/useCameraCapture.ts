import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCameraCapture = () => {
  const [cameraMode, setCameraMode] = useState<'none' | 'photo' | 'live' | 'preview'>('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      setIsVideoReady(false);
      
      // Clear any existing timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      console.log('Starting camera with facingMode:', facingMode);
      
      // Enhanced constraints for better mobile experience
      const isMobile = window.innerWidth <= 768;
      const constraints = {
        video: {
          facingMode,
          width: { ideal: isMobile ? 720 : 640 },
          height: { ideal: isMobile ? 960 : 480 },
          frameRate: { ideal: 30 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', mediaStream);
      
      setStream(mediaStream);
      setCameraMode('live');
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set up event handlers before assigning stream
        const handleVideoReady = () => {
          console.log('Video is ready');
          setIsLoading(false);
          setIsVideoReady(true);
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            setLoadingTimeout(null);
          }
        };
        
        const handleVideoError = (e: Event) => {
          console.error('Video error:', e);
          setCameraError('Failed to display camera feed');
          setIsLoading(false);
        };
        
        // Multiple event listeners for better compatibility
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          handleVideoReady();
        };
        
        video.oncanplay = () => {
          console.log('Video can play');
          handleVideoReady();
        };
        
        video.onplaying = () => {
          console.log('Video is playing');
          handleVideoReady();
        };
        
        video.onerror = handleVideoError;
        
        // Assign stream and play
        video.srcObject = mediaStream;
        
        try {
          await video.play();
          console.log('Video play() called successfully');
        } catch (playError) {
          console.log('Video play() failed, but continuing:', playError);
        }
        
        // Fallback timeout - hide loading after 4 seconds regardless
        const timeout = setTimeout(() => {
          console.log('Loading timeout reached - forcing video ready state');
          setIsLoading(false);
          setIsVideoReady(true);
          setLoadingTimeout(null);
        }, 4000);
        
        setLoadingTimeout(timeout);
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
  }, [facingMode, loadingTimeout, toast]);

  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    if (stream) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  }, [facingMode, stream, startCamera]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode('none');
  }, [stream]);

  const capturePhoto = useCallback(() => {
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
  }, [stopCamera]);

  const deletePhoto = useCallback((photoToDelete: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo !== photoToDelete));
    if (selectedPhoto === photoToDelete) {
      setSelectedPhoto('');
    }
  }, [selectedPhoto]);

  const retakePhoto = useCallback(() => {
    setSelectedPhoto('');
    setCameraMode('none');
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        // Import background removal functions
        const { removeBackground, loadImage } = await import('@/lib/backgroundRemoval');
        
        try {
          // Load and process the image with background removal
          const imageElement = await loadImage(file);
          const processedBlob = await removeBackground(imageElement);
          
          // Convert processed blob to data URL
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            setCapturedPhotos([imageData]);
            setSelectedPhoto(imageData);
            setCameraMode('preview');
          };
          reader.readAsDataURL(processedBlob);
          
        } catch (bgError) {
          console.warn('Background removal failed, using original image:', bgError);
          
          // Fallback: use original image
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            setCapturedPhotos([imageData]);
            setSelectedPhoto(imageData);
            setCameraMode('preview');
          };
          reader.readAsDataURL(file);
        }
        
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }, []);

  return {
    // State
    cameraMode,
    capturedPhotos,
    selectedPhoto,
    isLoading,
    cameraError,
    isVideoReady,
    videoRef,
    canvasRef,
    
    // Actions
    startCamera,
    switchCamera,
    stopCamera,
    capturePhoto,
    deletePhoto,
    retakePhoto,
    handleFileUpload,
    setSelectedPhoto
  };
};
