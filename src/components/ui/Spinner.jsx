import { Loader2 } from "lucide-react";

export default function Spinner({ className = "", size = "h-8 w-8" }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className={`animate-spin text-primary ${size}`} />
    </div>
  );
}
