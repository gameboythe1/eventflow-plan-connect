import { useEffect, useState } from "react";
import { countdown } from "@/lib/format";

export function Countdown({ date, time }: { date: string; time: string }) {
  const [t, setT] = useState(() => countdown(date, time));
  useEffect(() => {
    const i = setInterval(() => setT(countdown(date, time)), 1000);
    return () => clearInterval(i);
  }, [date, time]);

  if (t.past) {
    return <div className="text-sm text-muted-foreground italic">This event has passed.</div>;
  }

  const items = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Sec", value: t.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((it) => (
        <div key={it.label} className="glass-strong rounded-xl p-3 text-center">
          <div className="font-display text-2xl md:text-3xl font-bold gradient-text tabular-nums">{String(it.value).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
