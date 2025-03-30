import React from "react";
import { cn } from "../lib/utils";

export function Button({ className, asChild = false, ...props }, ref) {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-white",
        className
      )}
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Button);
