import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import floomLogo from "@/assets/floom-logo.png";

interface FloomHeaderProps {
  className?: string;
}

export function FloomHeader({ className }: FloomHeaderProps) {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className={cn("border-b border-border bg-card/50 backdrop-blur-sm", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={floomLogo} alt="Floom" className="w-12 h-12 block" />
            <h1 className="text-2xl font-heading text-floom-fg hidden sm:block">
              Floom
            </h1>
            <Badge 
              variant="secondary" 
              className="bg-primary/20 text-primary-foreground border-primary/30 px-2 py-1 text-xs font-medium hidden sm:inline-flex"
            >
              BETA
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-primary/20 text-primary-foreground border-primary/30 px-1.5 py-0.5 text-xs font-medium sm:hidden"
            >
              β
            </Badge>
          </div>

          {/* Search section removed */}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-sm hidden sm:flex"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-sm"
                  >
                    Sign Up
                  </Button>
                </>
              )
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
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
}