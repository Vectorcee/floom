import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Mic, Share, Trash2, MoreVertical } from 'lucide-react';
import { Space } from '@/hooks/useSpaces';

interface SpaceCardProps {
  space: Space;
  className?: string;
  onJoin?: (spaceId: string) => void;
  onRemind?: (spaceId: string) => void;
  onShare?: (spaceId: string) => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, className, onJoin, onRemind, onShare }) => {
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
        {/* Cover Image Section with Overlay Info */}
        <div className="relative">
          {space.cover_image_url ? (
            <div className="relative h-40 overflow-hidden">
              <img 
                src={space.cover_image_url} 
                alt={space.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
          ) : (
            <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Top Row: Live indicator and Privacy */}
            <div className="flex justify-between items-start">
              {space.is_live ? (
                <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                  <Mic className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              ) : (
                <div></div>
              )}
              <Badge variant="secondary" className="bg-black/40 text-white border-white/20">
                {space.privacy === 'private' ? 'Private' : 'Public'}
              </Badge>
            </div>

            {/* Bottom Row: Title, Tags, and Stats */}
            <div className="space-y-3">
              {/* Title */}
              <h3 className="font-semibold text-lg text-white line-clamp-2 leading-tight">
                {space.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {space.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
                {space.tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-1 border-white/30 text-white/80 bg-white/10 backdrop-blur-sm"
                  >
                    +{space.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span className="tabular-nums">{space.participant_count || 0} users</span>
                </div>
                {space.is_live && space.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="tabular-nums">{formatDuration(space.duration)}</span>
                  </div>
                )}
                {!space.is_live && space.scheduled_time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="tabular-nums">{formatTime(space.scheduled_time)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Below Image */}
        <div className="p-4 space-y-3">
          {/* Host info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-border">
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

          {/* Description (lu.ma style) */}
          {space.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {space.description}
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="px-4 pb-4 space-y-2">
          <Button 
            className="w-full font-medium transition-all duration-200" 
            onClick={() => space.is_live ? onJoin?.(space.id) : onRemind?.(space.id)}
            variant={space.is_live ? "default" : "outline"}
          >
            {space.is_participant ? 'Join Space' : space.is_live ? 'Join Space' : 'Remind Me'}
          </Button>
          
          {/* Share button for scheduled spaces */}
          {!space.is_live && (
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-xs"
              onClick={() => onShare?.(space.id)}
            >
              <Share className="w-3 h-3 mr-1" />
              Share Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { SpaceCard };