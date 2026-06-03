import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, User as UserIcon, LogIn, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useHistory } from "@/lib/history";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPlayer = pathname.startsWith("/ovning/");
  const isCategory = pathname.startsWith("/k/");
  const isAuth = pathname === "/auth";
  const { user } = useAuth();

  if (isAuth || isPlayer || isCategory) {
    // Fullskärmsvyer — ingen shell
    return <>{children}</>;
  }

  const tabs: { to: string; label: string; icon: typeof Home }[] = [
    { to: "/", label: "Hem", icon: Home },
    { to: "/min-vecka", label: "Min vecka", icon: BarChart3 },
    { to: user ? "/auth" : "/auth", label: user ? "Profil" : "Logga in", icon: user ? UserIcon : LogIn },
  ];

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidopanel — spegeln */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:gap-6 md:border-r md:bg-card md:p-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--stress)] to-[var(--compassion)]" />
          <span className="text-xl font-extrabold">Andrum</span>
        </div>

        <nav className="flex flex-col gap-1">
          <SideLink to="/" label="Hem" />
          <SideLink to="/min-vecka" label="Min vecka" />
        </nav>

        <DesktopMirror />

        <div className="mt-auto space-y-3">
          {user ? (
            <div className="rounded-2xl bg-accent/60 p-3 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <UserIcon className="h-4 w-4" />
                <span className="truncate">{user.email ?? "Inloggad"}</span>
              </div>
              <p className="mt-1 text-muted-foreground">
                Historiken synkas mellan dina enheter.
              </p>
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
              <LogIn className="h-4 w-4" /> Logga in & synka
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            Andrum är ett stöd för återhämtning och reflektion. Det ersätter inte vård eller terapi.
          </p>
        </div>
      </aside>

      <main className="flex-1 pb-28 md:pb-12">
        <div className="flex justify-end px-4 pt-3 md:hidden">
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm"
              aria-label="Logga ut"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span className="max-w-[140px] truncate">{user.email}</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background"
            >
              <LogIn className="h-3.5 w-3.5" /> Logga in
            </Link>
          )}
        </div>
        {children}
      </main>

      {/* Mobil bottennav — 3 ikoner */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-3 px-4 pb-2 pt-2">
          {tabs.map((it) => {
            const Icon = it.icon;
            const active =
              it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
            return (
              <li key={it.label} className="flex justify-center">
                <Link
                  to={it.to}
                  className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] font-semibold ${
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

function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
      activeProps={{ className: "active" }}
      activeOptions={{ exact: to === "/" }}
    >
      {label}
    </Link>
  );
}

/** Mini-analys i sidopanelen — "spegeln" */
function DesktopMirror() {
  const history = useHistory();
  const rated = history.filter(
    (h) => typeof h.ratingBefore === "number" && typeof h.ratingAfter === "number",
  );
  const avgBefore = rated.length
    ? rated.reduce((s, h) => s + (h.ratingBefore || 0), 0) / rated.length
    : null;
  const avgAfter = rated.length
    ? rated.reduce((s, h) => s + (h.ratingAfter || 0), 0) / rated.length
    : null;
  const delta = avgBefore !== null && avgAfter !== null ? avgBefore - avgAfter : null;

  const weekStart = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const week = history.filter((h) => h.completedAt >= weekStart);

  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Den senaste veckan
      </p>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="Pass" value={`${week.length}`} />
        <Row
          label="Snitt ↓"
          value={delta !== null ? delta.toFixed(1) : "–"}
        />
        <Row
          label="Senaste"
          value={
            history[0]
              ? new Date(history[0].completedAt).toLocaleDateString("sv-SE", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "–"
          }
        />
      </div>
      <Link
        to="/min-vecka"
        className="mt-3 block text-center text-xs font-bold text-muted-foreground underline-offset-2 hover:underline"
      >
        Se hela spegeln →
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-extrabold tabular-nums">{value}</span>
    </div>
  );
}
