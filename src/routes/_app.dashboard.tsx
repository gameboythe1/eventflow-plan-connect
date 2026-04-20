import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/GlassCard";
import { EventCard } from "@/components/EventCard";
import { CalendarDays, Users, TrendingUp, Clock, Plus, ArrowRight } from "lucide-react";
import { isUpcoming, rsvpCounts } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EventFlow" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const events = useStore((s) => s.events);
  const activity = useStore((s) => s.activity);
  const user = useStore((s) => s.user);

  const upcoming = events.filter(isUpcoming);
  const totalGuests = events.reduce((a, e) => a + e.guests.length, 0);
  const totalResponded = events.reduce((a, e) => {
    const c = rsvpCounts(e); return a + c.attending + c.maybe + c.declined;
  }, 0);
  const rate = totalGuests ? Math.round((totalResponded / totalGuests) * 100) : 0;

  // Monthly events chart (last 6 months + 2 future)
  const start = subMonths(new Date(), 5);
  const months = eachMonthOfInterval({ start, end: subMonths(new Date(), -2) });
  const monthData = months.map((m) => {
    const ms = startOfMonth(m).getTime();
    const me = startOfMonth(subMonths(m, -1)).getTime();
    const count = events.filter((e) => {
      const t = parseISO(e.date).getTime();
      return t >= ms && t < me;
    }).length;
    return { month: format(m, "MMM"), events: count };
  });

  // Attendance breakdown across upcoming events
  const attData = upcoming.slice(0, 6).map((e) => {
    const c = rsvpCounts(e);
    return { name: e.title.length > 14 ? e.title.slice(0, 14) + "…" : e.title, Attending: c.attending, Maybe: c.maybe, Declined: c.declined };
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-1">
            Hey, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Here's what's happening across your events.</p>
        </div>
        <Link to="/events/new" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-5 py-3 font-medium hover:opacity-90 transition shadow-lg">
          <Plus className="h-4 w-4" /> New Event
        </Link>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={events.length} icon={CalendarDays} accent="primary" />
        <StatCard label="Upcoming" value={upcoming.length} hint={`${events.length - upcoming.length} past`} icon={Clock} accent="accent" />
        <StatCard label="Total Guests" value={totalGuests} icon={Users} accent="success" />
        <StatCard label="RSVP Rate" value={`${rate}%`} hint={`${totalResponded}/${totalGuests} responded`} icon={TrendingUp} accent="warning" />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl">Events over time</h2>
              <p className="text-sm text-muted-foreground">Monthly event volume</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthData}>
                <defs>
                  <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 295)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.68 0.22 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.04 270 / 0.3)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.03 270)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.03 270)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.03 270)", border: "1px solid oklch(0.3 0.03 270 / 0.5)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="events" stroke="oklch(0.68 0.22 295)" strokeWidth={2.5} fill="url(#grad-primary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl">Recent activity</h2>
          <p className="text-sm text-muted-foreground mb-4">Latest updates</p>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin pr-2">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No activity yet. Create your first event!</p>
            ) : activity.slice(0, 12).map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{format(parseISO(a.createdAt), "MMM d · h:mm a")}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {attData.length > 0 && (
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl mb-1">Attendance by upcoming event</h2>
          <p className="text-sm text-muted-foreground mb-4">RSVP breakdown</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.04 270 / 0.3)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.03 270)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 270)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.03 270)", border: "1px solid oklch(0.3 0.03 270 / 0.5)", borderRadius: 12 }} />
                <Bar dataKey="Attending" stackId="a" fill="oklch(0.72 0.18 155)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Maybe" stackId="a" fill="oklch(0.8 0.16 75)" />
                <Bar dataKey="Declined" stackId="a" fill="oklch(0.65 0.24 22)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl">Upcoming events</h2>
          <Link to="/events" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.slice(0, 6).map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      </section>
    </div>
  );
}
