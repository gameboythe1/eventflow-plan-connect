import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — EventFlow" },
      { name: "description", content: "Sign in to EventFlow to manage your events." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState("demo@eventflow.app");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email);
      nav({ to: "/dashboard" });
    }, 400);
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center glow"><Sparkles className="h-6 w-6 text-white" /></div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue planning magic.</p>
        </div>

        <form onSubmit={submit} className="glass-strong rounded-2xl p-6 space-y-4">
          <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} />

          <button disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60">
            {loading ? "Signing in…" : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">Demo mode — use any email/password.</p>
      </motion.div>
    </AuthLayout>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl -z-10" />
      {children}
    </div>
  );
}

export function Field({ icon: Icon, label, type, value, onChange }: { icon: React.ComponentType<{ className?: string }>; label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 glass rounded-xl px-3 focus-within:ring-2 focus-within:ring-primary transition">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="flex-1 bg-transparent py-2.5 outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}
