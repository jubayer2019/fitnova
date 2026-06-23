"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import Badge from "../../components/ui/Badge.jsx";
import { Input, Select, Textarea, Label } from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import PostCard from "../../components/cards/PostCard.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost } from "../../lib/api.js";
import { CATEGORIES } from "../../data/mockData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const PER_PAGE = 8;

export default function Community() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", description: "", category: CATEGORIES[0], image: "" });

  const { data, isLoading } = useQuery({
    queryKey: ['posts', { search: q, category: cat === 'all' ? '' : cat, page, limit: PER_PAGE }],
    queryFn: () => getPosts({ search: q, category: cat === 'all' ? '' : cat, page, limit: PER_PAGE })
  });

  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const pageItems = posts;

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await createPost(newPost);
      toast.success("Post created successfully!");
      setShowModal(false);
      setNewPost({ title: "", description: "", category: CATEGORIES[0], image: "" });
      queryClient.invalidateQueries(['posts']);
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="brand">Community</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">FitNova Forum</h1>
        <p className="mt-2 text-muted-foreground">Coach-vetted threads on training, recovery, and the science of getting better.</p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 w-full gap-3 md:flex-row flex-col">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search posts…" className="pl-9" />
          </div>
          <div className="w-full md:w-48">
            <Select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
        {user && (
          <Button variant="primary" onClick={() => setShowModal(true)} className="whitespace-nowrap w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((p) => {
          return <PostCard key={p._id || p.id} post={p} author={p.authorId || {}} />;
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`h-10 w-10 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">Create a New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select id="category" value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="space-y-1">
                <ImageUpload
                  label="Cover Image (optional)"
                  value={newPost.image}
                  onChange={(url) => setNewPost({ ...newPost, image: url })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Body Content</Label>
                <Textarea id="description" required rows={6} value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Publish Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
