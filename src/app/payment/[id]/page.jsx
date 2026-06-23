"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button.jsx";
import { useQuery } from "@tanstack/react-query";
import { getClassById, api } from "../../../lib/api.js";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";

const fmtMoney = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

export default function Payment() {
  const { id } = useParams();
  const { user, isPending } = useAuth();
  const router = useRouter();
  
  const { data: cls, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: () => getClassById(id)
  });

  const trainer = cls?.trainerId;

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isPending && !user) {
      router.push("/login");
    }
  }, [mounted, isPending, user, router]);

  if (!mounted || isPending) return <div className="p-20 text-center">Loading...</div>;
  if (!user) return null;
  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
  if (!cls)  return <div className="p-20 text-center">Class not found.</div>;

  const onPay = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/create-checkout-session', { classId: cls._id || cls.id });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href={`/classes/${cls._id || cls.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to class
      </Link>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <CreditCard className="h-8 w-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Booking</h1>
        <p className="mt-2 text-muted-foreground">You are about to book the following class securely via Stripe.</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <img src={cls.image} alt={cls.title} className="h-48 w-full max-w-sm rounded-xl object-cover border border-border" />
          <h2 className="text-xl font-semibold mt-4">{cls.title}</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">{cls.description}</p>
          <div className="mt-4 flex gap-4 text-sm font-medium">
            <span className="bg-secondary/50 px-3 py-1 rounded-full">{cls.schedule}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{fmtMoney(cls.price)}</span>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border max-w-sm mx-auto">
          <Button onClick={onPay} variant="hero" size="lg" className="w-full text-lg shadow-md" disabled={loading}>
            {loading ? "Preparing Checkout..." : `Pay ${fmtMoney(cls.price)}`}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Secure payment processing by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
