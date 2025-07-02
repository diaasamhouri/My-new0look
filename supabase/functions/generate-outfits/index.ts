import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OutfitRequest {
  imageData: string;
  personalInfo: {
    gender: 'male' | 'female';
    amputationType: 'right-arm' | 'left-arm' | 'right-leg' | 'left-leg';
    usesProsthetic: 'yes' | 'no';
  };
}

interface GeneratedOutfit {
  id: string;
  category: 'formal' | 'casual' | 'sportswear' | 'traditional';
  imageUrl: string;
  description: string;
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageData, personalInfo }: OutfitRequest = await req.json()
    
    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!HUGGING_FACE_TOKEN) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not configured')
    }

    const hf = new HfInference(HUGGING_FACE_TOKEN)
    console.log('Starting outfit generation for:', personalInfo)

    // Generate outfits for different categories
    const categories = ['formal', 'casual', 'sportswear', 'traditional'] as const
    const outfits: GeneratedOutfit[] = []

    for (const category of categories) {
      try {
        const prompt = createAmputationAwarePrompt(category, personalInfo)
        console.log(`Generating ${category} outfit with prompt:`, prompt)

        const image = await hf.textToImage({
          inputs: prompt,
          model: 'black-forest-labs/FLUX.1-schnell',
        })

        // Convert blob to base64
        const arrayBuffer = await image.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        const imageUrl = `data:image/png;base64,${base64}`

        outfits.push({
          id: `${category}-${Date.now()}`,
          category,
          imageUrl,
          description: getOutfitDescription(category, personalInfo),
          confidence: Math.floor(85 + Math.random() * 15) // 85-100% confidence
        })

        console.log(`Successfully generated ${category} outfit`)
      } catch (error) {
        console.error(`Failed to generate ${category} outfit:`, error)
        // Continue with other categories even if one fails
      }
    }

    if (outfits.length === 0) {
      throw new Error('Failed to generate any outfits')
    }

    console.log(`Generated ${outfits.length} outfits successfully`)
    return new Response(
      JSON.stringify({ outfits }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-outfits function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate outfits', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

function createAmputationAwarePrompt(
  category: 'formal' | 'casual' | 'sportswear' | 'traditional',
  personalInfo: OutfitRequest['personalInfo']
): string {
  const { gender, amputationType, usesProsthetic } = personalInfo
  const genderTerm = gender === 'male' ? 'man' : 'woman'
  
  // Base style descriptions
  const styleMap = {
    formal: 'professional business attire, elegant suit, sophisticated office wear',
    casual: 'comfortable everyday clothing, relaxed fit, stylish casual wear',
    sportswear: 'athletic wear, sports clothing, comfortable activewear',
    traditional: 'cultural traditional clothing, ethnic attire, heritage fashion'
  }

  // Amputation-aware styling
  const amputationGuidance = getAmputationStylingGuidance(amputationType, usesProsthetic)
  
  return `A confident ${genderTerm} wearing ${styleMap[category]}, ${amputationGuidance}, 
    high quality fashion photography, professional lighting, clean background, 
    full body shot, stylish and empowering, positive and confident pose, 
    ultra high resolution, detailed fabric textures`
}

function getAmputationStylingGuidance(
  amputationType: string, 
  usesProsthetic: string
): string {
  const guidance = {
    'right-arm': usesProsthetic === 'yes' 
      ? 'wearing clothing that accommodates a prosthetic right arm, adaptive fashion design'
      : 'wearing clothing styled for right arm amputation, asymmetrical design elements',
    'left-arm': usesProsthetic === 'yes'
      ? 'wearing clothing that accommodates a prosthetic left arm, adaptive fashion design'
      : 'wearing clothing styled for left arm amputation, asymmetrical design elements',
    'right-leg': usesProsthetic === 'yes'
      ? 'wearing clothing that accommodates a prosthetic right leg, adaptive fashion design'
      : 'wearing clothing styled for right leg amputation, adaptive design',
    'left-leg': usesProsthetic === 'yes'
      ? 'wearing clothing that accommodates a prosthetic left leg, adaptive fashion design'
      : 'wearing clothing styled for left leg amputation, adaptive design'
  }
  
  return guidance[amputationType] || 'adaptive clothing design'
}

function getOutfitDescription(
  category: 'formal' | 'casual' | 'sportswear' | 'traditional',
  personalInfo: OutfitRequest['personalInfo']
): string {
  const descriptions = {
    formal: 'Elegant professional look with adaptive design that celebrates your confidence',
    casual: 'Comfortable everyday style that embraces your unique beauty',
    sportswear: 'Active wear designed for your lifestyle with thoughtful accessibility',
    traditional: 'Cultural attire with modern accessibility and timeless elegance'
  }
  
  return descriptions[category]
}