import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { fmtMoney } from "@/lib/format";
import { StatCard } from "@/components/GlassCard";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";

export const Route = createFileRoute("/_app/budget")({
  head: () => ({ meta: [{ title: "Budget — EventFlow" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const events = useStore((s) => s.events);
  const totalBudget = events.reduce((a, e) => a + e.budget, 0);
  const totalSpent = events.reduce((a, e) => a + e.expenses.reduce((s, x) => s + x.amount, 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground mt-1">Track spending across all events</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Budget" value={fmtMoney(totalBudget)} icon={Wallet} accent="primary" />
        <StatCard label="Total Spent" value={fmtMoney(totalSpent)} icon={TrendingDown} accent="warning" />
        <StatCard label="Remaining" value={fmtMoney(remaining)} icon={PiggyBank} accent={remaining >= 0 ? "success" : "warning"} />
      </div>

      <div className="space-y-4">
        {events.map((e) => {
          const spent = e.expenses.reduce((s, x) => s + x.amount, 0);
          const pct = e.budget ? Math.min(100, Math.round((spent / e.budget) * 100)) : 0;
          return (
            <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="block glass rounded-2xl p-5 hover:scale-[1.005] transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-lg">{e.title}</h3>
                <div className="text-sm"><span className="text-muted-foreground">{fmtMoney(spent)} of </span><span className="font-medium">{fmtMoney(e.budget)}</span></div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full ${spent > e.budget ? "bg-destructive" : "gradient-primary"}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{e.expenses.length} expenses</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
