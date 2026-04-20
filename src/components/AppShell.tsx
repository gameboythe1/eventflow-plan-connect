import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { LayoutDashboard, CalendarDays, Users, CheckSquare, Wallet, Sparkles, LogOut, Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/budget", label: "Budget", icon: Wallet },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const nav = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col glass-strong border-r border-glass-border">
        <SidebarContent loc={loc.pathname} user={user} onLogout={() => { logout(); nav({ to: "/login" }); }} onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 glass-strong border-b border-glass-border h-14 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl gradient-primary grid place-items-center"><Sparkles className="h-4 w-4 text-white" /></div>
          <span className="font-display font-bold text-lg">EventFlow</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-secondary"><Menu className="h-5 w-5" /></button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-72 h-full glass-strong border-r border-glass-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary"><X className="h-5 w-5" /></button>
              <SidebarContent loc={loc.pathname} user={user} onLogout={() => { logout(); nav({ to: "/login" }); }} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

function SidebarContent({ loc, user, onLogout, onNavigate }: { loc: string; user: { name: string; email: string } | null; onLogout: () => void; onNavigate: () => void }) {
  return (
    <>
      <div className="p-6">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl gradient-primary grid place-items-center glow"><Sparkles className="h-5 w-5 text-white" /></div>
          <div>
            <div className="font-display font-bold text-xl leading-none">EventFlow</div>
            <div className="text-xs text-muted-foreground mt-1">Plan with magic</div>
          </div>
        </Link>
      </div>

      <div className="px-4">
        <Link
          to="/events/new"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full gradient-primary text-primary-foreground rounded-xl py-2.5 font-medium text-sm hover:opacity-90 transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> New Event
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map((item) => {
          const active = loc === item.to || (item.to !== "/dashboard" && loc.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {active && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl gradient-primary opacity-20"
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              )}
              <Icon className={cn("h-4 w-4 relative z-10", active && "text-primary")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email ?? "—"}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );
}
