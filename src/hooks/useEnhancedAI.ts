import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export interface EnhancedOutfit {
  id: string
  category: string
  imageUrl: string
  description: string
  confidence: number
  colorPalette: string[]
  fabricTypes: string[]
  styleNotes: string[]
  occasions: string[]
  aiEnhancements: {
    colorHarmony: number
    proportionAnalysis: number
    adaptiveFeatures: string[]
    confidenceFactors: string[]
  }
}

export interface EmotionResult {
  emotions: {
    happiness: number
    surprise: number
    neutral: number
    sadness: number
    anger: number
    fear: number
    disgust: number
  }
  dominantEmotion: string
  confidence: number
  engagementScore: number
  recommendations: string[]
}

export interface RecommendationResult {
  recommendations: Array<{
    outfit: any
    score: number
    reason: string
    source: string
  }>
  similarUsers: Array<{
    userId: string
    similarityScore: number
    sharedPreferences: string[]
  }>
  insights: {
    topCategories: string[]
    recommendedColors: string[]
    stylePersonality: string
    confidenceRange: [number, number]
  }
}

export const useEnhancedAI = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzingEmotion, setIsAnalyzingEmotion] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const { toast } = useToast()

  const generateEnhancedOutfits = useCallback(async (
    imageData: string | undefined,
    personalInfo: any,
    selectedStyles: string[],
    enhancementLevel: 'standard' | 'premium' | 'ultra' = 'standard'
  ): Promise<EnhancedOutfit[]> => {
    setIsGenerating(true)
    
    try {
      console.log('Generating enhanced outfits with level:', enhancementLevel)
      
      const { data, error } = await supabase.functions.invoke('enhanced-outfit-generation', {
        body: {
          imageData,
          personalInfo,
          selectedStyles,
          enhancementLevel
        }
      })

      if (error) {
        console.error('Enhanced outfit generation error:', error)
        throw error
      }

      if (!data?.outfits) {
        throw new Error('No outfits returned from enhanced generation')
      }

      toast({
        title: "Enhanced Outfits Generated",
        description: `Generated ${data.outfits.length} AI-enhanced outfits with ${enhancementLevel} quality`,
      })

      return data.outfits
    } catch (error) {
      console.error('Error generating enhanced outfits:', error)
      toast({
        title: "Generation Error",
        description: "Failed to generate enhanced outfits. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [toast])

  const analyzeEmotion = useCallback(async (
    imageData: string,
    outfitId: string,
    sessionId?: string
  ): Promise<EmotionResult> => {
    setIsAnalyzingEmotion(true)

    try {
      console.log('Analyzing emotion for outfit:', outfitId)

      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: {
          imageData,
          outfitId,
          sessionId: sessionId || crypto.randomUUID(),
          userId: user?.id
        }
      })

      if (error) {
        console.error('Emotion analysis error:', error)
        throw error
      }

      console.log('Emotion analysis result:', data.dominantEmotion, 'engagement:', data.engagementScore)

      return data
    } catch (error) {
      console.error('Error analyzing emotion:', error)
      toast({
        title: "Analysis Error",
        description: "Failed to analyze emotional response. Continuing without emotion data.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsAnalyzingEmotion(false)
    }
  }, [toast])

  const getUserRecommendations = useCallback(async (
    recommendationType: 'similar_users' | 'style_based' | 'emotion_based' | 'hybrid' = 'hybrid',
    currentOutfitId?: string,
    limit: number = 10
  ): Promise<RecommendationResult> => {
    setIsLoadingRecommendations(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to get recommendations')
      }

      console.log('Getting recommendations for user:', user.id, 'type:', recommendationType)

      const { data, error } = await supabase.functions.invoke('user-recommendations', {
        body: {
          userId: user.id,
          currentOutfitId,
          recommendationType,
          limit
        }
      })

      if (error) {
        console.error('Recommendations error:', error)
        throw error
      }

      console.log('Generated', data.recommendations.length, 'recommendations')

      return data
    } catch (error) {
      console.error('Error getting recommendations:', error)
      toast({
        title: "Recommendations Error",
        description: "Failed to load personalized recommendations.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoadingRecommendations(false)
    }
  }, [toast])

  const trackOutfitInteraction = useCallback(async (
    outfitId: string,
    interactionType: 'view' | 'like' | 'dislike' | 'save' | 'share',
    outfitData?: any,
    emotionData?: EmotionResult
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const analyticsData = {
        user_id: user?.id,
        outfit_data: outfitData || { id: outfitId },
        interaction_type: interactionType,
        confidence_score: outfitData?.confidence || null,
        style_category: outfitData?.category || null,
        color_palette: outfitData?.colorPalette || null
      }

      const { error } = await supabase
        .from('outfit_analytics')
        .insert(analyticsData)

      if (error) {
        console.error('Error tracking outfit interaction:', error)
      }

      // Track emotion data if provided
      if (emotionData && user?.id) {
        const emotionAnalyticsData = {
          user_id: user.id,
          outfit_id: outfitId,
          emotion_data: {
            dominant_emotion: emotionData.dominantEmotion,
            engagement_score: emotionData.engagementScore,
            confidence: emotionData.confidence,
            emotion_distribution: emotionData.emotions
          },
          engagement_score: emotionData.engagementScore
        }

        const { error: emotionError } = await supabase
          .from('emotion_analytics')
          .insert(emotionAnalyticsData)

        if (emotionError) {
          console.error('Error tracking emotion analytics:', emotionError)
        }
      }
    } catch (error) {
      console.error('Error in trackOutfitInteraction:', error)
    }
  }, [])

  const getAIInsights = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      // Get user's recent analytics
      const { data: analytics } = await supabase
        .from('outfit_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50)

      // Get emotion analytics
      const { data: emotions } = await supabase
        .from('emotion_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      // Calculate insights
      const stylePreferences = analytics?.reduce((acc, item) => {
        if (item.style_category && item.interaction_type === 'like') {
          acc[item.style_category] = (acc[item.style_category] || 0) + 1
        }
        return acc
      }, {}) || {}

      const emotionalPatterns = emotions?.reduce((acc, item) => {
        const emotionData = item.emotion_data as any
        const emotion = emotionData?.dominant_emotion
        if (emotion) {
          acc[emotion] = (acc[emotion] || 0) + 1
        }
        return acc
      }, {}) || {}

      const avgEngagement = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.engagement_score || 0), 0) / emotions.length
        : 0.5

      return {
        stylePreferences,
        emotionalPatterns,
        averageEngagement: avgEngagement,
        totalInteractions: analytics?.length || 0,
        emotionDataPoints: emotions?.length || 0
      }
    } catch (error) {
      console.error('Error getting AI insights:', error)
      return null
    }
  }, [])

  return {
    generateEnhancedOutfits,
    analyzeEmotion,
    getUserRecommendations,
    trackOutfitInteraction,
    getAIInsights,
    isGenerating,
    isAnalyzingEmotion,
    isLoadingRecommendations
  }
}