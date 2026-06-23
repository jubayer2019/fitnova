"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class_id");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <XCircle className="h-10 w-10" />
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Payment Canceled</h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-md">
        Your booking process was canceled. No charges were made to your card.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        {classId ? (
          <Button asChild variant="hero" className="w-full sm:w-auto">
            <Link href={`/payment/${classId}`}>
              Try Again
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" className="w-full sm:w-auto flex items-center gap-2">
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4" /> Browse Classes
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentCancel() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
