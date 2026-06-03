import { createFileRoute, Link } from "@tanstack/react-router";
import { useHistory, type HistoryEntry } from "@/lib/history";
import {
  CATEGORY_LABELS,
  METRIC_LABELS,
  type Category,
  type RatingMetric,
} from "@/lib/exercises";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/min-vecka")({
  head: () => ({ meta: [{ title: "Min vecka – Andrum" }] }),
  component: Page,
});

type Tab = "pass" | "insikter";

function Page() {
  const history = useHistory();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("pass");

  const weekStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 6);
    return d.getTime();
  }, []);
  const week = history.filter((h) => h.completedAt >= weekStart);
  const rated = history.filter(
    (h) =>
      typeof h.ratingBefore === "number" && typeof h.ratingAfter === "number",
  );

  // Effect-first: snittförändring och bäst-fungerande kategori
  const avgBefore = rated.length
    ? rated.reduce((s, h) => s + (h.ratingBefore || 0), 0) / rated.length
    : null;
  const avgAfter = rated.length
    ? rated.reduce((s, h) => s + (h.ratingAfter || 0), 0) / rated.length
    : null;
  const delta = avgBefore !== null && avgAfter !== null ? avgBefore - avgAfter : null;

  return (
    <div className="mx-auto max-w-5xl px-5 pt-2 md:px-10 md:pt-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Min vecka</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            En vänlig spegel — inte ett betyg.
          </p>
        </div>
        <SyncBadge online={!!user} />
      </header>

      {/* Effekt-block överst */}
      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <BigStat
          label="Snittförändring"
          value={
            delta !== null
              ? `↓ ${delta.toFixed(1)}`
              : "–"
          }
          hint={
            avgBefore !== null && avgAfter !== null
              ? `Från ${avgBefore.toFixed(1)} till ${avgAfter.toFixed(1)}`
              : "Skatta före/efter en övning så fyller vi i."
          }
        />
        <BigStat
          label="Vad funkar bäst"
          value={bestCategoryLabel(rated)}
          hint="Störst sänkning de senaste 14 dagarna"
        />
        <BigStat
          label="När du oftast pausar"
          value={topHourLabel(history)}
          hint="Lägg en påminnelse där om du vill"
        />
      </section>

      {/* Tab-bar */}
      <div className="mt-8 flex gap-2 border-b">
        <TabBtn active={tab === "pass"} onClick={() => setTab("pass")}>
          Pass
        </TabBtn>
        <TabBtn active={tab === "insikter"} onClick={() => setTab("insikter")}>
          Insikter
        </TabBtn>
      </div>

      {tab === "pass" && <PassTab history={history} week={week} />}
      {tab === "insikter" && <InsiktTab history={history} />}

      <p className="mt-12 max-w-prose text-xs text-muted-foreground">
        {week.length} {week.length === 1 ? "pass" : "pass"} de senaste 7 dagarna.
        Inget mål, ingen streak — bara en spegel.
      </p>
    </div>
  );
}

function SyncBadge({ online }: { online: boolean }) {
  if (online) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
        <Wifi className="h-3 w-3" /> Synkad – uppdateras live
      </span>
    );
  }
  return (
    <Link
      to="/auth"
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800"
    >
      <WifiOff className="h-3 w-3" /> Bara på den här enheten – logga in för synk
    </Link>
  );
}

