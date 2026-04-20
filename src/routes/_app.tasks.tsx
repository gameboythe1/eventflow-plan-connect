import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — EventFlow" }] }),
  component: TasksPage,
});

function TasksPage() {
  const events = useStore((s) => s.events);
  const toggleTask = useStore((s) => s.toggleTask);
  const total = events.reduce((a, e) => a + e.checklist.length, 0);
  const done = events.reduce((a, e) => a + e.checklist.filter((t) => t.done).length, 0);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1">{done} of {total} tasks complete across all events</p>
      </header>
      <div className="space-y-4">
        {events.filter((e) => e.checklist.length).map((e) => (
          <div key={e.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Link to="/events/$eventId" params={{ eventId: e.id }} className="font-display font-bold text-lg hover:gradient-text">{e.title}</Link>
              <span className="text-xs text-muted-foreground">{e.checklist.filter((t) => t.done).length}/{e.checklist.length}</span>
            </div>
            <div className="space-y-2">
              {e.checklist.map((t) => (
                <button key={t.id} onClick={() => toggleTask(e.id, t.id)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 text-left">
                  {t.done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  <span className={`text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {total === 0 && <div className="glass rounded-2xl p-12 text-center text-muted-foreground italic">No tasks yet.</div>}
      </div>
    </div>
  );
}
