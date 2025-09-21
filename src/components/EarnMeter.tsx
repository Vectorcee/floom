import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import tokenIcon from "@/assets/token-icon.jpg";

interface EarnMeterProps {
  currentAmount: number;
  targetAmount?: number;
  className?: string;
}

export function EarnMeter({ currentAmount, targetAmount = 1000, className }: EarnMeterProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentAmount !== displayAmount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayAmount(currentAmount);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentAmount, displayAmount]);

  const progress = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img src={tokenIcon} alt="FUUM Token" className="h-5 w-5 rounded-full" />
            <span className="text-xs font-heading text-muted-foreground">FUUM Points</span>
          </div>
          <div className={cn(
            "text-lg font-heading transition-all duration-200",
            isAnimating && "animate-[count-up_0.2s_ease-out]"
          )}>
            {displayAmount.toLocaleString()}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Glow effect */}
          <div 
            className="absolute inset-y-0 left-0 bg-accent/20 blur-sm transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">{targetAmount.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}