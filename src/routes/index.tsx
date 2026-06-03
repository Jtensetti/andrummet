import { createFileRoute, Link } from "@tanstack/react-router";
import { EXERCISES } from "@/lib/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useHistory } from "@/lib/history";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andrum – andas lite, släpp taget, gå vidare" },
      {
        name: "description",
        content:
          "Korta övningar för stress, oro, sömn och fokus. Starta på två tryck.",
      },
    ],
  }),
  component: Home,
});

const NEEDS: { label: string; id: string; tint: string }[] = [
  { label: "Jag behöver lugna mig", id: "andas-med-katten", tint: "bg-[var(--calm)] text-[var(--calm-ink)]" },
  { label: "Jag behöver fokusera", id: "fokus-utan-panik", tint: "bg-[var(--focus)] text-[var(--focus-ink)]" },
  { label: "Jag vill sova", id: "sov-mjukare", tint: "bg-[var(--sleep)] text-[var(--sleep-ink)]" },
  { label: "Jag behöver en paus", id: "reset", tint: "bg-[var(--stress)] text-[var(--stress-ink)]" },
  { label: "Jag känner oro", id: "tankar-som-trafik", tint: "bg-[var(--anxiety)] text-[var(--anxiety-ink)]" },
  { label: "Jag vill bara andas lite", id: "akut-paus", tint: "bg-[var(--recovery)] text-[var(--recovery-ink)]" },
];

function Home() {
  const history = useHistory();
  const recommended = EXERCISES.slice(0, 5);
  const featured = EXERCISES[0];
  const last = history[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "God natt"
    : hour < 10 ? "God morgon"
    : hour < 17 ? "Hej"
    : hour < 22 ? "God kväll"
    : "Sen kväll";

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 md:px-10 md:pt-12">
      <header className="mb-6 md:mb-10">
        <p className="text-sm font-semibold text-muted-foreground">{greeting}.</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">
          Vad behöver du <span className="text-[var(--stress)]">just nu</span>?
        </h1>
      </header>

      <Link
        to="/ovning/$id"
        params={{ id: "akut-paus" }}
        className="group flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-[var(--stress)] to-orange-400 p-6 text-[var(--stress-ink)] shadow-lg shadow-orange-200/50 active:scale-[0.99] md:p-8"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide opacity-80">60 sekunder</p>
          <p className="mt-1 text-2xl font-extrabold leading-tight md:text-3xl">
            Starta en kort paus
          </p>
          <p className="mt-1 text-sm opacity-80">En paus räknas också som framsteg.</p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/90 text-[var(--stress)] transition group-hover:scale-105">
          <ArrowRight className="h-6 w-6" />
        </div>
      </Link>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold md:text-xl">Vad behöver du?</h2>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {NEEDS.map((n) => (
            <Link
              key={n.id}
              to="/ovning/$id"
              params={{ id: n.id }}
              className={`rounded-2xl ${n.tint} px-4 py-4 text-sm font-bold leading-tight shadow-sm active:scale-[0.98]`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-extrabold md:text-xl">Rekommenderat</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <ExerciseCard ex={featured} size="lg" />
          </div>
          {recommended.slice(1).map((ex) => (
            <ExerciseCard key={ex.id} ex={ex} />
          ))}
        </div>
      </section>

      {last && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-extrabold md:text-xl">Senast</h2>
          <div className="rounded-2xl border bg-card p-4 text-sm">
            <p className="font-bold">{last.title}</p>
            <p className="text-muted-foreground">
              {new Date(last.completedAt).toLocaleDateString("sv-SE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {typeof last.ratingBefore === "number" && typeof last.ratingAfter === "number" && (
                <> · {last.ratingBefore} → {last.ratingAfter}</>
              )}
            </p>
          </div>
        </section>
      )}

      <p className="mt-12 max-w-prose text-xs text-muted-foreground">
        Andrum är ett stöd för återhämtning, reflektion och enklare mindfulnessövningar.
        Den ersätter inte vård, terapi eller professionell hjälp.
      </p>
    </div>
  );
}
