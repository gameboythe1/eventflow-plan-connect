import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, accent }: { label: string; value: string | number; hint?: string; icon: React.ComponentType<{ className?: string }>; accent?: "primary" | "accent" | "success" | "warning" }) {
  const accentClass = {
    primary: "from-primary/30 to-primary/0",
    accent: "from-accent/30 to-accent/0",
    success: "from-success/30 to-success/0",
    warning: "from-warning/30 to-warning/0",
  }[accent ?? "primary"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative glass rounded-2xl p-5 overflow-hidden group"
    >
      <div className={cn("absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br blur-2xl opacity-60 group-hover:opacity-90 transition", accentClass)} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 text-3xl font-display font-bold tracking-tight">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </div>
    </motion.div>
  );
}
