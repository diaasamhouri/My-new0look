import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecommendationRequest {
  userId: string
  currentOutfitId?: string
  recommendationType: 'similar_users' | 'style_based' | 'emotion_based' | 'hybrid'
  limit?: number
}

interface RecommendationResult {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { userId, currentOutfitId, recommendationType, limit = 10 }: RecommendationRequest = await req.json()

    console.log('Generating recommendations for user:', userId, 'type:', recommendationType)

    // Get user preferences and analytics
    const userProfile = await getUserProfile(supabase, userId)
    const userAnalytics = await getUserAnalytics(supabase, userId)
    
    let recommendations: any[] = []
    let similarUsers: any[] = []

    switch (recommendationType) {
      case 'similar_users':
        const result = await generateSimilarUserRecommendations(supabase, userId, userProfile, limit)
        recommendations = result.recommendations
        similarUsers = result.similarUsers
        break
      
      case 'style_based':
        recommendations = await generateStyleBasedRecommendations(supabase, userId, userProfile, userAnalytics, limit)
        break
        
      case 'emotion_based':
        recommendations = await generateEmotionBasedRecommendations(supabase, userId, userAnalytics, limit)
        break
        
      case 'hybrid':
        const hybridResult = await generateHybridRecommendations(supabase, userId, userProfile, userAnalytics, limit)
        recommendations = hybridResult.recommendations
        similarUsers = hybridResult.similarUsers
        break
    }

    // Generate insights
    const insights = await generateUserInsights(supabase, userId, userAnalytics, recommendations)

    // Store recommendations for future analysis
    await storeRecommendations(supabase, userId, recommendations, recommendationType)

    const result: RecommendationResult = {
      recommendations: recommendations.slice(0, limit),
      similarUsers,
      insights
    }

    console.log('Generated', recommendations.length, 'recommendations for user:', userId)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in user recommendations:', error)
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred', 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function getUserProfile(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { profile, preferences }
}

