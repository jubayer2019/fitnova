import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/helpers.js";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
  hero: "gradient-brand text-white hover:opacity-95 shadow-xl shadow-primary/30",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  success: "bg-success text-success-foreground hover:opacity-90",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  subtle: "bg-secondary text-secondary-foreground hover:bg-muted",
};
const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export default function Button({
  as: Tag = "button",
  asChild = false,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}) {
  const Comp = asChild ? Slot : Tag;
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
