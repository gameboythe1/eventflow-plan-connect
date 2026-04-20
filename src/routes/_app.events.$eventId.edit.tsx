import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { EventForm } from "./_app.events.new";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/events/$eventId/edit")({
  head: () => ({ meta: [{ title: "Edit event — EventFlow" }] }),
  component: EditEventPage,
});

function EditEventPage() {
  const { eventId } = Route.useParams();
  const event = useStore((s) => s.events.find((e) => e.id === eventId));
  const updateEvent = useStore((s) => s.updateEvent);
  const nav = useNavigate();

  if (!event) {
    return <div className="p-10 text-center"><p>Event not found.</p><Link to="/events" className="text-primary">Back</Link></div>;
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <Link to="/events/$eventId" params={{ eventId }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="h-4 w-4" /> Back to event</Link>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-1">Edit event</h1>
      <p className="text-muted-foreground mb-6">Update the event details.</p>
      <div className="glass-strong rounded-2xl p-6">
        <EventForm initial={event} submitLabel="Save changes" onSubmit={(data) => {
          updateEvent(eventId, data);
          toast.success("Event updated");
          nav({ to: "/events/$eventId", params: { eventId } });
        }} />
      </div>
    </div>
  );
}
