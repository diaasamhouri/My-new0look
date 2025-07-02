import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy, 
  Users, 
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/use-toast';
import { CreatePostModal } from './CreatePostModal';
import { PostDetailsModal } from './PostDetailsModal';
import { ChallengeModal } from './ChallengeModal';

interface CommunityHubScreenProps {
  onBack: () => void;
}

export const CommunityHubScreen = ({ onBack }: CommunityHubScreenProps) => {
  const { posts, challenges, loading, likePost, createPost } = useCommunity();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [postFilter, setPostFilter] = useState('all');

  const handleLikePost = async (postId: string) => {
    await likePost(postId);
    toast({
      title: "Thanks for your support!",
      description: "Your reaction helps build our supportive community.",
    });
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setShowPostDetails(true);
  };

  const handleChallengeClick = (challenge: any) => {
    setSelectedChallenge(challenge);
    setShowChallengeModal(true);
  };

  const filteredPosts = posts.filter(post => 
    postFilter === 'all' || post.post_type === postFilter
  );

  const postTypes = [
    { value: 'all', label: 'All Posts', icon: Users },
    { value: 'transformation', label: 'Transformations', icon: Sparkles },
    { value: 'inspiration', label: 'Inspiration', icon: Heart },
    { value: 'challenge', label: 'Challenges', icon: Trophy },
    { value: 'story', label: 'Stories', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-healing p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onBack}
                  className="hover:bg-healing-purple/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-healing-purple" />
                    <span>Community Hub</span>
                  </CardTitle>
                  <CardDescription>
                    Connect, inspire, and share your style journey
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="bg-healing-purple hover:bg-healing-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Your Story
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="challenges">Style Challenges</TabsTrigger>
            <TabsTrigger value="inspiration">Inspiration Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Post Filters */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={postFilter === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPostFilter(type.value)}
                        className="flex-shrink-0"
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-card/95 backdrop-blur-sm shadow-gentle border-0 hover:shadow-warm transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-healing-purple/10 text-healing-purple">
                          {post.author_name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{post.author_name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {post.post_type}
                              </Badge>
                              <span>•</span>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div onClick={() => handlePostClick(post)}>
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                          {post.content && (
                            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                          )}
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post.id);
                            }}
                            className="text-muted-foreground hover:text-healing-purple"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes_count}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePostClick(post)}
                            className="text-muted-foreground hover:text-healing-blue"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments_count}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-healing-green"
                          >
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && !loading && (
                <Card className="bg-card/95 backdrop-blur-sm shadow-gentle border-0">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your story with the community
                    </p>
                    <Button 
                      onClick={() => setShowCreatePost(true)}
                      className="bg-healing-purple hover:bg-healing-purple/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Share Your Story
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => {
                const isActive = new Date(challenge.end_date) > new Date();
                return (
                  <Card 
                    key={challenge.id} 
                    className="bg-card/95 backdrop-blur-sm shadow-gentle border-0 hover:shadow-warm transition-shadow cursor-pointer"
                    onClick={() => handleChallengeClick(challenge)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? 'Active' : 'Ended'}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          {challenge.participants_count}
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {challenge.description}
                      </p>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Trophy className="w-3 h-3 mr-1" />
                          <span>{challenge.theme}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Ends {new Date(challenge.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {isActive && (
                        <Button 
                          className="w-full mt-4 bg-healing-purple hover:bg-healing-purple/90"
                          size="sm"
                        >
                          Join Challenge
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {challenges.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active challenges</h3>
                  <p className="text-muted-foreground">
                    New challenges will appear here soon!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inspiration">
            <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-0">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-16 h-16 text-healing-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Inspiration Gallery</h3>
                <p className="text-muted-foreground mb-6">
                  Curated collection of adaptive fashion looks and styling inspiration
                </p>
                <Button className="bg-healing-purple hover:bg-healing-purple/90">
                  Explore Gallery
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={createPost}
        />

        {selectedPost && (
          <PostDetailsModal
            isOpen={showPostDetails}
            onClose={() => setShowPostDetails(false)}
            post={selectedPost}
          />
        )}

        {selectedChallenge && (
          <ChallengeModal
            isOpen={showChallengeModal}
            onClose={() => setShowChallengeModal(false)}
            challenge={selectedChallenge}
          />
        )}
      </div>
    </div>
  );
};