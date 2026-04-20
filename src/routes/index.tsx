import { createFileRoute, redirect } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Hydration is client-side; just redirect — login route handles unauth
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("eventflow-store");
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed?.state?.user) throw redirect({ to: "/dashboard" });
      } catch (e) {
        if ((e as { isRedirect?: boolean }).isRedirect) throw e;
      }
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});

// Suppress unused warning
void useStore;
