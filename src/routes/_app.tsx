import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("eventflow-store");
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (!parsed?.state?.user) throw redirect({ to: "/login" });
      } catch (e) {
        if ((e as { isRedirect?: boolean }).isRedirect) throw e;
        throw redirect({ to: "/login" });
      }
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
