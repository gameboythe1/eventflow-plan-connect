import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EventFlow — Plan unforgettable events" },
      { name: "description", content: "EventFlow is a premium event planning and RSVP management platform. Create events, invite guests, track RSVPs, manage budgets and tasks." },
      { property: "og:title", content: "EventFlow — Plan unforgettable events" },
      { property: "og:description", content: "Premium event planning and RSVP management." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (<><Outlet /><Toaster position="top-right" /></>),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
