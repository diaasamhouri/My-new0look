import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, ArrowLeft, ArrowRight, Star } from "lucide-react";

interface Story {
  id: string;
  name: string;
  age: number;
  amputationType: string;
  story: string;
  inspiration: string;
  initials: string;
}

interface StoriesScreenProps {
  onBack: () => void;
  onRestart: () => void;
}

const inspiringStories: Story[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    amputationType: 'Right arm',
    story: "After my accident, I thought I'd never feel confident in photos again. Learning to embrace my new look took time, but now I see my prosthetic as part of what makes me unique and strong.",
    inspiration: "Fashion isn't about hiding who you are - it's about celebrating every part of your journey.",
    initials: 'SM'
  },
  {
    id: '2', 
    name: 'Marcus',
    age: 35,
    amputationType: 'Left leg',
    story: "Sports were my life before my amputation. I was devastated thinking I'd lost my identity. But adaptive sportswear showed me I could still be the athlete I always was - just in a new way.",
    inspiration: "Your limitations don't define you. Your determination to overcome them does.",
    initials: 'MJ'
  },
  {
    id: '3',
    name: 'Elena',
    age: 42,
    amputationType: 'Right leg',
    story: "As a mother, I worried about how my children would see me after my amputation. But they taught me that love sees beyond physical differences. Now I dress with confidence for them and for me.",
    inspiration: "The people who matter most will love you exactly as you are.",
    initials: 'ER'
  },
  {
    id: '4',
    name: 'James',
    age: 23,
    amputationType: 'Left arm',
    story: "Starting college after my amputation felt overwhelming. But finding clothes that fit my style and my prosthetic helped me feel like myself again. Confidence is the best accessory you can wear.",
    inspiration: "Every challenge is an opportunity to discover just how strong you really are.",
    initials: 'JT'
  }
];

export const StoriesScreen = ({ onBack, onRestart }: StoriesScreenProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = inspiringStories[currentStoryIndex];

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % inspiringStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + inspiringStories.length) % inspiringStories.length);
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-card/95 backdrop-blur-sm shadow-warm border-0 animate-fade-in">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <Heart className="w-8 h-8 text-healing-purple mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Inspiring Stories</h2>
            <p className="text-muted-foreground">
              Real experiences from people who've walked similar paths
            </p>
          </div>

          <div className="space-y-6">
            {/* Story Card */}
            <Card className="p-6 bg-gradient-to-br from-healing-purple/5 to-healing-blue/5 border border-healing-purple/20">
              <div className="space-y-4">
                {/* Profile */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 bg-gradient-confidence">
                    <AvatarFallback className="text-primary-foreground font-semibold">
                      {currentStory.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{currentStory.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Age {currentStory.age} • {currentStory.amputationType}
                    </p>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-4">
                  <p className="text-foreground/90 leading-relaxed">
                    "{currentStory.story}"
                  </p>
                  
                  <div className="bg-healing-purple/10 rounded-lg p-4 border-l-4 border-healing-purple">
                    <div className="flex items-start space-x-2">
                      <Star className="w-5 h-5 text-healing-purple mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-healing-purple italic">
                        {currentStory.inspiration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevStory}
                variant="ghost"
                size="sm"
                disabled={currentStoryIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {inspiringStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoryIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStoryIndex 
                        ? 'bg-healing-purple' 
                        : 'bg-healing-purple/30'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStory}
                variant="ghost"
                size="sm"
                disabled={currentStoryIndex === inspiringStories.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button onClick={onRestart} variant="warm" className="w-full">
              Start Your New Experience
            </Button>
            
            <Button onClick={onBack} variant="ghost" className="w-full">
              Back to Your Looks
            </Button>
          </div>

          {/* Final Message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic">
              You deserve to feel beautiful, confident, and celebrated exactly as you are.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};