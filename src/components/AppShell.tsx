import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, Play, PencilLine, BarChart3, LogIn, LogOut, User as UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const items: { to: string; label: string; icon: typeof Home; primary?: boolean }[] = [
  { to: "/", label: "Hem", icon: Home },
  { to: "/ovningar", label: "Övningar", icon: Sparkles },
  { to: "/start", label: "Starta", icon: Play, primary: true },
  { to: "/reflektion", label: "Reflektion", icon: PencilLine },
  { to: "/min-vecka", label: "Min vecka", icon: BarChart3 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPlayer = pathname.startsWith("/ovning/");
  const isAuth = pathname === "/auth";
  const { user } = useAuth();

  if (isAuth) return <>{children}</>;

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
        <div className="mt-auto space-y-3">
          {user ? (
            <div className="rounded-2xl bg-accent/60 p-3 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <UserIcon className="h-4 w-4" />
                <span className="truncate">{user.email ?? "Inloggad"}</span>
              </div>
              <p className="mt-1 text-muted-foreground">Din historik synkas mellan dina enheter.</p>
              <button
                onClick={() => supabase.auth.signOut()}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-foreground hover:underline"
              >
                <LogOut className="h-3.5 w-3.5" /> Logga ut
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-bold text-background"
            >
              <LogIn className="h-4 w-4" /> Logga in
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            Andrum är ett stöd för återhämtning och reflektion. Det ersätter inte vård eller terapi.
          </p>
        </div>
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
