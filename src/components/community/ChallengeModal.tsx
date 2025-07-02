import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Calendar, Users, Upload } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/use-toast';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: any;
}

export const ChallengeModal = ({ isOpen, onClose, challenge }: ChallengeModalProps) => {
  const { joinChallenge } = useCommunity();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isActive = challenge && new Date(challenge.end_date) > new Date();
  const daysLeft = challenge ? Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleJoinChallenge = async () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your approach to this challenge.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await joinChallenge(challenge.id, undefined, description);
      toast({
        title: "Challenge Joined!",
        description: "You're now participating in this style challenge.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join challenge. You may have already joined this challenge.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-healing-purple" />
            <span>{challenge.title}</span>
          </DialogTitle>
          <DialogDescription>
            Join this style challenge and showcase your creativity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Info */}
          <Card className="bg-gradient-to-r from-healing-purple/5 to-healing-blue/5 border-healing-purple/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? 'Active' : 'Ended'}
                  </Badge>
                  {isActive && daysLeft > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {daysLeft} days left
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{challenge.participants_count} participants</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Trophy className="w-4 h-4 text-healing-purple" />
                  <span className="font-medium">Theme: {challenge.theme}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Description */}
          <div className="space-y-4">
            <h3 className="font-semibold">Challenge Description</h3>
            <p className="text-muted-foreground">{challenge.description}</p>
          </div>

          {/* Join Challenge Form */}
          {isActive && (
            <div className="space-y-4">
              <h3 className="font-semibold">Join the Challenge</h3>
              <div className="space-y-3">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your approach to this challenge or what you hope to achieve..."
                  rows={4}
                />
                
                <div className="bg-healing-blue/5 border border-healing-blue/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Upload className="w-4 h-4 text-healing-blue mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-healing-blue mb-1">How to Participate:</p>
                      <ol className="text-muted-foreground space-y-1 text-xs list-decimal list-inside">
                        <li>Join the challenge by describing your approach</li>
                        <li>Create your outfit following the challenge theme</li>
                        <li>Share your result in the Community Feed</li>
                        <li>Use the challenge hashtag in your post</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Maybe Later
                  </Button>
                  <Button 
                    onClick={handleJoinChallenge}
                    disabled={loading || !description.trim()}
                    className="bg-healing-purple hover:bg-healing-purple/90"
                  >
                    {loading ? 'Joining...' : 'Join Challenge'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isActive && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">
                  This challenge has ended. Check back for new challenges!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};