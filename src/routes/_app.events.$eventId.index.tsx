import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { fmtDateLong, fmtMoney, rsvpCounts } from "@/lib/format";
import { Countdown } from "@/components/Countdown";
import { ArrowLeft, MapPin, CalendarDays, Users, Pencil, Trash2, Plus, X, CheckCircle2, Circle, StickyNote } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { RsvpStatus } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/events/$eventId/")({
  head: ({ params, loaderData }) => {
    void loaderData;
    return { meta: [{ title: `Event — EventFlow`, name: "description", content: `Event details for ${params.eventId}` }] };
  },
  component: EventDetailPage,
  notFoundComponent: () => <div className="p-10">Event not found.</div>,
});

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const event = useStore((s) => s.events.find((e) => e.id === eventId));
  const deleteEvent = useStore((s) => s.deleteEvent);
  const nav = useNavigate();

  if (!event) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Event not found.</p>
        <Link to="/events" className="text-primary hover:underline">Back to events</Link>
      </div>
    );
  }

  const c = rsvpCounts(event);
  const pieData = [
    { name: "Attending", value: c.attending, color: "oklch(0.72 0.18 155)" },
    { name: "Maybe", value: c.maybe, color: "oklch(0.8 0.16 75)" },
    { name: "Declined", value: c.declined, color: "oklch(0.65 0.24 22)" },
    { name: "Pending", value: c.pending, color: "oklch(0.5 0.03 270)" },
  ].filter((d) => d.value > 0);

  const totalSpent = event.expenses.reduce((a, e) => a + e.amount, 0);
  const remaining = event.budget - totalSpent;

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
            <Link to="/events" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-3"><ArrowLeft className="h-4 w-4" /> All events</Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium glass-strong mb-3">{event.category}</span>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{event.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-white/80 text-sm">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {fmtDateLong(event.date)} · {event.time}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.venue}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/events/$eventId/edit" params={{ eventId: event.id }} className="inline-flex items-center gap-2 glass-strong px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition"><Pencil className="h-4 w-4" /> Edit</Link>
                <button
                  onClick={() => { if (confirm("Delete this event?")) { deleteEvent(event.id); toast.success("Event deleted"); nav({ to: "/events" }); } }}
                  className="inline-flex items-center gap-2 glass-strong px-4 py-2 rounded-xl text-sm font-medium hover:bg-destructive/20 hover:text-destructive transition">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-xl mb-2">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </motion.div>

          <GuestList eventId={event.id} />
          <Checklist eventId={event.id} />
          <Budget eventId={event.id} totalSpent={totalSpent} remaining={remaining} />
          <Notes eventId={event.id} />
        </div>

        {/* Right: sidebar */}
        <aside className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-3">Countdown</h3>
            <Countdown date={event.date} time={event.time} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-3">RSVP Analytics</h3>
            <div className="flex items-center gap-2 text-sm mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{event.guests.length}</span>
              <span className="text-muted-foreground">guests · capacity {event.capacity}</span>
            </div>
            {pieData.length > 0 ? (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2} stroke="none">
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.03 270)", border: "1px solid oklch(0.3 0.03 270 / 0.5)", borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-muted-foreground italic">No guests yet.</p>}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Stat label="Attending" value={c.attending} color="text-success" />
              <Stat label="Maybe" value={c.maybe} color="text-warning" />
              <Stat label="Declined" value={c.declined} color="text-destructive" />
              <Stat label="Pending" value={c.pending} color="text-muted-foreground" />
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-lg p-2 text-center">
      <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function GuestList({ eventId }: { eventId: string }) {
  const event = useStore((s) => s.events.find((e) => e.id === eventId))!;
  const addGuest = useStore((s) => s.addGuest);
  const setRsvp = useStore((s) => s.setRsvp);
  const removeGuest = useStore((s) => s.removeGuest);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addGuest(eventId, { name: name.trim(), email: email.trim(), rsvp: "pending" });
    setName(""); setEmail("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">Guest list <span className="text-muted-foreground text-sm font-sans font-normal">({event.guests.length})</span></h2>
      </div>

      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest name" className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        <button className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Invite</button>
      </form>

      {event.guests.length === 0 ? (
        <p className="text-sm text-muted-foreground italic text-center py-6">No guests invited yet.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-2">
          {event.guests.map((g) => (
            <div key={g.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-sm font-semibold text-white shrink-0">{g.name[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{g.name}</div>
                <div className="text-xs text-muted-foreground truncate">{g.email || "—"}</div>
              </div>
              <RsvpSelect value={g.rsvp} onChange={(s) => setRsvp(eventId, g.id, s)} />
              <button onClick={() => removeGuest(eventId, g.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function RsvpSelect({ value, onChange }: { value: RsvpStatus; onChange: (v: RsvpStatus) => void }) {
  const opts: { v: RsvpStatus; label: string; cls: string }[] = [
    { v: "attending", label: "Going", cls: "bg-success/15 text-success" },
    { v: "maybe", label: "Maybe", cls: "bg-warning/15 text-warning" },
    { v: "declined", label: "No", cls: "bg-destructive/15 text-destructive" },
    { v: "pending", label: "Pending", cls: "bg-muted text-muted-foreground" },
  ];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as RsvpStatus)}
      className={`text-xs px-2 py-1 rounded-lg border-0 outline-none cursor-pointer font-medium ${opts.find((o) => o.v === value)?.cls}`}>
      {opts.map((o) => <option key={o.v} value={o.v} className="bg-card text-foreground">{o.label}</option>)}
    </select>
  );
}

function Checklist({ eventId }: { eventId: string }) {
  const event = useStore((s) => s.events.find((e) => e.id === eventId))!;
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const removeTask = useStore((s) => s.removeTask);
  const [text, setText] = useState("");
  const done = event.checklist.filter((t) => t.done).length;
  const pct = event.checklist.length ? Math.round((done / event.checklist.length) * 100) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(eventId, text.trim()); setText("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-xl">Checklist</h2>
        <span className="text-sm text-muted-foreground">{done}/{event.checklist.length}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full gradient-primary rounded-full" />
      </div>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" className="flex-1 glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        <button className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add</button>
      </form>
      <div className="space-y-2">
        {event.checklist.map((t) => (
          <div key={t.id} className="glass rounded-xl p-3 flex items-center gap-3">
            <button onClick={() => toggleTask(eventId, t.id)}>
              {t.done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </button>
            <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.text}</span>
            <button onClick={() => removeTask(eventId, t.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
          </div>
        ))}
        {event.checklist.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-4">No tasks yet.</p>}
      </div>
    </motion.div>
  );
}

const EXPENSE_CATS = ["Venue", "Catering", "Production", "Travel", "Decor", "Marketing", "Other"];

function Budget({ eventId, totalSpent, remaining }: { eventId: string; totalSpent: number; remaining: number }) {
  const event = useStore((s) => s.events.find((e) => e.id === eventId))!;
  const addExpense = useStore((s) => s.addExpense);
  const removeExpense = useStore((s) => s.removeExpense);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Venue");
  const [amount, setAmount] = useState("");
  const pct = event.budget ? Math.min(100, Math.round((totalSpent / event.budget) * 100)) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !amount) return;
    addExpense(eventId, { label: label.trim(), category, amount: Number(amount) });
    setLabel(""); setAmount("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-xl">Budget</h2>
        <div className="text-sm">
          <span className="text-muted-foreground">{fmtMoney(totalSpent)} of </span>
          <span className="font-medium">{fmtMoney(event.budget)}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full rounded-full ${remaining < 0 ? "bg-destructive" : "gradient-primary"}`} />
      </div>
      <p className={`text-xs mb-4 ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
        {remaining >= 0 ? `${fmtMoney(remaining)} remaining` : `Over budget by ${fmtMoney(Math.abs(remaining))}`}
      </p>

      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_140px_120px_auto] gap-2 mb-4">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Expense label" className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
          {EXPENSE_CATS.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
        </select>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        <button className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add</button>
      </form>

      <div className="space-y-2">
        {event.expenses.map((ex) => (
          <div key={ex.id} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{ex.label}</div>
              <div className="text-xs text-muted-foreground">{ex.category}</div>
            </div>
            <div className="font-medium text-sm tabular-nums">{fmtMoney(ex.amount)}</div>
            <button onClick={() => removeExpense(eventId, ex.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
          </div>
        ))}
        {event.expenses.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-4">No expenses yet.</p>}
      </div>
    </motion.div>
  );
}

function Notes({ eventId }: { eventId: string }) {
  const event = useStore((s) => s.events.find((e) => e.id === eventId))!;
  const addNote = useStore((s) => s.addNote);
  const removeNote = useStore((s) => s.removeNote);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addNote(eventId, text.trim()); setText("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><StickyNote className="h-5 w-5" /> Notes</h2>
      <form onSubmit={submit} className="space-y-2 mb-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Add a note…" className="w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
        <button className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add note</button>
      </form>
      <div className="space-y-2">
        {event.notes.map((n) => (
          <div key={n.id} className="glass rounded-xl p-3 flex items-start gap-3">
            <p className="flex-1 text-sm whitespace-pre-wrap">{n.content}</p>
            <button onClick={() => removeNote(eventId, n.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
          </div>
        ))}
        {event.notes.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-4">No notes yet.</p>}
      </div>
    </motion.div>
  );
}
