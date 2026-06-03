import { createFileRoute, Link } from "@tanstack/react-router";
import { useHistory } from "@/lib/history";
import { CATEGORY_LABELS, METRIC_LABELS, type Category } from "@/lib/exercises";
import { useMemo } from "react";

export const Route = createFileRoute("/min-vecka")({
  head: () => ({
    meta: [{ title: "Min vecka – Andrum" }],
  }),
  component: Page,
});

function Page() {
  const history = useHistory();

  const weekStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }, []);

  const week = history.filter((h) => h.completedAt >= weekStart);
  const totalMinutes = week.reduce((s, h) => s + h.minutes, 0);

  const byCategory = week.reduce<Record<string, number>>((acc, h) => {
    acc[h.category] = (acc[h.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  // Insikter
  const rated = week.filter(
    (h) => typeof h.ratingBefore === "number" && typeof h.ratingAfter === "number",
  );
  const avgBefore =
    rated.length > 0
      ? rated.reduce((s, h) => s + (h.ratingBefore || 0), 0) / rated.length
      : null;
  const avgAfter =
    rated.length > 0
      ? rated.reduce((s, h) => s + (h.ratingAfter || 0), 0) / rated.length
      : null;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = history.filter(
      (h) => h.completedAt >= d.getTime() && h.completedAt < next.getTime(),
    ).length;
    return { label: d.toLocaleDateString("sv-SE", { weekday: "short" }), count };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 md:px-10 md:pt-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Min vecka</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        En vänlig spegel — inte ett betyg.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Stat label="Övningar" value={String(week.length)} />
        <Stat label="Minuter" value={String(totalMinutes)} />
        <Stat
          label="Vanligast"
          value={topCategory ? CATEGORY_LABELS[topCategory[0] as never] : "–"}
        />
      </div>

      <section className="mt-8 rounded-3xl border bg-card p-5 md:p-7">
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
      </section>

      {rated.length > 0 && avgBefore !== null && avgAfter !== null && (
        <section className="mt-6 rounded-3xl border bg-card p-5 md:p-7">
          <h2 className="text-lg font-extrabold">Före och efter</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Utifrån dina egna skattningar den här veckan.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Big label="Före" value={avgBefore.toFixed(1)} />
            <span className="text-xl text-muted-foreground">→</span>
            <Big label="Efter" value={avgAfter.toFixed(1)} />
          </div>
          <p className="mt-4 text-sm">
            Dina skattningar brukar sjunka med{" "}
            <strong>{Math.max(0, avgBefore - avgAfter).toFixed(1)}</strong> poäng
            efter en övning. Det är något — inte allt, men något.
          </p>
        </section>
      )}

      {week.length === 0 && (
        <div className="mt-8 rounded-3xl border bg-card p-8 text-center">
          <p className="text-lg font-bold">Här var det tomt.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Lite som huvudet efter en riktigt bra paus. Teoretiskt i alla fall.
          </p>
          <Link
            to="/ovningar"
            className="mt-4 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
          >
            Hitta en övning
          </Link>
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold">Senaste övningar</h2>
        <ul className="space-y-2">
          {history.slice(0, 8).map((h) => (
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
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function Big({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
