import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloomHeaderProps {
  className?: string;
  onCreateSpace?: () => void;
  onConnectWallet?: () => void;
  user?: {
    name: string;
    avatar?: string;
    handle: string;
  };
}

export function FloomHeader({ className, onCreateSpace, onConnectWallet, user }: FloomHeaderProps) {
  const topicTags = ["#DeFi", "#Builders", "#Creators", "#AIxWeb3", "#OpenSource"];

  return (
    <header className={cn("border-b border-border bg-card/50 backdrop-blur-sm", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/src/assets/floom-logo.png" alt="Floom" className="w-8 h-8" />
            <h1 className="text-2xl font-heading floom-gradient bg-clip-text text-transparent">
              Floom
            </h1>
            <Badge variant="secondary" className="text-xs">
              BETA
            </Badge>
          </div>

          {/* Search & Tags */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search spaces, topics..." 
                className="pl-10 bg-input/50 border-border"
              />
            </div>
            <div className="flex gap-1">
              {topicTags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-floom-accent hover:text-black transition-floom"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/create'}
                className="hidden sm:flex items-center gap-2"
              >
                <Plus size={16} />
                Create Space
              </Button>
            
            {user ? (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-floom"
                onClick={() => window.location.href = `/profile/${user.handle}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-secondary text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-body">{user.name}</span>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={onConnectWallet}
                className="flex items-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mt-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search spaces, topics..." 
              className="pl-10 bg-input/50 border-border"
            />
          </div>
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
            {topicTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-floom-accent hover:text-black transition-floom whitespace-nowrap"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}