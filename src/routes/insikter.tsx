import { createFileRoute } from "@tanstack/react-router";
import { useHistory } from "@/lib/history";
import { CATEGORY_LABELS, METRIC_LABELS, type Category, type RatingMetric } from "@/lib/exercises";

export const Route = createFileRoute("/insikter")({
  head: () => ({ meta: [{ title: "Insikter – Andrum" }] }),
  component: Page,
});

function Page() {
  const history = useHistory();

  const byMetric: Record<string, { before: number; after: number; n: number }> = {};
  for (const h of history) {
    if (typeof h.ratingBefore !== "number" || typeof h.ratingAfter !== "number") continue;
    const m = (byMetric[h.metric] ||= { before: 0, after: 0, n: 0 });
    m.before += h.ratingBefore;
    m.after += h.ratingAfter;
    m.n += 1;
  }

  const byCategory: Record<string, number> = {};
  for (const h of history) byCategory[h.category] = (byCategory[h.category] || 0) + 1;

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

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 md:px-10 md:pt-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Insikter</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Utifrån dina svar — försiktigt formulerat.
      </p>

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

      <section className="mt-8 rounded-3xl border bg-card p-5 md:p-7">
        <h2 className="text-lg font-extrabold">Minuter per kategori</h2>
        <ul className="mt-4 space-y-2">
          {Object.entries(byCategory).map(([cat, n]) => (
            <li key={cat} className="flex items-center gap-3 text-sm">
              <span className="w-32 shrink-0 font-bold">
                {CATEGORY_LABELS[cat as never]}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-[var(--stress)]"
                  style={{
                    width: `${Math.min(100, (n / Math.max(...Object.values(byCategory))) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground">{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
