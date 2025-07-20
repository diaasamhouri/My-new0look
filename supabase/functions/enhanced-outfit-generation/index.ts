import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OutfitRequest {
  imageData?: string
  personalInfo: {
    gender: string
    amputationType?: string
    usesProsthetic?: string
    bodyType?: string
    skinTone?: string
    preferences?: string[]
  }
  selectedStyles: string[]
  enhancementLevel?: 'standard' | 'premium' | 'ultra'
}

interface EnhancedOutfit {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!RUNWARE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { imageData, personalInfo, selectedStyles, enhancementLevel = 'standard' }: OutfitRequest = await req.json()

    console.log('Enhanced outfit generation request:', { personalInfo, selectedStyles, enhancementLevel })

    const outfits: EnhancedOutfit[] = []
    const startTime = Date.now()

    // Enhanced prompt generation with AI-driven improvements
    for (const style of selectedStyles) {
      const enhancedPrompt = await createEnhancedPrompt(style, personalInfo, enhancementLevel)
      console.log('Generated enhanced prompt:', enhancedPrompt)

      try {
        // Generate multiple images with Runware for better selection
        const imageResults = await generateWithRunware(RUNWARE_API_KEY, enhancedPrompt, enhancementLevel)
        
        for (const imageResult of imageResults) {
          const outfit: EnhancedOutfit = {
            id: crypto.randomUUID(),
            category: style,
            imageUrl: imageResult.imageURL,
            description: getEnhancedDescription(style, personalInfo),
            confidence: calculateEnhancedConfidence(style, personalInfo, imageResult),
            colorPalette: extractColorPalette(style, personalInfo),
            fabricTypes: getFabricRecommendations(style, personalInfo),
            styleNotes: getStyleNotes(style, personalInfo),
            occasions: getOccasions(style),
            aiEnhancements: {
              colorHarmony: analyzeColorHarmony(style, personalInfo),
              proportionAnalysis: analyzeProportions(personalInfo),
              adaptiveFeatures: getAdaptiveFeatures(personalInfo),
              confidenceFactors: getConfidenceFactors(style, personalInfo)
            }
          }
          outfits.push(outfit)
        }
      } catch (error) {
        console.error('Error generating outfit with Runware:', error)
        // Fallback with reduced confidence
        const fallbackOutfit = createFallbackOutfit(style, personalInfo)
        outfits.push(fallbackOutfit)
      }
    }

    const generationTime = Date.now() - startTime

    // Track AI model performance
    await trackModelPerformance(supabase, {
      model_type: 'enhanced_image_generation',
      model_version: 'runware_v1',
      performance_metrics: {
        generation_time_ms: generationTime,
        success_rate: outfits.length / selectedStyles.length,
        enhancement_level: enhancementLevel,
        outfits_generated: outfits.length
      },
      generation_time_ms: generationTime,
      success_rate: outfits.length / selectedStyles.length
    })

    console.log('Enhanced outfit generation completed:', outfits.length, 'outfits generated')

    return new Response(JSON.stringify({ outfits }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in enhanced outfit generation:', error)
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred', 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function generateWithRunware(apiKey: string, prompt: string, quality: string) {
  const imagesCount = quality === 'ultra' ? 3 : quality === 'premium' ? 2 : 1
  
  const response = await fetch('https://api.runware.ai/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        taskType: "authentication",
        apiKey: apiKey
      },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: prompt,
        model: "runware:100@1",
        width: 1024,
        height: 1024,
        numberResults: imagesCount,
        outputFormat: "WEBP",
        steps: quality === 'ultra' ? 8 : quality === 'premium' ? 6 : 4,
        CFGScale: quality === 'ultra' ? 2 : 1,
        scheduler: "FlowMatchEulerDiscreteScheduler"
      }
    ])
  })

  const result = await response.json()
  console.log('Runware response:', result)

  if (!result.data || result.data.length < 2) {
    throw new Error('Invalid response from Runware API')
  }

  return result.data.slice(1) // Skip authentication response
}

