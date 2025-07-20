import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Users, Brain, Sparkles, TrendingUp, Star } from 'lucide-react'
import { useEnhancedAI, RecommendationResult } from '@/hooks/useEnhancedAI'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface RecommendationsPanelProps {
  currentOutfitId?: string
  onOutfitSelect: (outfit: any) => void
  className?: string
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  currentOutfitId,
  onOutfitSelect,
  className = ""
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null)
  const [activeTab, setActiveTab] = useState<'hybrid' | 'similar_users' | 'style_based' | 'emotion_based'>('hybrid')
  const { getUserRecommendations, trackOutfitInteraction, isLoadingRecommendations } = useEnhancedAI()
  const { toast } = useToast()

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'similar_users': return <Users className="h-4 w-4" />
      case 'style_based': return <Sparkles className="h-4 w-4" />
      case 'emotion_based': return <Heart className="h-4 w-4" />
      case 'hybrid': return <Brain className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score > 0.8) return 'text-green-600 bg-green-50'
    if (score > 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const loadRecommendations = async (type: typeof activeTab) => {
    try {
      const result = await getUserRecommendations(type, currentOutfitId, 15)
      setRecommendations(result)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const handleOutfitClick = async (outfit: any, recommendation: any) => {
    await trackOutfitInteraction(outfit.id || 'rec-' + Date.now(), 'view', outfit)
    onOutfitSelect(outfit)
    
    toast({
      title: "Outfit Selected",
      description: recommendation.reason,
    })
  }

  const handleRecommendationSave = async (outfit: any, recommendation: any) => {
    await trackOutfitInteraction(outfit.id || 'rec-' + Date.now(), 'save', outfit)
    
    toast({
      title: "Outfit Saved",
      description: "Added to your favorites based on AI recommendation",
    })
  }

  useEffect(() => {
    loadRecommendations(activeTab)
  }, [activeTab, currentOutfitId])

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hybrid" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Smart
            </TabsTrigger>
            <TabsTrigger value="similar_users" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Similar
            </TabsTrigger>
            <TabsTrigger value="style_based" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="emotion_based" className="text-xs">
              <Heart className="h-3 w-3 mr-1" />
              Emotion
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {isLoadingRecommendations ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : recommendations ? (
              <div className="space-y-6">
                {/* User Insights */}
                {recommendations.insights && (
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Your Style Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Personality:</p>
                        <Badge variant="secondary">{recommendations.insights.stylePersonality}</Badge>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Top Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendations.insights.topCategories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Similar Users */}
                {recommendations.similarUsers.length > 0 && activeTab === 'similar_users' && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Users Like You
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {recommendations.similarUsers.slice(0, 5).map((user, index) => (
                        <div key={user.userId} className="flex-shrink-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {index + 1}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-center mt-1">
                            {Math.round(user.similarityScore * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations List */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    {getRecommendationIcon(activeTab)}
                    Recommended for You
                  </h4>
                  
                  {recommendations.recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recommendations available yet.</p>
                      <p className="text-sm">Try interacting with more outfits to improve recommendations.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {recommendations.recommendations.slice(0, 6).map((rec, index) => (
                        <div key={index} className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex gap-3">
                            {/* Outfit Image */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                              {rec.outfit.images?.[0] ? (
                                <img 
                                  src={rec.outfit.images[0]} 
                                  alt="Recommended outfit"
                                  className="w-full h-full object-cover"
                                />
                              ) : rec.outfit.imageUrl ? (
                                <img 
                                  src={rec.outfit.imageUrl} 
                                  alt="Recommended outfit"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Sparkles className="h-6 w-6" />
                                </div>
                              )}
                            </div>

                            {/* Recommendation Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium text-sm truncate">
                                    {rec.outfit.category || 'Recommended Outfit'}
                                  </p>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getConfidenceColor(rec.score)}`}
                                  >
                                    {Math.round(rec.score * 100)}% match
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {rec.reason}
                              </p>

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => handleOutfitClick(rec.outfit, rec)}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-xs"
                                  onClick={() => handleRecommendationSave(rec.outfit, rec)}
                                >
                                  <Heart className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Load More */}
                {recommendations.recommendations.length > 6 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => loadRecommendations(activeTab)}
                  >
                    Load More Recommendations
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Loading AI recommendations...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default RecommendationsPanel