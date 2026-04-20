import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_app/guests")({
  head: () => ({ meta: [{ title: "Guests — EventFlow" }] }),
  component: GuestsPage,
});

function GuestsPage() {
  const events = useStore((s) => s.events);
  const all = events.flatMap((e) => e.guests.map((g) => ({ ...g, eventTitle: e.title, eventId: e.id, eventDate: e.date })));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Guests</h1>
        <p className="text-muted-foreground mt-1">All guests across your events ({all.length})</p>
      </header>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-glass-border">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">RSVP</th></tr>
          </thead>
          <tbody>
            {all.map((g) => (
              <tr key={g.id + g.eventId} className="border-b border-glass-border hover:bg-secondary/30">
                <td className="px-5 py-3 font-medium">{g.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{g.email || "—"}</td>
                <td className="px-5 py-3"><Link to="/events/$eventId" params={{ eventId: g.eventId }} className="text-primary hover:underline">{g.eventTitle}</Link></td>
                <td className="px-5 py-3 text-muted-foreground">{fmtDate(g.eventDate)}</td>
                <td className="px-5 py-3"><RsvpBadge status={g.rsvp} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {all.length === 0 && <p className="p-12 text-center text-muted-foreground italic">No guests yet.</p>}
      </div>
    </div>
  );
}

function RsvpBadge({ status }: { status: string }) {
  const cls = status === "attending" ? "bg-success/15 text-success" : status === "maybe" ? "bg-warning/15 text-warning" : status === "declined" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground";
  return <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${cls}`}>{status}</span>;
}
