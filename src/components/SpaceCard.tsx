import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Space {
  id: string;
  title: string;
  host: {
    name: string;
    avatar?: string;
    handle: string;
  };
  listeners: number;
  duration?: string; // for live spaces
  scheduledTime?: string; // for scheduled spaces
  tags: string[];
  isLive: boolean;
}

interface SpaceCardProps {
  space: Space;
  className?: string;
  onJoin?: () => void;
  onRemind?: () => void;
}

export function SpaceCard({ space, className, onJoin, onRemind }: SpaceCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-floom hover:shadow-soft",
      "hover:border-accent/20",
      className
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Status indicator */}
        {space.isLive && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-heading text-accent">LIVE</span>
          </div>
        )}

        {/* Host */}
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={space.host.avatar} alt={space.host.name} />
            <AvatarFallback className="bg-secondary text-xs">
              {space.host.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-body font-medium">{space.host.name}</p>
            <p className="text-xs text-muted-foreground">@{space.host.handle}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg leading-tight line-clamp-2">
          {space.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {space.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{space.listeners.toLocaleString()}</span>
            </div>
            {space.isLive && space.duration && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{space.duration}</span>
              </div>
            )}
            {!space.isLive && space.scheduledTime && (
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{space.scheduledTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <Button 
          className="w-full transition-floom"
          variant={space.isLive ? "default" : "outline"}
          onClick={space.isLive ? onJoin : onRemind}
        >
          {space.isLive ? "Join Space" : "Remind Me"}
        </Button>
      </CardContent>
    </Card>
  );
}