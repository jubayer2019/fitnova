"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children, roles }) {
  const { user, isPending } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (mounted && !isPending && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isPending, user, router, pathname]);
  
  if (!mounted || isPending) return <div className="flex h-64 items-center justify-center">Loading...</div>;
  if (!user) return <div className="flex h-64 items-center justify-center">Redirecting...</div>;
  
  if (roles && !roles.includes(user.role)) return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-500">403 - Forbidden</h1>
      <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  );
  
  return children;
}
