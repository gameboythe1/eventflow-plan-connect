import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { EventCard } from "@/components/EventCard";
import { Search, Plus, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { isPast, isUpcoming, rsvpCounts } from "@/lib/format";
import type { EventCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/events/")({
  head: () => ({ meta: [{ title: "Events — EventFlow" }] }),
  component: EventsPage,
});

const CATS: ("All" | EventCategory)[] = ["All", "Conference", "Wedding", "Birthday", "Workshop", "Meetup", "Concert", "Corporate", "Other"];
const TIMES = ["all", "upcoming", "past", "high-attendance"] as const;

function EventsPage() {
  const events = useStore((s) => s.events);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [time, setTime] = useState<(typeof TIMES)[number]>("all");

  const filtered = useMemo(() => {
    return events
      .filter((e) => (cat === "All" ? true : e.category === cat))
      .filter((e) => {
        if (time === "upcoming") return isUpcoming(e);
        if (time === "past") return isPast(e);
        if (time === "high-attendance") {
          const c = rsvpCounts(e);
          return e.guests.length > 0 && c.attending / e.guests.length >= 0.6;
        }
        return true;
      })
      .filter((e) => {
        if (!q.trim()) return true;
        const s = q.toLowerCase();
        return e.title.toLowerCase().includes(s) || e.venue.toLowerCase().includes(s);
      });
  }, [events, q, cat, time]);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Browse, search, and manage all your events.</p>
        </div>
        <Link to="/events/new" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-5 py-3 font-medium hover:opacity-90 transition shadow-lg">
          <Plus className="h-4 w-4" /> New Event
        </Link>
      </header>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 glass-strong rounded-xl px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or venue…"
            className="flex-1 bg-transparent py-2.5 outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {TIMES.map((t) => (
            <Chip key={t} active={time === t} onClick={() => setTime(t)}>
              {t === "all" ? "All time" : t === "high-attendance" ? "High attendance" : t.charAt(0).toUpperCase() + t.slice(1)}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No events match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition border",
        active ? "gradient-primary text-primary-foreground border-transparent" : "glass border-glass-border text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
