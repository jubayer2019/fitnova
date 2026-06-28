import Link from "next/link";
import { Heart, Clock, Users2, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "../ui/Badge.jsx";
import { fmtMoney } from "../../utils/helpers.js";

export default function ClassCard({ cls, isFavorite, onFavorite }) {
  const trainer = cls.trainerId || {};
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/10"
    >
      <Link href={`/classes/${cls._id || cls.id}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={cls.image}
          alt={cls.className || cls.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge tone="brand" className="absolute left-3 top-3 bg-white/95 text-primary backdrop-blur">{cls.category}</Badge>
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onFavorite(cls._id || cls.id); }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur hover:bg-white"
            aria-label="Favorite"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
          </button>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <h3 className="text-lg font-semibold drop-shadow">{cls.className || cls.title}</h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <img src={trainer?.image || `https://i.pravatar.cc/150?u=${cls.trainerName || 'trainer'}`} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div>
            <p className="text-xs font-medium">{trainer?.name || cls.trainerName}</p>
            <p className="text-[11px] text-muted-foreground">{trainer?.specialty || "Fitness Trainer"}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {cls.duration}m</div>
          <div className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {cls.difficultyLevel || cls.difficulty}</div>
          <div className="flex items-center gap-1"><Users2 className="h-3.5 w-3.5" /> {cls.bookingCount || cls.bookings || 0}</div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-foreground">{fmtMoney(cls.price)}</p>
          </div>
          <Link
            href={`/classes/${cls._id || cls.id}`}
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
          >
            View class →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
