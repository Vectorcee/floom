import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, DollarSign, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinnedPostCardProps {
  post: {
    id: string;
    creator: {
      name: string;
      avatar?: string;
      handle: string;
    };
    qScore: number;
    snippet: string;
    topicTags: string[];
    url: string;
  };
  className?: string;
  onEngage?: () => void;
  onStake?: () => void;
  onShare?: () => void;
}

export function PinnedPostCard({ post, className, onEngage, onStake, onShare }: PinnedPostCardProps) {
  const qScoreColor = post.qScore >= 80 ? "text-accent" : post.qScore >= 60 ? "text-yellow-400" : "text-orange-400";

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-floom hover:shadow-glow",
      "neon-border animate-[slide-in-right_0.4s_ease-out]",
      className
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
              <AvatarFallback className="bg-secondary text-xs">
                {post.creator.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-body font-medium">{post.creator.name}</p>
              <p className="text-xs text-muted-foreground">@{post.creator.handle}</p>
            </div>
          </div>
          
          {/* Q-Score Badge */}
          <Badge variant="outline" className={cn("font-heading text-xs", qScoreColor)}>
            Q{post.qScore}
          </Badge>
        </div>

        {/* Content */}
        <p className="text-sm font-body leading-relaxed line-clamp-3">
          {post.snippet}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.topicTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={onEngage}
          >
            <Heart size={12} className="mr-1" />
            Engage
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs text-accent hover:text-accent-foreground hover:bg-accent"
            onClick={onStake}
          >
            <DollarSign size={12} className="mr-1" />
            Stake
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={onShare}
          >
            <Share size={12} className="mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}