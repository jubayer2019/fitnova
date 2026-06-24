"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Sparkles, Users, Calendar, TrendingUp, BarChart3,
  Activity, Star, Zap, Cpu, Building2, Check
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from "recharts";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import ClassCard from "../components/cards/ClassCard.jsx";
import PostCard from "../components/cards/PostCard.jsx";
import { useQuery } from "@tanstack/react-query";
import { getPublicClasses, getPosts } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { monthlyAnalytics } from "../data/mockData.js";

export default function Home() {
  const { favorites, toggleFavorite } = useData();
  const { user } = useAuth();

  const { data: classData } = useQuery({ queryKey: ['classes'], queryFn: () => getPublicClasses({ limit: 10 }) });
  const { data: postData } = useQuery({ queryKey: ['posts'], queryFn: () => getPosts({ limit: 4 }) });

  const classes = classData?.data || [];
  const posts = postData?.data || [];

  const top = [...classes].sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0)).slice(0, 6);
  const latest = posts.slice(0, 4);

  const stats = [
    { label: "Active Members", value: "12,480", delta: "+18.2%", icon: Users },
    { label: "Classes Running", value: "184", delta: "+6 this wk", icon: Calendar },
    { label: "Trainer Growth", value: "+34%", delta: "MoM", icon: TrendingUp },
    { label: "Monthly Bookings", value: "9,820", delta: "+12.4%", icon: BarChart3 },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge tone="brand" className="mb-5 px-3 py-1">
              <Sparkles className="mr-1 h-3 w-3" /> Now powering 1,200+ studios worldwide
            </Badge>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your premium <br />
              <span className="gradient-text">fitness operating system.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              FitNova unifies class booking, trainer ops, member engagement, and revenue analytics into one beautifully designed platform — purpose built for modern studios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link href="/classes">
                  Explore Classes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/community">
                  View Community
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/120?u=${i}`} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-xs text-muted-foreground">4.9 average across 2,400+ reviews</p>
              </div>
            </div>
          </motion.div>

          {/* Hero analytics panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-success">{s.delta}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="glass-card mt-4 rounded-2xl p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Monthly Bookings</p>
                  <p className="text-xs text-muted-foreground">Last 6 months</p>
                </div>
                <Badge tone="success"><Activity className="mr-1 h-3 w-3" /> Live</Badge>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={monthlyAnalytics}>
                    <defs>
                      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="bookings" stroke="var(--color-primary)" fill="url(#hg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by leading studios and franchises
          </p>
          <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-5 text-muted-foreground/70 sm:grid-cols-3 lg:grid-cols-6">
            {["Equinox Lab", "Pulse Co.", "Reform Studio", "Apex Fit", "Hyrox Club", "Northline"].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Building2 className="h-4 w-4" /> {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CLASSES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge tone="brand">Top booked</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Featured classes this week</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Programs members actually show up for — ranked by live booking volume across the network.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/classes">See all classes <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((c) => (
            <ClassCard
              key={c._id || c.id}
              cls={c}
              isFavorite={user ? Boolean(favorites[user?.id || user?._id]?.includes(c._id || c.id)) : false}
              onFavorite={user ? (id) => toggleFavorite(user?.id || user?._id, id) : undefined}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">How FitNova works</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One platform. Three roles. Zero chaos.</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: "For Members", desc: "Discover and book classes, track favorites, join the community, and apply to teach what you love.", points: ["1-tap class booking", "Favorites & history", "Apply to coach"] },
              { icon: Zap, title: "For Trainers", desc: "Publish classes, manage rosters, post to the forum, and grow your following with built-in tools.", points: ["Publish & manage classes", "Roster visibility", "Member engagement"] },
              { icon: Cpu, title: "For Admins", desc: "Approve content, manage trainers, monitor transactions, and watch revenue trends in real time.", points: ["Approve trainers & classes", "Revenue analytics", "User moderation"] },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand text-white">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge tone="brand">Analytics, built in</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Revenue you can see, decisions you can make.</h2>
            <p className="mt-4 text-muted-foreground">From classroom utilization to monthly recurring revenue, FitNova surfaces the metrics that actually move your business — without spreadsheets, without consultants.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Real-time class utilization", "Trainer performance leaderboards", "Cohort retention by class category", "Transaction & refund insights"].map((p) => (
                <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {p}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Bookings & revenue</p>
                <p className="text-xs text-muted-foreground">Demo data, last 6 months</p>
              </div>
              <Badge tone="success">↑ 21% MoM</Badge>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={monthlyAnalytics}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="bookings" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="members" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge tone="brand">From the community</Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Latest forum posts</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/community">Visit forum <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((p) => {
              // The backend populates authorId, so we use it directly
              return <PostCard key={p._id || p.id} post={p} author={p.authorId || {}} />;
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 text-white sm:p-14">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative grid items-center gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Badge className="bg-white/15 text-white backdrop-blur"><ShieldCheck className="mr-1 h-3 w-3" /> 14-day trial. No card required.</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Ready to run your studio like the best in the industry?</h2>
              <p className="mt-3 max-w-xl text-white/85">Join the network of studios using FitNova to launch new classes, fill rosters, and grow recurring revenue.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild variant="primary" size="lg" className="bg-white text-black hover:bg-white/90">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/classes">Browse classes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