function PassTab({ history, week }: { history: HistoryEntry[]; week: HistoryEntry[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const items = history.filter(
      (h) => h.completedAt >= d.getTime() && h.completedAt < next.getTime(),
    );
    return {
      label: d.toLocaleDateString("sv-SE", { weekday: "short" }),
      count: items.length,
      items,
    };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <>
      <section className="mt-6 rounded-3xl border bg-card p-5 md:p-7">
        <h2 className="text-lg font-extrabold">Senaste 7 dagarna</h2>
        <div className="mt-5 flex items-end gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-xl bg-[var(--stress)] transition-all"
                  style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 6 }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {d.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {week.length} pass · {week.reduce((s, h) => s + h.minutes, 0)} minuter den här veckan.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-extrabold">Senaste pass</h2>
        {history.length === 0 ? (
          <div className="rounded-3xl border bg-card p-8 text-center">
            <p className="text-lg font-bold">Här var det tomt.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lite som huvudet efter en riktigt bra paus. Teoretiskt i alla fall.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
            >
              Välj en känsla
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 12).map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-bold">{h.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.completedAt).toLocaleString("sv-SE", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {METRIC_LABELS[h.metric]}
                  </p>
                  {h.reflection && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      "{h.reflection}"
                    </p>
                  )}
                </div>
                {typeof h.ratingBefore === "number" &&
                  typeof h.ratingAfter === "number" && (
                    <span className="text-xs font-bold">
                      {h.ratingBefore} → {h.ratingAfter}
                    </span>
                  )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function InsiktTab({ history }: { history: HistoryEntry[] }) {
  // Före/efter per mätare
  const byMetric: Record<string, { before: number; after: number; n: number }> = {};
  for (const h of history) {
    if (typeof h.ratingBefore !== "number" || typeof h.ratingAfter !== "number")
      continue;
    const m = (byMetric[h.metric] ||= { before: 0, after: 0, n: 0 });
    m.before += h.ratingBefore;
    m.after += h.ratingAfter;
    m.n += 1;
  }

  const insights: string[] = [];
  for (const [metric, v] of Object.entries(byMetric)) {
    if (v.n < 2) continue;
    const diff = v.before / v.n - v.after / v.n;
    if (diff > 0.5) {
      insights.push(
        `Din skattning av ${METRIC_LABELS[metric as RatingMetric].toLowerCase()} brukar sjunka med ${diff.toFixed(1)} poäng efter en övning.`,
      );
    }
  }

  // Kategorimix
  const byCategory: Record<string, number> = {};
  for (const h of history) byCategory[h.category] = (byCategory[h.category] || 0) + 1;
  const maxCat = Math.max(1, ...Object.values(byCategory));

  // Senaste reflektion
  const lastReflection = history.find((h) => h.reflection);

  return (
    <>
      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {insights.length === 0 ? (
          <div className="md:col-span-2 rounded-3xl border bg-card p-6 text-sm text-muted-foreground">
            Det behövs lite mer data för att hitta mönster. Gör ett par övningar
            med skattning före och efter, så återkommer vi.
          </div>
        ) : (
          insights.map((t, i) => (
            <div key={i} className="rounded-3xl border bg-card p-5 text-sm">
              {t}
            </div>
          ))
        )}
      </section>

      <section className="mt-6 rounded-3xl border bg-card p-5 md:p-7">
        <h2 className="text-lg font-extrabold">Vad du oftast väljer</h2>
        {Object.keys(byCategory).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Inget att visa än.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, n]) => (
                <li key={cat} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0 font-bold">
                    {CATEGORY_LABELS[cat as Category]}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(n / maxCat) * 100}%`,
                        background: `var(--${cat})`,
                      }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted-foreground">{n}</span>
                </li>
              ))}
          </ul>
        )}
      </section>

      {lastReflection && (
        <section className="mt-6 rounded-3xl border bg-card p-5 md:p-7">
          <h2 className="text-lg font-extrabold">Senaste reflektion</h2>
          <p className="mt-3 text-base italic">"{lastReflection.reflection}"</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {lastReflection.title} ·{" "}
            {new Date(lastReflection.completedAt).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </section>
      )}
    </>
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-bold transition ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground" />
      )}
    </button>
  );
}

function BigStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold leading-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function bestCategoryLabel(rated: HistoryEntry[]): string {
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
  const acc: Record<string, { diff: number; n: number }> = {};
  for (const h of rated) {
    if (h.completedAt < cutoff) continue;
    if (
      typeof h.ratingBefore !== "number" ||
      typeof h.ratingAfter !== "number"
    )
      continue;
    const a = (acc[h.category] ||= { diff: 0, n: 0 });
    a.diff += h.ratingBefore - h.ratingAfter;
    a.n += 1;
  }
  const ranked = Object.entries(acc)
    .filter(([, v]) => v.n > 0)
    .map(([k, v]) => [k, v.diff / v.n] as const)
    .sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return "–";
  return CATEGORY_LABELS[ranked[0][0] as Category];
}

function topHourLabel(history: HistoryEntry[]): string {
  if (history.length === 0) return "–";
  const counts = new Array(24).fill(0);
  for (const h of history) counts[new Date(h.completedAt).getHours()]++;
  let best = 0;
  for (let i = 1; i < 24; i++) if (counts[i] > counts[best]) best = i;
  if (counts[best] === 0) return "–";
  return `${best.toString().padStart(2, "0")}–${(best + 1).toString().padStart(2, "0")}`;
}
