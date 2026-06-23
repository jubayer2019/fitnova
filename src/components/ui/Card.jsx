import { cn } from "../../utils/helpers.js";

export default function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
