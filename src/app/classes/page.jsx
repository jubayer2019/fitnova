"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Select } from "../../components/ui/Input.jsx";
import ClassCard from "../../components/cards/ClassCard.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { CATEGORIES } from "../../data/mockData.js";
import { useQuery } from "@tanstack/react-query";
import { getPublicClasses } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";

const PER_PAGE = 9;

export default function AllClasses() {
  const { favorites, toggleFavorite } = useData();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', { search: q, category: cat === 'all' ? '' : cat, sort, page, limit: PER_PAGE }],
    queryFn: () => getPublicClasses({ search: q, category: cat === 'all' ? '' : cat, sort, page, limit: PER_PAGE }),
  });

  const classes = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const filtered = useMemo(() => {
    let arr = classes;
    // Server handles filtering and pagination. But if sort isn't supported on server, we can sort locally for this page
    if (sort === "popular") arr = [...arr].sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0));
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [classes, sort]);

  const pageItems = filtered;

  const onFavorite = (id) => {
    if (!user) return toast.error("Please log in to favorite classes.");
    toggleFavorite(user.id, id);
    toast.success("Updated favorites.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="brand">Class catalog</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">All classes</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Discover programs across every modality, taught by certified coaches across our network.</p>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} classes</p>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search classes…"
              className="pl-9"
            />
          </div>
          <div className="md:col-span-3">
            <Select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Most booked</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <Spinner className="mt-16" />
      ) : pageItems.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
          No classes match your filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((c) => (
            <ClassCard
              key={c._id || c.id}
              cls={c}
              isFavorite={user ? Boolean(favorites[user?.id || user?._id]?.includes(c._id || c.id)) : false}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40" disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-10 w-10 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40" disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
