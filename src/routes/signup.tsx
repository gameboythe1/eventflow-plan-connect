import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — EventFlow" },
      { name: "description", content: "Create your EventFlow account and start planning." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const login = useStore((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name);
    nav({ to: "/dashboard" });
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center glow"><Sparkles className="h-6 w-6 text-white" /></div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Start planning unforgettable events.</p>
        </div>

        <form onSubmit={submit} className="glass-strong rounded-2xl p-6 space-y-4">
          <Field icon={User} label="Full name" type="text" value={name} onChange={setName} />
          <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} />

          <button className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition">
            Create account <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
