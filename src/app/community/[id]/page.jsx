"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare, Trash2, Pencil, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Textarea } from "../../../components/ui/Input.jsx";
import Spinner from "../../../components/ui/Spinner.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById, toggleLike, toggleDislike, addComment } from "../../../lib/api.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useData } from "../../../context/DataContext.jsx";

export default function ForumPostDetails() {
  const { id } = useParams();
  const { deleteComment, updateComment } = useData();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id)
  });

  if (isLoading) return <Spinner className="p-24" size="h-10 w-10" />;

  const post = data?.post;
  
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/community"><ArrowLeft className="h-4 w-4" /> Back to forum</Link>
        </Button>
      </div>
    );
  }

  const author = post.authorId || {};
  const postComments = data?.comments || [];
  const reactedWithLike = user ? post.likes?.includes(user?.id || user?._id) : false;
  const reactedWithDislike = user ? post.dislikes?.includes(user?.id || user?._id) : false;

  const handleReact = async (kind) => {
    if (!user) return toast.error("Please log in to react.");
    try {
      if (kind === 'like') await toggleLike(post._id || post.id);
      else await toggleDislike(post._id || post.id);
      queryClient.invalidateQueries(['post', id]);
    } catch(e) {
      toast.error("Error updating reaction");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to comment.");
    if (!text.trim()) return;
    try {
      await addComment({ postId: post._id || post.id, text: text.trim() });
      setText("");
      toast.success("Comment posted.");
      queryClient.invalidateQueries(['post', id]);
    } catch(err) {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/community" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to forum
      </Link>

      <article className="mt-6">
        <Badge tone="brand">{post.category}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <img src={author?.image} alt="" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium">{author?.name}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{author?.role} · {post.createdAt}</p>
          </div>
        </div>

        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
          <p>{post.description || post.excerpt}</p>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Button onClick={() => handleReact("like")} variant={reactedWithLike ? "subtle" : "outline"}>
            <ThumbsUp className="h-4 w-4" /> {post.likes?.length || 0}
          </Button>
          <Button onClick={() => handleReact("dislike")} variant={reactedWithDislike ? "subtle" : "outline"}>
            <ThumbsDown className="h-4 w-4" /> {post.dislikes?.length || 0}
          </Button>
          <span className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> {postComments.length} comments
          </span>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Discussion</h2>

        <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-border bg-card p-4">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={user ? "Share your thoughts…" : "Log in to join the discussion"} disabled={!user} />
          <div className="mt-3 flex justify-end">
            <Button type="submit" variant="primary" disabled={!user || !text.trim()}>
              <Send className="h-4 w-4" /> Post comment
            </Button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {postComments.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Be the first to share your thoughts.</p>
          ) : (
            postComments.map((c) => {
              const u = c.userId || {};
              const isMine = user && (user.id === u._id || user._id === u._id);
              return (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <img src={u?.image} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{u?.name} <span className="ml-2 text-xs text-muted-foreground">{c.createdAt}</span></p>
                        {isMine && (
                          <div className="flex gap-1">
                            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" onClick={() => { setEditId(c._id || c.id); setEditText(c.text); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded-md p-1.5 text-destructive hover:bg-muted" onClick={() => { deleteComment(c._id || c.id); toast.success("Comment deleted"); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      {editId === (c._id || c.id) ? (
                        <div className="mt-2 space-y-2">
                          <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                            <Button size="sm" variant="primary" onClick={() => { updateComment(c._id || c.id, editText.trim()); setEditId(null); toast.success("Updated"); }}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-foreground/90">{c.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
