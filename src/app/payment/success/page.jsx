"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Check, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";
import { api } from "../../../lib/api.js";
import { useAuth } from "../../../context/AuthContext.jsx";

function PaymentSuccessContent() {
  const [status, setStatus] = useState("verifying");
  const [details, setDetails] = useState(null);
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.get(`/payments/session/${sessionId}`);
        setDetails(res.data.booking);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <h2 className="mt-6 text-2xl font-semibold">Verifying your payment...</h2>
        <p className="mt-2 text-muted-foreground">Please wait a moment while we confirm your booking.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Unable to verify payment</h2>
        <p className="mt-2 text-muted-foreground">There was an issue verifying your transaction. If you were charged, please contact support.</p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="h-10 w-10" />
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Payment Successful!</h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-md">
        Your booking for <span className="font-semibold text-foreground">{details?.classId?.title}</span> is confirmed.
      </p>
      
      <div className="mt-8 w-full max-w-sm rounded-xl border border-border bg-card p-6 text-left shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Transaction Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-medium">${details?.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-success capitalize">{details?.status || 'Paid'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs truncate max-w-[150px]">{details?.transactionId}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Button asChild variant="hero" className="flex items-center gap-2">
          <Link href="/dashboard">Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
