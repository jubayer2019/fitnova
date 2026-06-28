"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Calendar, MessageSquare, Award } from "lucide-react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input, Label, Textarea } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMyBookings, getMyFavorites, getMyComments, getMyTrainerApplication, applyForTrainer } from "../../lib/api.js";
import { fmtMoney } from "../../utils/helpers.js";

function Stat({ icon: Icon, label, value, tone = "brand" }) {
  const tones = { brand: "bg-primary/10 text-primary", success: "bg-success/10 text-success", warning: "bg-amber-500/10 text-amber-600", accent: "bg-accent/20 text-accent-foreground" };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: myBookings = [], isLoading: isBookings } = useQuery({ queryKey: ["user", "bookings"], queryFn: getMyBookings });
  const { data: myFavorites = [], isLoading: isFavs } = useQuery({ queryKey: ["user", "favorites"], queryFn: getMyFavorites });
  const { data: myComments = [], isLoading: isComments } = useQuery({ queryKey: ["user", "comments"], queryFn: getMyComments });
  const { data: myApp = null, isLoading: isApp } = useQuery({ queryKey: ["user", "trainerApp"], queryFn: getMyTrainerApplication });

  const isLoading = isBookings || isFavs || isComments || isApp;

  const [form, setForm] = useState({ specialty: "", experience: "", bio: "" });

  const mutApply = useMutation({
    mutationFn: applyForTrainer,
    onSuccess: () => {
      toast.success("Trainer application submitted!");
      queryClient.invalidateQueries({ queryKey: ["user", "trainerApp"] });
      setForm({ specialty: "", experience: "", bio: "" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Application failed");
    }
  });

  const submitApp = (e) => {
    e.preventDefault();
    if (myApp) return toast.error("Application already submitted.");
    mutApply.mutate(form);
  };

  if (isLoading) return <Spinner className="mt-20" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hey, {user.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's your training snapshot.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Calendar} label="Booked classes" value={myBookings.length} />
        <Stat icon={Heart} label="Favorite classes" value={myFavorites.length} tone="accent" />
        <Stat icon={MessageSquare} label="Forum comments" value={myComments.length} tone="success" />
        <Stat icon={Award} label="Trainer status" value={myApp ? myApp.status : "—"} tone="warning" />
      </div>

      {/* Bookings */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-base font-semibold">My bookings</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/classes">Browse more</Link>
          </Button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Class</th><th className="px-5 py-3">Trainer</th><th className="px-5 py-3">Schedule</th><th className="px-5 py-3 text-right">Amount</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {myBookings.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No bookings yet — explore classes to get started.</td></tr>
              ) : myBookings.map((b) => {
                return (
                  <tr key={b._id || b.id} className="border-t border-border">
                    <td className="px-5 py-3"><Link href={`/classes/${b.classId?._id || b.classId || ""}`} className="font-medium hover:text-primary">{b.className || b.classId?.title || "—"}</Link></td>
                    <td className="px-5 py-3 text-muted-foreground">{b.trainerName || b.classId?.trainerName || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.schedule || b.classId?.schedule || "—"}</td>
                    <td className="px-5 py-3 text-right font-medium">{fmtMoney(b.price || b.amount || 0)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/classes/${b.classId?._id || b.classId || ""}`}>Details</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Favorites */}
      <section>
        <h2 className="text-base font-semibold">Favorites</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myFavorites.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">No favorites yet — tap the heart on any class.</p>
          ) : myFavorites.map((f) => {
            const c = f.classId || {};
            if (!c._id) return null;
            return (
              <Link key={f._id} href={`/classes/${c._id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:shadow-md">
                <img src={c.image} alt="" className="h-16 w-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.category} · {fmtMoney(c.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Apply as trainer */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Become a trainer</h2>
        <p className="mt-1 text-sm text-muted-foreground">Apply to coach on FitNova. Our team reviews applications within 48 hours.</p>
        {myApp ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm">
            Application status: <Badge tone={myApp.status === "approved" ? "success" : myApp.status === "rejected" ? "danger" : "warning"}>{myApp.status}</Badge>
          </div>
        ) : (
          <form onSubmit={submitApp} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label>Specialty</Label>
              <Input placeholder="e.g. Strength & Conditioning" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
            </div>
            <div>
              <Label>Years of experience</Label>
              <Input type="number" min="0" placeholder="5" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <Label>Short bio</Label>
              <Textarea placeholder="Tell us about your coaching philosophy…" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
            </div>
            <div className="md:col-span-2"><Button type="submit" variant="primary">Submit application</Button></div>
          </form>
        )}
      </section>
    </div>
  );
}
