import Link from "next/link";
import { ThumbsUp, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PostCard({ post, author }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/10"
    >
      <Link href={`/community/${post._id || post.id}`} className="block aspect-[16/9] overflow-hidden">
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{post.category || "General"}</span>
        <h3 className="mt-2 text-base font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.description || post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-2">
            <img src={author?.image} alt="" className="h-7 w-7 rounded-full object-cover" />
            <div>
              <p className="text-xs font-medium">{author?.name || "Member"}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{author?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes?.length || 0}</span>
            <Link href={`/community/${post._id || post.id}`} className="flex items-center gap-1 text-primary hover:underline">
              Read <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
