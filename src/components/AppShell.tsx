import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, Play, PencilLine, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { to: "/", label: "Hem", icon: Home },
  { to: "/ovningar", label: "Övningar", icon: Sparkles },
  { to: "/start", label: "Starta", icon: Play, primary: true },
  { to: "/reflektion", label: "Reflektion", icon: PencilLine },
  { to: "/min-vecka", label: "Min vecka", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPlayer = pathname.startsWith("/ovning/");

  if (isPlayer) return <>{children}</>;

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidnav */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:gap-1 md:border-r md:bg-card md:p-6">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--stress)] to-[var(--compassion)]" />
          <span className="text-xl font-extrabold">Andrum</span>
        </div>
        {[
          { to: "/", label: "Hem" },
          { to: "/ovningar", label: "Övningar" },
          { to: "/min-vecka", label: "Översikt" },
          { to: "/reflektion", label: "Reflektioner" },
          { to: "/insikter", label: "Insikter" },
        ].map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
            activeProps={{ className: "active" }}
          >
            {it.label}
          </Link>
        ))}
        <p className="mt-auto text-xs text-muted-foreground">
          Andrum är ett stöd för återhämtning och reflektion. Det ersätter inte vård eller terapi.
        </p>
      </aside>

      <main className="flex-1 pb-28 md:pb-12">{children}</main>

      {/* Mobil bottennav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5 items-end px-2 pb-2 pt-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = pathname === it.to;
            if (it.primary) {
              return (
                <li key={it.to} className="-mt-8 flex justify-center">
                  <Link
                    to="/ovningar"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--stress)] text-white shadow-lg shadow-orange-300/50 active:scale-95"
                    aria-label="Starta"
                  >
                    <Icon className="h-7 w-7" />
                  </Link>
                </li>
              );
            }
            return (
              <li key={it.to} className="flex justify-center">
                <Link
                  to={it.to === "/start" ? "/ovningar" : it.to}
                  className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
