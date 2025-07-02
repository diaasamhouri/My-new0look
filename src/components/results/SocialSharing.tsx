import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share, Instagram, Facebook, Twitter, Link, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Outfit {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
  confidence: number;
}

interface SocialSharingProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialSharing = ({ outfit, isOpen, onClose }: SocialSharingProps) => {
  const [customMessage, setCustomMessage] = useState("");
  const [shareAnonymously, setShareAnonymously] = useState(false);
  const { toast } = useToast();

  if (!outfit) return null;

  const generateShareText = (platform: 'instagram' | 'facebook' | 'twitter' | 'general') => {
    const baseMessages = {
      instagram: `✨ Just discovered my perfect ${outfit.category} look with AI fashion! This adaptive style celebrates confidence and individuality. #AIFashion #AdaptiveFashion #ConfidentStyle #MyNewLook`,
      facebook: `I just found my new favorite ${outfit.category} outfit using AI fashion technology! It's amazing how AI can create beautiful, adaptive styles that celebrate who we are. Feeling confident and stylish! 💜`,
      twitter: `AI just helped me find my perfect ${outfit.category} look! ✨ Loving how technology makes fashion more inclusive and adaptive. #AIFashion #AdaptiveStyle`,
      general: `Check out my new ${outfit.category} look created with AI fashion technology! ${outfit.description}`
    };

    return customMessage || baseMessages[platform];
  };

  const handleShare = async (platform: 'instagram' | 'facebook' | 'twitter' | 'link') => {
    const shareText = generateShareText(platform === 'link' ? 'general' : platform);
    const shareUrl = window.location.href;

    const shareUrls = {
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct text sharing
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      link: shareUrl
    };

    if (platform === 'link') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Share link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Please copy the link manually",
          variant: "destructive"
        });
      }
    } else if (platform === 'instagram') {
      // For Instagram, we'll copy the text and suggest manual sharing
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Text Copied!",
          description: "Caption copied! Open Instagram to share your photo.",
        });
      } catch (error) {
        window.open(shareUrls[platform], '_blank');
      }
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleDownloadForSharing = () => {
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = outfit.imageUrl;
    link.download = `my-${outfit.category}-look-social.jpg`;
    link.click();
    
    toast({
      title: "Image Downloaded",
      description: "Your outfit image is ready for social sharing!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share className="w-5 h-5 text-healing-purple" />
            <span>Share Your New Look</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-4">
            <div className="flex space-x-3">
              <div className="w-16 h-20 bg-accent rounded overflow-hidden">
                <img 
                  src={outfit.imageUrl}
                  alt={outfit.description}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {outfit.category}
                </Badge>
                <p className="text-sm text-foreground">{outfit.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {outfit.confidence}%
                </p>
              </div>
            </div>
          </Card>

          {/* Custom Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Customize your message (optional)
            </label>
            <Textarea
              placeholder="Add your personal touch to the share message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Download for Social */}
          <Card className="p-4 bg-accent/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Download Image First</h4>
                <p className="text-sm text-muted-foreground">
                  Get the image for Instagram or other platforms
                </p>
              </div>
              <Button variant="outline" onClick={handleDownloadForSharing}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>

          {/* Platform Buttons */}
          <div className="space-y-3">
            <h4 className="font-medium">Share on:</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleShare('instagram')}
                className="justify-start"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleShare('facebook')}
                className="justify-start"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleShare('twitter')}
                className="justify-start"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleShare('link')}
                className="justify-start"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Anonymous Sharing Note */}
          <Card className="p-3 bg-healing-blue/10 border-healing-blue/20">
            <p className="text-xs text-foreground/80">
              💜 Your personal information is never shared. Only the outfit image and your custom message (if any) will be shared.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};