async function getUserAnalytics(supabase: any, userId: string) {
  const { data: analytics } = await supabase
    .from('outfit_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(100)

  const { data: emotions } = await supabase
    .from('emotion_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: savedOutfits } = await supabase
    .from('saved_outfits')
    .select('*')
    .eq('user_id', userId)

  return { analytics, emotions, savedOutfits }
}

async function generateSimilarUserRecommendations(supabase: any, userId: string, userProfile: any, limit: number) {
  // Calculate user similarities using collaborative filtering
  await calculateUserSimilarities(supabase, userId, userProfile)

  // Get top similar users
  const { data: similarUsers } = await supabase
    .from('user_similarities')
    .select('user_b_id, similarity_score, shared_preferences')
    .eq('user_a_id', userId)
    .order('similarity_score', { ascending: false })
    .limit(10)

  if (!similarUsers || similarUsers.length === 0) {
    return { recommendations: [], similarUsers: [] }
  }

  const recommendations: any[] = []

  // Get outfits liked by similar users
  for (const similarUser of similarUsers) {
    const { data: likedOutfits } = await supabase
      .from('outfit_analytics')
      .select('outfit_data')
      .eq('user_id', similarUser.user_b_id)
      .eq('interaction_type', 'like')
      .limit(5)

    if (likedOutfits) {
      for (const outfit of likedOutfits) {
        recommendations.push({
          outfit: outfit.outfit_data,
          score: similarUser.similarity_score * 0.9,
          reason: `Users with similar style preferences liked this outfit`,
          source: 'collaborative_filtering'
        })
      }
    }
  }

  // Remove duplicates and sort by score
  const uniqueRecommendations = removeDuplicateRecommendations(recommendations)
    .sort((a, b) => b.score - a.score)

  return {
    recommendations: uniqueRecommendations,
    similarUsers: similarUsers.map(user => ({
      userId: user.user_b_id,
      similarityScore: user.similarity_score,
      sharedPreferences: user.shared_preferences?.preferences || []
    }))
  }
}

async function generateStyleBasedRecommendations(supabase: any, userId: string, userProfile: any, userAnalytics: any, limit: number) {
  const recommendations: any[] = []

  // Analyze user's preferred styles from analytics
  const stylePreferences = analyzeStylePreferences(userAnalytics.analytics)
  const colorPreferences = analyzeColorPreferences(userAnalytics.analytics, userAnalytics.savedOutfits)

  // Get outfits from public posts that match preferences
  const { data: communityOutfits } = await supabase
    .from('community_posts')
    .select('id, images, tags, likes_count')
    .not('images', 'is', null)
    .order('likes_count', { ascending: false })
    .limit(50)

  if (communityOutfits) {
    for (const post of communityOutfits) {
      const matchScore = calculateStyleMatchScore(post, stylePreferences, colorPreferences)
      
      if (matchScore > 0.6) {
        recommendations.push({
          outfit: {
            id: post.id,
            images: post.images,
            tags: post.tags,
            likes_count: post.likes_count
          },
          score: matchScore,
          reason: `Matches your preferred style: ${stylePreferences.join(', ')}`,
          source: 'style_analysis'
        })
      }
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)
}

async function generateEmotionBasedRecommendations(supabase: any, userId: string, userAnalytics: any, limit: number) {
  const recommendations: any[] = []

  if (!userAnalytics.emotions || userAnalytics.emotions.length === 0) {
    return recommendations
  }

  // Analyze emotional responses to different outfit types
  const emotionalPatterns = analyzeEmotionalPatterns(userAnalytics.emotions)

  // Find outfit styles that generated positive emotions
  const positiveOutfitIds = userAnalytics.emotions
    .filter(emotion => emotion.engagement_score > 0.7)
    .map(emotion => emotion.outfit_id)

  if (positiveOutfitIds.length > 0) {
    // Generate similar outfit recommendations
    const { data: positiveOutfits } = await supabase
      .from('outfit_analytics')
      .select('outfit_data, style_category')
      .in('outfit_data->id', positiveOutfitIds)

    if (positiveOutfits) {
      for (const outfit of positiveOutfits) {
        recommendations.push({
          outfit: outfit.outfit_data,
          score: 0.85,
          reason: `Similar to outfits that made you happy`,
          source: 'emotion_analysis'
        })
      }
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)
}

async function generateHybridRecommendations(supabase: any, userId: string, userProfile: any, userAnalytics: any, limit: number) {
  // Combine multiple recommendation strategies
  const similarUserRecs = await generateSimilarUserRecommendations(supabase, userId, userProfile, limit / 2)
  const styleRecs = await generateStyleBasedRecommendations(supabase, userId, userProfile, userAnalytics, limit / 2)
  const emotionRecs = await generateEmotionBasedRecommendations(supabase, userId, userAnalytics, limit / 2)

  // Merge and weight recommendations
  const allRecommendations = [
    ...similarUserRecs.recommendations.map(rec => ({ ...rec, score: rec.score * 0.4 })),
    ...styleRecs.map(rec => ({ ...rec, score: rec.score * 0.4 })),
    ...emotionRecs.map(rec => ({ ...rec, score: rec.score * 0.2 }))
  ]

  const uniqueRecommendations = removeDuplicateRecommendations(allRecommendations)
    .sort((a, b) => b.score - a.score)

  return {
    recommendations: uniqueRecommendations,
    similarUsers: similarUserRecs.similarUsers
  }
}

async function calculateUserSimilarities(supabase: any, userId: string, userProfile: any) {
  // Get all users for similarity calculation
  const { data: allUsers } = await supabase
    .from('user_preferences')
    .select('user_id, preferred_styles, preferred_colors, style_personality')
    .neq('user_id', userId)

  if (!allUsers) return

  const userPrefs = userProfile.preferences
  const similarities: any[] = []

  for (const otherUser of allUsers) {
    const similarityScore = calculateCosineSimilarity(userPrefs, otherUser)
    
    if (similarityScore > 0.3) {
      similarities.push({
        user_a_id: userId,
        user_b_id: otherUser.user_id,
        similarity_score: similarityScore,
        shared_preferences: {
          preferences: findSharedPreferences(userPrefs, otherUser)
        }
      })
    }
  }

  // Upsert similarities
  if (similarities.length > 0) {
    const { error } = await supabase
      .from('user_similarities')
      .upsert(similarities, { onConflict: 'user_a_id,user_b_id' })

    if (error) {
      console.error('Error upserting similarities:', error)
    }
  }
}

function calculateCosineSimilarity(userA: any, userB: any): number {
  if (!userA || !userB) return 0

  // Compare preferred styles
  const stylesA = userA.preferred_styles || []
  const stylesB = userB.preferred_styles || []
  const styleOverlap = stylesA.filter(style => stylesB.includes(style)).length
  const styleScore = styleOverlap / Math.max(stylesA.length, stylesB.length, 1)

  // Compare preferred colors
  const colorsA = userA.preferred_colors || []
  const colorsB = userB.preferred_colors || []
  const colorOverlap = colorsA.filter(color => colorsB.includes(color)).length
  const colorScore = colorOverlap / Math.max(colorsA.length, colorsB.length, 1)

  // Weighted similarity score
  return (styleScore * 0.6) + (colorScore * 0.4)
}

function findSharedPreferences(userA: any, userB: any): string[] {
  const shared: string[] = []
  
  if (userA.preferred_styles && userB.preferred_styles) {
    shared.push(...userA.preferred_styles.filter(style => userB.preferred_styles.includes(style)))
  }
  
  if (userA.preferred_colors && userB.preferred_colors) {
    shared.push(...userA.preferred_colors.filter(color => userB.preferred_colors.includes(color)))
  }

  return shared
}

function analyzeStylePreferences(analytics: any[]): string[] {
  if (!analytics) return []

  const styleCount = {}
  analytics.forEach(item => {
    if (item.style_category && item.interaction_type === 'like') {
      styleCount[item.style_category] = (styleCount[item.style_category] || 0) + 1
    }
  })

  return Object.entries(styleCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([style]) => style)
}

function analyzeColorPreferences(analytics: any[], savedOutfits: any[]): string[] {
  const colorCount = {}
  
  // Analyze from analytics
  analytics?.forEach(item => {
    if (item.color_palette && item.interaction_type === 'like') {
      item.color_palette.forEach(color => {
        colorCount[color] = (colorCount[color] || 0) + 1
      })
    }
  })

  // Analyze from saved outfits
  savedOutfits?.forEach(outfit => {
    if (outfit.outfit_data?.colorPalette) {
      outfit.outfit_data.colorPalette.forEach(color => {
        colorCount[color] = (colorCount[color] || 0) + 1
      })
    }
  })

  return Object.entries(colorCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color)
}

function calculateStyleMatchScore(post: any, stylePreferences: string[], colorPreferences: string[]): number {
  let score = 0

  // Check style tags
  if (post.tags && stylePreferences.length > 0) {
    const matchingStyles = post.tags.filter(tag => stylePreferences.includes(tag))
    score += (matchingStyles.length / stylePreferences.length) * 0.6
  }

  // Popularity boost
  if (post.likes_count > 10) {
    score += 0.2
  }

  return Math.min(score, 1)
}

function analyzeEmotionalPatterns(emotions: any[]): any {
  const patterns = {
    positive_styles: [],
    negative_styles: [],
    preferred_engagement_range: [0, 1]
  }

  if (emotions.length === 0) return patterns

  const positiveEmotions = emotions.filter(e => e.engagement_score > 0.7)
  const negativeEmotions = emotions.filter(e => e.engagement_score < 0.3)

  patterns.positive_styles = positiveEmotions.map(e => e.emotion_data?.dominant_emotion).filter(Boolean)
  patterns.negative_styles = negativeEmotions.map(e => e.emotion_data?.dominant_emotion).filter(Boolean)

  const engagementScores = emotions.map(e => e.engagement_score).sort((a, b) => a - b)
  patterns.preferred_engagement_range = [
    engagementScores[Math.floor(engagementScores.length * 0.25)],
    engagementScores[Math.floor(engagementScores.length * 0.75)]
  ]

  return patterns
}

function removeDuplicateRecommendations(recommendations: any[]): any[] {
  const seen = new Set()
  return recommendations.filter(rec => {
    const key = rec.outfit?.id || JSON.stringify(rec.outfit)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

async function generateUserInsights(supabase: any, userId: string, userAnalytics: any, recommendations: any[]) {
  const styleCategories = analyzeStylePreferences(userAnalytics.analytics)
  const colors = analyzeColorPreferences(userAnalytics.analytics, userAnalytics.savedOutfits)
  
  // Determine style personality
  let stylePersonality = 'Explorer'
  if (styleCategories.includes('formal')) stylePersonality = 'Professional'
  else if (styleCategories.includes('casual')) stylePersonality = 'Comfortable'
  else if (styleCategories.includes('traditional')) stylePersonality = 'Classic'
  else if (styleCategories.includes('sportswear')) stylePersonality = 'Active'

  // Calculate confidence range from recommendations
  const confidenceScores = recommendations.map(r => r.score).filter(Boolean)
  const confidenceRange: [number, number] = confidenceScores.length > 0 
    ? [Math.min(...confidenceScores), Math.max(...confidenceScores)]
    : [0.5, 0.8]

  return {
    topCategories: styleCategories.slice(0, 3),
    recommendedColors: colors.slice(0, 5),
    stylePersonality,
    confidenceRange
  }
}

async function storeRecommendations(supabase: any, userId: string, recommendations: any[], type: string) {
  const records = recommendations.slice(0, 10).map(rec => ({
    user_id: userId,
    recommended_outfit: rec.outfit,
    recommendation_type: type,
    confidence_score: rec.score,
    source_data: {
      reason: rec.reason,
      source: rec.source
    }
  }))

  if (records.length > 0) {
    const { error } = await supabase
      .from('outfit_recommendations')
      .insert(records)

    if (error) {
      console.error('Error storing recommendations:', error)
    }
  }
}