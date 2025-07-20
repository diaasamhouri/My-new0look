import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmotionAnalysisRequest {
  imageData: string // base64 encoded image
  outfitId: string
  sessionId?: string
  userId?: string
}

interface EmotionResult {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { imageData, outfitId, sessionId, userId }: EmotionAnalysisRequest = await req.json()

    console.log('Starting emotion analysis for outfit:', outfitId)

    // Analyze facial expression using OpenAI GPT-4 Vision
    const emotionResult = await analyzeEmotionWithOpenAI(OPENAI_API_KEY, imageData)

    // Calculate engagement score based on emotions
    const engagementScore = calculateEngagementScore(emotionResult.emotions)

    // Generate personalized recommendations
    const recommendations = generateEmotionBasedRecommendations(emotionResult, engagementScore)

    const result: EmotionResult = {
      emotions: emotionResult.emotions,
      dominantEmotion: emotionResult.dominantEmotion,
      confidence: emotionResult.confidence,
      engagementScore,
      recommendations
    }

    // Store emotion analytics (privacy-conscious)
    const analyticsData = {
      user_id: userId || null, // Allow anonymous tracking
      outfit_id: outfitId,
      emotion_data: {
        dominant_emotion: result.dominantEmotion,
        engagement_score: engagementScore,
        confidence: result.confidence,
        emotion_distribution: result.emotions
      },
      engagement_score: engagementScore,
      session_id: sessionId
    }

    const { error: insertError } = await supabase
      .from('emotion_analytics')
      .insert(analyticsData)

    if (insertError) {
      console.error('Error storing emotion analytics:', insertError)
    }

    // Track AI model performance
    await trackEmotionModelPerformance(supabase, {
      model_type: 'emotion_analysis',
      model_version: 'openai_gpt4_vision_v1',
      performance_metrics: {
        confidence: result.confidence,
        engagement_score: engagementScore,
        dominant_emotion: result.dominantEmotion
      },
      user_feedback_score: engagementScore
    })

    console.log('Emotion analysis completed:', result.dominantEmotion, 'with confidence:', result.confidence)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in emotion analysis:', error)
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred', 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function analyzeEmotionWithOpenAI(apiKey: string, imageData: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert emotion analysis AI. Analyze facial expressions in images and provide detailed emotion scores. 
          Respond with a JSON object containing:
          - emotions: object with scores 0-1 for happiness, surprise, neutral, sadness, anger, fear, disgust
          - dominantEmotion: string of the highest scoring emotion
          - confidence: overall confidence score 0-1 for the analysis
          
          Focus on subtle facial cues, micro-expressions, and overall demeanor. Be sensitive to cultural differences in expression.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze the facial expression and emotions in this image of someone viewing an outfit recommendation.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const emotionData = JSON.parse(jsonMatch[0])
      return emotionData
    } else {
      throw new Error('No JSON found in response')
    }
  } catch (parseError) {
    console.error('Error parsing emotion analysis response:', parseError)
    // Fallback to neutral analysis
    return {
      emotions: {
        happiness: 0.5,
        surprise: 0.1,
        neutral: 0.7,
        sadness: 0.1,
        anger: 0.05,
        fear: 0.05,
        disgust: 0.05
      },
      dominantEmotion: 'neutral',
      confidence: 0.5
    }
  }
}

function calculateEngagementScore(emotions: any): number {
  // Positive emotions contribute more to engagement
  const positiveWeight = (emotions.happiness * 0.4) + (emotions.surprise * 0.2)
  const neutralWeight = emotions.neutral * 0.1
  const negativeWeight = (emotions.sadness + emotions.anger + emotions.fear + emotions.disgust) * -0.1

  const rawScore = positiveWeight + neutralWeight + negativeWeight + 0.5 // Base engagement
  return Math.max(0, Math.min(1, rawScore))
}

function generateEmotionBasedRecommendations(emotionResult: any, engagementScore: number): string[] {
  const recommendations: string[] = []

  if (emotionResult.dominantEmotion === 'happiness' && engagementScore > 0.7) {
    recommendations.push('This style resonates well with you! Consider similar designs.')
    recommendations.push('Save this outfit to your favorites for easy access.')
  } else if (emotionResult.dominantEmotion === 'neutral' || engagementScore < 0.5) {
    recommendations.push('Try exploring different color combinations for this style.')
    recommendations.push('Consider adjusting the occasion or seasonal preferences.')
    recommendations.push('Explore similar styles with different fits or accessories.')
  } else if (emotionResult.dominantEmotion === 'surprise') {
    recommendations.push('This unexpected style choice could be a new direction for you!')
    recommendations.push('Consider gradually incorporating elements from this look.')
  } else if (['sadness', 'anger', 'disgust'].includes(emotionResult.dominantEmotion)) {
    recommendations.push('Let\'s find styles that better match your preferences.')
    recommendations.push('Try a different category or adjust your style filters.')
    recommendations.push('Consider updating your profile preferences for better matches.')
  }

  // General engagement boosters
  if (engagementScore < 0.6) {
    recommendations.push('Explore our personalized recommendations based on users similar to you.')
    recommendations.push('Try our virtual wardrobe feature to see how pieces work together.')
  }

  return recommendations
}

async function trackEmotionModelPerformance(supabase: any, metrics: any) {
  try {
    const { error } = await supabase
      .from('ai_model_performance')
      .insert(metrics)

    if (error) {
      console.error('Error tracking emotion model performance:', error)
    }
  } catch (error) {
    console.error('Error in trackEmotionModelPerformance:', error)
  }
}