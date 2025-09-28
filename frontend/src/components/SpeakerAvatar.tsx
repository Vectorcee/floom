import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";

interface SpeakerAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  status?: "idle" | "speaking" | "muted" | "requesting";
  isHost?: boolean;
  className?: string;
}

export function SpeakerAvatar({ 
  src, 
  name, 
  size = "md", 
  status = "idle", 
  isHost = false,
  className 
}: SpeakerAvatarProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16", 
    lg: "h-24 w-24"
  };

  const ringClasses = {
    idle: "",
    speaking: "speaker-ring speaking",
    muted: "opacity-60",
    requesting: "ring-2 ring-accent/50"
  };

  const iconSize = size === "sm" ? 12 : size === "md" ? 16 : 20;

  return (
    <div className={cn("relative flex flex-col items-center gap-2", className)}>
      <div className={cn(
        "relative rounded-full transition-floom",
        sizeClasses[size],
        ringClasses[status]
      )}>
        <Avatar className="h-full w-full border-2 border-card">
          <AvatarImage src={src} alt={name} />
          <AvatarFallback className="bg-secondary font-heading text-xs">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {/* Status indicators */}
        {status === "muted" && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
            <MicOff size={12} className="text-destructive-foreground" />
          </div>
        )}
        
        {isHost && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
            <span className="text-xs font-heading text-accent-foreground">H</span>
          </div>
        )}
      </div>
      
      <span className="text-xs text-center font-body text-muted-foreground max-w-[80px] truncate">
        {name}
      </span>
    </div>
  );
}