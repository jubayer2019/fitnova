import { cn } from "../../utils/helpers.js";

export default function Badge({ children, tone = "default", className }) {
  const tones = {
    default: "bg-secondary text-secondary-foreground",
    brand: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-destructive/10 text-destructive",
    outline: "border border-border text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
