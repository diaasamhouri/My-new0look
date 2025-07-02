import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/use-toast';

interface PostDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

export const PostDetailsModal = ({ isOpen, onClose, post }: PostDetailsModalProps) => {
  const { likePost, addComment, getPostComments } = useCommunity();
  const { toast } = useToast();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      loadComments();
    }
  }, [isOpen, post]);

  const loadComments = async () => {
    try {
      const postComments = await getPostComments(post.id);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    await likePost(post.id);
    toast({
      title: "Thanks for your support!",
      description: "Your reaction helps build our supportive community.",
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await addComment(post.id, newComment);
      setNewComment('');
      loadComments(); // Refresh comments
      toast({
        title: "Comment Added",
        description: "Your supportive comment has been shared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-healing-purple/10 text-healing-purple">
                {post.author_name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Content */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{post.post_type}</Badge>
              {post.tags && post.tags.length > 0 && (
                <>
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </>
              )}
            </div>

            <h2 className="text-xl font-semibold">{post.title}</h2>
            
            {post.content && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="text-muted-foreground hover:text-healing-purple"
              >
                <Heart className="w-4 h-4 mr-1" />
                {post.likes_count} Likes
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-healing-blue"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {comments.length} Comments
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Comments</h3>
            
            {/* Add Comment */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or words of encouragement..."
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Comments are posted anonymously to protect privacy
                    </p>
                    <Button 
                      onClick={handleAddComment}
                      disabled={loading || !newComment.trim()}
                      size="sm"
                      className="bg-healing-purple hover:bg-healing-purple/90"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {loading ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-healing-blue/10 text-healing-blue text-xs">
                          {comment.author_name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium">{comment.author_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No comments yet</p>
                  <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};