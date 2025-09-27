import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        /* Emergency System Variants */
        emergency: "bg-gradient-emergency text-emergency-foreground hover:scale-105 shadow-emergency hover:shadow-lg font-semibold",
        hero: "bg-gradient-hero text-white hover:scale-105 shadow-emergency hover:shadow-xl font-bold text-lg h-14 px-8",
        
        /* Agent-specific variants */
        medical: "bg-medical-primary text-medical-foreground hover:bg-medical-secondary hover:scale-105 shadow-medical",
        "medical-secondary": "bg-medical-secondary text-white hover:bg-medical-primary hover:scale-105 shadow-medical",
        
        police: "bg-police-primary text-police-foreground hover:bg-police-secondary hover:text-police-primary hover:scale-105 shadow-police font-semibold",
        "police-secondary": "bg-police-secondary text-police-primary hover:bg-police-primary hover:text-police-foreground hover:scale-105 shadow-police",
        
        electricity: "bg-electricity-primary text-electricity-secondary hover:bg-electricity-secondary hover:text-electricity-primary hover:scale-105 shadow-electricity font-semibold",
        "electricity-secondary": "bg-electricity-secondary text-electricity-primary hover:bg-electricity-primary hover:text-electricity-secondary hover:scale-105 shadow-electricity",
        
        /* Chat variants */
        "chat-send": "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
