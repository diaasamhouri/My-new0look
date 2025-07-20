import React, { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, CameraOff, Eye, Heart, Smile, Frown, Meh } from 'lucide-react'
import { useEnhancedAI, EmotionResult } from '@/hooks/useEnhancedAI'
import { useToast } from '@/components/ui/use-toast'

interface EmotionTrackerProps {
  outfitId: string
  onEmotionAnalyzed: (emotion: EmotionResult) => void
  className?: string
}

const EmotionTracker: React.FC<EmotionTrackerProps> = ({
  outfitId,
  onEmotionAnalyzed,
  className = ""
}) => {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { analyzeEmotion, isAnalyzingEmotion } = useEnhancedAI()
  const { toast } = useToast()

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happiness': return <Smile className="h-4 w-4 text-green-500" />
      case 'sadness': return <Frown className="h-4 w-4 text-blue-500" />
      case 'neutral': return <Meh className="h-4 w-4 text-gray-500" />
      case 'surprise': return <Eye className="h-4 w-4 text-yellow-500" />
      default: return <Heart className="h-4 w-4 text-pink-500" />
    }
  }

  const getEngagementColor = (score: number) => {
    if (score > 0.7) return 'bg-green-500'
    if (score > 0.4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const startTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsTracking(true)
        setPermissionGranted(true)
        
        toast({
          title: "Emotion Tracking Started",
          description: "We'll analyze your facial expressions to improve outfit recommendations",
        })
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setPermissionGranted(false)
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to enable emotion tracking",
        variant: "destructive",
      })
    }
  }

  const stopTracking = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsTracking(false)
    setCurrentEmotion(null)
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !isTracking) return

    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8)

      // Analyze emotion
      const emotionResult = await analyzeEmotion(imageData, outfitId)
      setCurrentEmotion(emotionResult)
      onEmotionAnalyzed(emotionResult)

      toast({
        title: `Emotion Detected: ${emotionResult.dominantEmotion}`,
        description: `Engagement Score: ${Math.round(emotionResult.engagementScore * 100)}%`,
      })
    } catch (error) {
      console.error('Error analyzing emotion:', error)
    }
  }

  // Auto-analyze every 3 seconds when tracking
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      captureAndAnalyze()
    }, 3000)

    return () => clearInterval(interval)
  }, [isTracking, outfitId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [])

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <span className="font-medium">Emotion Tracking</span>
            {isAnalyzingEmotion && (
              <Badge variant="secondary" className="animate-pulse">
                Analyzing...
              </Badge>
            )}
          </div>
          
          <Button
            size="sm"
            variant={isTracking ? "destructive" : "default"}
            onClick={isTracking ? stopTracking : startTracking}
            disabled={isAnalyzingEmotion}
          >
            {isTracking ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Camera Preview */}
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-48 object-cover rounded-lg bg-gray-100 ${
              isTracking ? 'block' : 'hidden'
            }`}
          />
          
          {!isTracking && permissionGranted !== false && (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click "Start" to begin emotion tracking</p>
              </div>
            </div>
          )}

          {permissionGranted === false && (
            <div className="w-full h-48 bg-red-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-red-600">
                <CameraOff className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Camera access required for emotion tracking</p>
              </div>
            </div>
          )}
        </div>

        {/* Current Emotion Display */}
        {currentEmotion && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getEmotionIcon(currentEmotion.dominantEmotion)}
                <span className="font-medium capitalize">
                  {currentEmotion.dominantEmotion}
                </span>
                <Badge variant="outline">
                  {Math.round(currentEmotion.confidence * 100)}% confident
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Engagement:</span>
                <div className={`h-2 w-16 rounded-full ${getEngagementColor(currentEmotion.engagementScore)}`}>
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${currentEmotion.engagementScore * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(currentEmotion.engagementScore * 100)}%
                </span>
              </div>
            </div>

            {/* Emotion Recommendations */}
            {currentEmotion.recommendations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium mb-2">AI Recommendations:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {currentEmotion.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Privacy Notice */}
        <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
          🔒 Privacy: Emotion analysis is processed securely and helps improve your outfit recommendations. 
          Data is stored anonymously and can be disabled at any time.
        </div>
      </CardContent>
    </Card>
  )
}

export default EmotionTracker