async function createEnhancedPrompt(category: string, personalInfo: any, enhancementLevel: string): Promise<string> {
  const basePrompt = createAmputationAwarePrompt(category, personalInfo)
  
  const enhancementPrompts = {
    standard: "high quality, professional photography, clean background",
    premium: "ultra high quality, professional fashion photography, studio lighting, detailed textures, vibrant colors",
    ultra: "ultra high resolution, award-winning fashion photography, perfect lighting, photorealistic, detailed fabric textures, color-graded, magazine quality"
  }

  const adaptiveElements = personalInfo.amputationType ? 
    `adaptive clothing design, inclusive fashion, ${getAdaptiveStylingGuidance(personalInfo.amputationType, personalInfo.usesProsthetic)}` : ""

  const colorGuidance = personalInfo.skinTone ? 
    `complementary colors for ${personalInfo.skinTone} skin tone, harmonious color palette` : ""

  return `${basePrompt}, ${enhancementPrompts[enhancementLevel]}, ${adaptiveElements}, ${colorGuidance}`.replace(/,\s*,/g, ',')
}

function createAmputationAwarePrompt(category: string, personalInfo: any): string {
  const basePrompts = {
    formal: "elegant formal outfit, business attire, sophisticated styling",
    casual: "comfortable casual wear, everyday fashion, relaxed styling", 
    sportswear: "athletic wear, performance clothing, active lifestyle",
    traditional: "cultural traditional clothing, heritage fashion, classic styling"
  }

  let prompt = basePrompts[category] || basePrompts.casual
  
  if (personalInfo.amputationType && personalInfo.usesProsthetic) {
    prompt += `, ${getAdaptiveStylingGuidance(personalInfo.amputationType, personalInfo.usesProsthetic)}`
  }

  return prompt
}

function getAdaptiveStylingGuidance(amputationType: string, usesProsthetic: string): string {
  const guidance = {
    'upper_limb': 'adaptive sleeves, easy-access fastenings, magnetic closures',
    'lower_limb': 'adaptable hemlines, comfortable fit around prosthetics, flexible waistbands',
    'partial_hand': 'easy-grip accessories, simplified fastenings, elegant adaptations',
    'partial_foot': 'comfortable footwear adaptations, stylish ankle support'
  }

  const baseGuidance = guidance[amputationType] || 'adaptive design elements'
  const prostheticNote = usesProsthetic === 'yes' ? 'prosthetic-friendly design' : 'natural adaptation styling'
  
  return `${baseGuidance}, ${prostheticNote}`
}

function calculateEnhancedConfidence(style: string, personalInfo: any, imageResult: any): number {
  let confidence = 0.8 // Base confidence for Runware

  // Adjust based on personalization factors
  if (personalInfo.amputationType && personalInfo.usesProsthetic) {
    confidence += 0.1 // Bonus for adaptive considerations
  }
  
  if (personalInfo.preferences && personalInfo.preferences.length > 0) {
    confidence += 0.05 * Math.min(personalInfo.preferences.length, 2)
  }

  // Quality-based adjustments
  if (imageResult.NSFWContent === false) {
    confidence += 0.05
  }

  return Math.min(confidence, 0.98)
}

function extractColorPalette(style: string, personalInfo: any): string[] {
  const palettes = {
    formal: ['navy', 'charcoal', 'white', 'burgundy'],
    casual: ['denim blue', 'white', 'khaki', 'forest green'],
    sportswear: ['black', 'white', 'electric blue', 'neon green'],
    traditional: ['gold', 'maroon', 'cream', 'royal blue']
  }
  
  return palettes[style] || palettes.casual
}

function getFabricRecommendations(style: string, personalInfo: any): string[] {
  const fabrics = {
    formal: ['wool', 'cotton blend', 'silk', 'linen'],
    casual: ['cotton', 'denim', 'jersey', 'fleece'],
    sportswear: ['polyester', 'spandex', 'moisture-wicking', 'breathable mesh'],
    traditional: ['silk', 'cotton', 'linen', 'brocade']
  }

  let recommendations = fabrics[style] || fabrics.casual

  if (personalInfo.amputationType) {
    recommendations = recommendations.filter(fabric => fabric !== 'stiff cotton')
    recommendations.push('soft cotton', 'bamboo blend')
  }

  return recommendations
}

