"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDashboard from "../../components/dashboard/UserDashboard.jsx";
import TrainerDashboard from "../../components/dashboard/TrainerDashboard.jsx";
import AdminDashboard from "../../components/dashboard/AdminDashboard.jsx";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, isPending } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isPending && !user) {
      router.push("/login");
    }
  }, [mounted, isPending, user, router]);

  if (!mounted || isPending || !user) return <div className="flex h-64 items-center justify-center">Loading your dashboard...</div>;

  const View = user.role === "admin" ? AdminDashboard : user.role === "trainer" ? TrainerDashboard : UserDashboard;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <View />
    </div>
  );
}
