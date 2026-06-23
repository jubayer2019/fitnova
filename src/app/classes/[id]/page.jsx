"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Heart, Clock, Flame, Users2, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import ClassCard from "../../../components/cards/ClassCard.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import { useData } from "../../../context/DataContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { getClassById, getPublicClasses } from "../../../lib/api.js";
import { fmtMoney } from "../../../utils/helpers.js";

export default function ClassDetails() {
  const { id } = useParams();
  const { favorites, toggleFavorite, isBooked } = useData();
  const { user } = useAuth();
  const router = useRouter();

  const { data: cls, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: () => getClassById(id)
  });

  const { data: relatedData } = useQuery({
    queryKey: ['classes', { category: cls?.category, limit: 4 }],
    queryFn: () => getPublicClasses({ category: cls?.category, limit: 4 }),
    enabled: !!cls?.category
  });
  if (isLoading) return <Spinner className="p-24" size="h-10 w-10" />;

  if (!cls) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Class not found</h1>
        <p className="mt-2 text-muted-foreground">This class may have been removed.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/classes"><ArrowLeft className="h-4 w-4" /> Back to classes</Link>
        </Button>
      </div>
    );
  }

  const trainer = cls.trainerId || {};
  const related = (relatedData?.classes || []).filter(c => c._id !== cls._id).slice(0, 3);
  const fav = user ? Boolean(favorites[user?.id || user?._id]?.includes(cls._id)) : false;
  const booked = user ? isBooked(user?.id || user?._id, cls._id) : false;

  const onBook = () => {
    if (!user) { toast.error("Please log in to book a class."); return router.push("/login"); }
    if (booked) return toast.error("You already booked this class.");
    router.push(`/payment/${cls._id}`);
  };

  const onFav = () => {
    if (!user) return toast.error("Please log in to favorite.");
    toggleFavorite(user?.id || user?._id, cls._id);
    toast.success(fav ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/classes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to classes
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border">
            <img src={cls.image} alt={cls.title} className="h-full w-full object-cover" />
            <Badge tone="brand" className="absolute left-4 top-4 bg-white/95 text-primary">{cls.category}</Badge>
          </div>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">{cls.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {cls.duration} min</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4" /> {cls.difficulty}</span>
            <span className="flex items-center gap-1"><Users2 className="h-4 w-4" /> {cls.bookingsCount || cls.bookings || 0} booked</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {cls.schedule}</span>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">About this class</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{cls.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Small-group format, capped at 12 participants",
                "All equipment provided on site",
                "Live form feedback throughout the session",
                "Free re-booking up to 6 hours before class",
              ].map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Your coach</h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={trainer?.image} className="h-16 w-16 rounded-2xl object-cover" alt="" />
              <div>
                <p className="text-base font-semibold">{trainer?.name}</p>
                <p className="text-xs uppercase tracking-wider text-primary">{trainer?.specialty}</p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{trainer?.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-3xl font-bold">{fmtMoney(cls.price)}<span className="ml-1 text-sm font-normal text-muted-foreground">/ session</span></p>

            <div className="mt-6 space-y-3">
              <Button onClick={onBook} variant="hero" size="lg" className="w-full" disabled={booked}>
                {booked ? "Already booked" : "Book now"}
              </Button>
              <Button onClick={onFav} variant="outline" size="lg" className="w-full">
                <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
                {fav ? "Favorited" : "Add to favorites"}
              </Button>
            </div>

            <div className="mt-6 divide-y divide-border text-sm">
              <div className="flex justify-between py-3"><span className="text-muted-foreground">Duration</span><span className="font-medium">{cls.duration} min</span></div>
              <div className="flex justify-between py-3"><span className="text-muted-foreground">Difficulty</span><span className="font-medium">{cls.difficulty}</span></div>
              <div className="flex justify-between py-3"><span className="text-muted-foreground">Schedule</span><span className="font-medium text-right">{cls.schedule}</span></div>
              <div className="flex justify-between py-3"><span className="text-muted-foreground">Bookings</span><span className="font-medium">{cls.bookingsCount || cls.bookings || 0}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">Related classes</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => <ClassCard key={c._id || c.id} cls={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}
