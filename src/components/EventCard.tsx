import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { AppEvent } from "@/lib/types";
import { fmtDate, rsvpCounts } from "@/lib/format";
import { CalendarDays, MapPin, Users } from "lucide-react";

export function EventCard({ event, index = 0 }: { event: AppEvent; index?: number }) {
  const c = rsvpCounts(event);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to="/events/$eventId" params={{ eventId: event.id }} className="group block glass rounded-2xl overflow-hidden hover:scale-[1.015] transition-transform duration-300">
        <div className="relative h-44 overflow-hidden">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium glass-strong">
            {event.category}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display font-bold text-lg text-white drop-shadow-lg line-clamp-1">{event.title}</h3>
          </div>
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{fmtDate(event.date)} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /><span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-glass-border">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{event.guests.length}</span>
              <span className="text-muted-foreground">/ {event.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Pill color="success">{c.attending}</Pill>
              <Pill color="warning">{c.maybe}</Pill>
              <Pill color="muted">{c.declined}</Pill>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: "success" | "warning" | "muted" }) {
  const cls = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    muted: "bg-muted text-muted-foreground",
  }[color];
  return <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${cls}`}>{children}</span>;
}
