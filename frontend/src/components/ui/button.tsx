import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-floom-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-floom-accent text-black shadow-floomSoft hover:opacity-90 font-headline",
        ghost: "bg-transparent text-floom-fg hover:bg-white/5",
        outline: "border hairline text-floom-fg hover:bg-white/5",
        subtle: "bg-white/5 text-floom-fg hover:bg-white/10",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link: "text-floom-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 rounded-sm text-xs",
        md: "h-10 px-4 rounded-md text-sm",
        lg: "h-12 px-6 rounded-lg text-base",
        icon: "h-10 w-10",
      },
      glow: {
        true: "shadow-floomGlow",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      glow: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, glow }), className)} {...props} />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
