import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Mic, Share } from 'lucide-react';
import { Space } from '@/hooks/useSpaces';

interface SpaceCardProps {
  space: Space;
  className?: string;
  onJoin?: (spaceId: string) => void;
  onRemind?: (spaceId: string) => void;
  onShare?: (spaceId: string) => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, className, onJoin, onRemind }) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 border-border/50 ${className}`}>
      <CardContent className="p-0">
        {/* Cover Image Section */}
        <div className="relative">
          {space.cover_image_url ? (
            <div className="relative h-32 overflow-hidden">
              <img 
                src={space.cover_image_url} 
                alt={space.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
          
          {/* Live indicator */}
          {space.is_live && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          {/* Host info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white/20">
              <AvatarImage src={space.host?.avatar_url} alt={space.host?.display_name || 'Host'} />
              <AvatarFallback className="bg-primary/30 text-primary-foreground font-semibold">
                {(space.host?.display_name || 'H').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{space.host?.display_name || 'Unknown Host'}</p>
              <p className="text-sm text-muted-foreground truncate">@{space.host?.handle || 'unknown'}</p>
            </div>
          </div>

          {/* Space title */}
          <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 leading-tight">
            {space.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {space.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-secondary/60 text-secondary-foreground border-secondary-foreground/20"
              >
                #{tag}
              </Badge>
            ))}
            {space.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-1 border-secondary-foreground/30 text-muted-foreground"
              >
                +{space.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="tabular-nums">{space.participant_count || 0}</span>
              </div>
              {space.is_live ? (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="tabular-nums">{formatDuration(space.duration)}</span>
                </div>
              ) : (
                space.scheduled_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="tabular-nums">{formatTime(space.scheduled_time)}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <div className="px-4 pb-4">
          <Button 
            className="w-full font-medium transition-all duration-200" 
            onClick={() => space.is_live ? onJoin?.(space.id) : onRemind?.(space.id)}
            variant={space.is_live ? "default" : "outline"}
          >
            {space.is_participant ? 'Join Space' : space.is_live ? 'Join Space' : 'Remind Me'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SpaceCard };