import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<any>;
}

export const CreatePostModal = ({ isOpen, onClose, onSubmit }: CreatePostModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'story',
    tags: '',
    is_anonymous: true
  });

  const postTypes = [
    { value: 'story', label: 'Personal Story' },
    { value: 'transformation', label: 'Style Transformation' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'challenge', label: 'Challenge Entry' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your post.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      await onSubmit(postData);
      toast({
        title: "Post Shared!",
        description: "Your story has been shared with the community.",
      });
      
      onClose();
      setFormData({
        title: '',
        content: '',
        post_type: 'story',
        tags: '',
        is_anonymous: true
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your post.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Your Story</DialogTitle>
          <DialogDescription>
            Inspire others with your style journey and experiences
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Share an inspiring title for your story..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post_type">Post Type</Label>
            <Select 
              value={formData.post_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, post_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                {postTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Story</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience, challenges overcome, or words of encouragement..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., confidence, adaptive fashion, self-love"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_anonymous: checked }))}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously for privacy
            </Label>
          </div>

          <div className="bg-healing-purple/5 border border-healing-purple/20 rounded-lg p-4">
            <p className="text-sm text-healing-purple">
              <strong>Community Guidelines:</strong> We celebrate all bodies and experiences. 
              Share your authentic story to inspire others on their journey.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-healing-purple hover:bg-healing-purple/90"
            >
              {loading ? 'Sharing...' : 'Share Story'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};