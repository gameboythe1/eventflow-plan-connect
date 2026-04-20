import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { EventCategory, AppEvent } from "@/lib/types";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/events/new")({
  head: () => ({ meta: [{ title: "New event — EventFlow" }] }),
  component: NewEventPage,
});

const CATS: EventCategory[] = ["Conference", "Wedding", "Birthday", "Workshop", "Meetup", "Concert", "Corporate", "Other"];

const COVERS: Record<string, string> = {
  Conference: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  Wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  Birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80",
  Workshop: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
  Meetup: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
  Concert: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80",
  Corporate: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
  Other: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
};

export function EventForm({ initial, onSubmit, submitLabel }: { initial?: Partial<AppEvent>; onSubmit: (data: Omit<AppEvent, "id" | "createdAt" | "guests" | "checklist" | "expenses" | "notes">) => void; submitLabel: string }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(initial?.time ?? "18:00");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [category, setCategory] = useState<EventCategory>((initial?.category as EventCategory) ?? "Meetup");
  const [capacity, setCapacity] = useState(initial?.capacity ?? 50);
  const [budget, setBudget] = useState(initial?.budget ?? 1000);
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? COVERS.Meetup);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, date, time, venue, coverImage: coverImage || COVERS[category], category, capacity: Number(capacity), budget: Number(budget) });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input label="Event title" value={title} onChange={setTitle} required />
      <Textarea label="Description" value={description} onChange={setDescription} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Date" type="date" value={date} onChange={setDate} required />
        <Input label="Time" type="time" value={time} onChange={setTime} required />
      </div>

      <Input label="Venue" value={venue} onChange={setVenue} required />

      <div>
        <Label>Category</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c} type="button" onClick={() => { setCategory(c); if (!initial?.coverImage) setCoverImage(COVERS[c]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${category === c ? "gradient-primary text-primary-foreground border-transparent" : "glass border-glass-border text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Capacity" type="number" value={String(capacity)} onChange={(v) => setCapacity(Number(v))} required />
        <Input label="Budget ($)" type="number" value={String(budget)} onChange={(v) => setBudget(Number(v))} required />
      </div>

      <Input label="Cover image URL" value={coverImage} onChange={setCoverImage} />
      {coverImage && (
        <div className="rounded-xl overflow-hidden border border-glass-border h-40">
          <img src={coverImage} alt="cover preview" className="w-full h-full object-cover" />
        </div>
      )}

      <button className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 font-medium hover:opacity-90 transition">
        <Save className="h-4 w-4" /> {submitLabel}
      </button>
    </form>
  );
}

function NewEventPage() {
  const nav = useNavigate();
  const addEvent = useStore((s) => s.addEvent);

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="h-4 w-4" /> Back to events</Link>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-1">Create event</h1>
      <p className="text-muted-foreground mb-6">Set up the basics. You can add guests, tasks, and budget after.</p>
      <div className="glass-strong rounded-2xl p-6">
        <EventForm submitLabel="Create event" onSubmit={(data) => {
          const id = addEvent(data);
          toast.success("Event created");
          nav({ to: "/events/$eventId", params: { eventId: id } });
        }} />
      </div>
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{children}</span>;
}

export function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary transition placeholder:text-muted-foreground" />
    </label>
  );
}

export function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary transition placeholder:text-muted-foreground resize-none" />
    </label>
  );
}
