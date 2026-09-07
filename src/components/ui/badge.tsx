import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "border-transparent bg-blue-600 text-white shadow-2xs hover:bg-blue-700",
    secondary: "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
    destructive: "border-transparent bg-red-600 text-white shadow-2xs hover:bg-red-700",
    outline: "text-slate-800 border-slate-200 bg-white",
    accent: "border-transparent bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