function getStyleNotes(style: string, personalInfo: any): string[] {
  const notes = {
    formal: ['Classic silhouette', 'Professional appearance', 'Versatile pieces'],
    casual: ['Comfortable fit', 'Easy to style', 'Everyday versatility'],
    sportswear: ['Performance-focused', 'Moisture management', 'Flexibility'],
    traditional: ['Cultural authenticity', 'Timeless elegance', 'Heritage craftsmanship']
  }

  let styleNotes = notes[style] || notes.casual

  if (personalInfo.amputationType) {
    styleNotes.push('Adaptive design considerations', 'Enhanced accessibility features')
  }

  return styleNotes
}

function getOccasions(style: string): string[] {
  const occasions = {
    formal: ['Business meetings', 'Formal events', 'Professional networking'],
    casual: ['Daily wear', 'Weekend outings', 'Casual gatherings'],
    sportswear: ['Gym workouts', 'Outdoor activities', 'Sports events'],
    traditional: ['Cultural celebrations', 'Special ceremonies', 'Heritage events']
  }

  return occasions[style] || occasions.casual
}

function analyzeColorHarmony(style: string, personalInfo: any): number {
  // Simplified color harmony analysis
  let score = 0.8

  if (personalInfo.skinTone) {
    score += 0.1 // Bonus for skin tone consideration
  }

  if (personalInfo.preferences && personalInfo.preferences.includes('bold colors')) {
    score += 0.05
  }

  return Math.min(score, 0.95)
}

function analyzeProportions(personalInfo: any): number {
  // Simplified proportion analysis
  let score = 0.75

  if (personalInfo.bodyType) {
    score += 0.1
  }

  if (personalInfo.amputationType) {
    score += 0.05 // Adaptive proportions
  }

  return Math.min(score, 0.9)
}

function getAdaptiveFeatures(personalInfo: any): string[] {
  if (!personalInfo.amputationType) return []

  const features = {
    'upper_limb': ['Magnetic closures', 'One-handed fastenings', 'Adaptive sleeves'],
    'lower_limb': ['Flexible waistbands', 'Easy-access hems', 'Prosthetic-friendly cuts'],
    'partial_hand': ['Large zipper pulls', 'Velcro alternatives', 'Simplified buttons'],
    'partial_foot': ['Adaptive footwear', 'Comfortable ankle support', 'Easy slip-on designs']
  }

  return features[personalInfo.amputationType] || []
}

function getConfidenceFactors(style: string, personalInfo: any): string[] {
  const factors = ['AI-optimized design', 'Style compatibility']

  if (personalInfo.amputationType) {
    factors.push('Adaptive accessibility', 'Inclusive design principles')
  }

  if (personalInfo.preferences && personalInfo.preferences.length > 0) {
    factors.push('Personal preference alignment')
  }

  factors.push('Professional styling recommendations')
  return factors
}

function createFallbackOutfit(style: string, personalInfo: any): EnhancedOutfit {
  return {
    id: crypto.randomUUID(),
    category: style,
    imageUrl: '/placeholder.svg',
    description: getEnhancedDescription(style, personalInfo),
    confidence: 0.6,
    colorPalette: extractColorPalette(style, personalInfo),
    fabricTypes: getFabricRecommendations(style, personalInfo),
    styleNotes: getStyleNotes(style, personalInfo),
    occasions: getOccasions(style),
    aiEnhancements: {
      colorHarmony: 0.7,
      proportionAnalysis: 0.7,
      adaptiveFeatures: getAdaptiveFeatures(personalInfo),
      confidenceFactors: ['Fallback generation', 'Basic styling recommendations']
    }
  }
}

function getEnhancedDescription(style: string, personalInfo: any): string {
  const descriptions = {
    formal: `Professional ${style} outfit designed for business environments`,
    casual: `Comfortable ${style} ensemble perfect for everyday wear`,
    sportswear: `Performance-oriented ${style} attire for active lifestyles`,
    traditional: `Elegant ${style} clothing honoring cultural heritage`
  }

  let desc = descriptions[style] || descriptions.casual

  if (personalInfo.amputationType) {
    desc += ' with thoughtful adaptive design elements for enhanced comfort and accessibility'
  }

  return desc
}

async function trackModelPerformance(supabase: any, metrics: any) {
  try {
    const { error } = await supabase
      .from('ai_model_performance')
      .insert(metrics)

    if (error) {
      console.error('Error tracking model performance:', error)
    }
  } catch (error) {
    console.error('Error in trackModelPerformance:', error)
  }
}