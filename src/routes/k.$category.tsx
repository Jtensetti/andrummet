import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Zap, Brain, Wind } from "lucide-react";
import { useState } from "react";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_SUBTITLE,
  getByCategory,
  getByKind,
  type Category,
  type ExerciseKind,
} from "@/lib/exercises";

export const Route = createFileRoute("/k/$category")({
  loader: ({ params }) => {
    if (!ALL_CATEGORIES.includes(params.category as Category)) throw notFound();
    return { category: params.category as Category };
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${CATEGORY_LABELS[params.category as Category] ?? "Andrum"} – Andrum`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <p className="text-sm">Kategorin hittades inte.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <p>{error.message}</p>
    </div>
  ),
  component: CategoryPage,
});

const THEME: Record<Category, { bg: string; ink: string; chip: string }> = {
  body: { bg: "bg-[var(--body)]", ink: "text-[var(--body-ink)]", chip: "bg-black/10 text-[var(--body-ink)]" },
  breath: { bg: "bg-[var(--breath)]", ink: "text-[var(--breath-ink)]", chip: "bg-white/20 text-[var(--breath-ink)]" },
  anxiety: { bg: "bg-[var(--anxiety)]", ink: "text-[var(--anxiety-ink)]", chip: "bg-white/20 text-[var(--anxiety-ink)]" },
  stress: { bg: "bg-[var(--stress)]", ink: "text-[var(--stress-ink)]", chip: "bg-black/10 text-[var(--stress-ink)]" },
  focus: { bg: "bg-[var(--focus)]", ink: "text-[var(--focus-ink)]", chip: "bg-black/10 text-[var(--focus-ink)]" },
  sleep: { bg: "bg-[var(--sleep)]", ink: "text-[var(--sleep-ink)]", chip: "bg-white/15 text-[var(--sleep-ink)]" },
  reflection: { bg: "bg-[var(--reflection)]", ink: "text-[var(--reflection-ink)]", chip: "bg-white/20 text-[var(--reflection-ink)]" },
  "quick-pause": { bg: "bg-[var(--quick-pause)]", ink: "text-[var(--quick-pause-ink)]", chip: "bg-black/10 text-[var(--quick-pause-ink)]" },
  compassion: { bg: "bg-[var(--compassion)]", ink: "text-[var(--compassion-ink)]", chip: "bg-white/30 text-[var(--compassion-ink)]" },
  anger: { bg: "bg-[var(--anger)]", ink: "text-[var(--anger-ink)]", chip: "bg-white/20 text-[var(--anger-ink)]" },
  worklife: { bg: "bg-[var(--worklife)]", ink: "text-[var(--worklife-ink)]", chip: "bg-black/10 text-[var(--worklife-ink)]" },
};

type Filter = ExerciseKind | "all";

function CategoryPage() {
  const data = Route.useLoaderData() as { category: Category };
  const category = data.category;
  const t = THEME[category];
  const all = getByCategory(category);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const exercises = getByKind(category, filter);
  const visible = expanded ? exercises : exercises.slice(0, 8);
  const quick = all.find((e) => e.kind === "short" && e.minutes <= 2) ?? all[0];

  return (
    <div className={`relative min-h-[100dvh] ${t.bg} ${t.ink}`}>
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-6 md:px-8 md:pt-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-full bg-black/10 px-3 py-1.5 text-xs font-bold transition hover:bg-black/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Hem
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            Ett behov
          </p>
          <h1 className="mt-1 text-4xl font-extrabold leading-tight md:text-5xl">
            {CATEGORY_LABELS[category]}
          </h1>
          <p className="mt-3 max-w-md text-base opacity-90">
            {CATEGORY_SUBTITLE[category]}
          </p>
        </motion.div>

        {quick && (
          <Link
            to="/ovning/$id"
            params={{ id: quick.id }}
            className="mt-8 flex items-center justify-between gap-4 rounded-3xl bg-black/15 px-5 py-4 transition active:scale-[0.99]"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                Snabbstart · {quick.minutes} min
              </p>
              <p className="mt-1 text-lg font-extrabold leading-tight">
                {quick.title}
              </p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/90 text-foreground">
              <Zap className="h-5 w-5" />
            </div>
          </Link>
        )}

        {/* Filter-chips */}
        <div className="mt-7 flex gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            Alla ({all.length})
          </FilterChip>
          <FilterChip active={filter === "short"} onClick={() => setFilter("short")}>
            <Wind className="h-3 w-3" /> Korta
          </FilterChip>
          <FilterChip
            active={filter === "reflective"}
            onClick={() => setFilter("reflective")}
          >
            <Brain className="h-3 w-3" /> Reflekterande
          </FilterChip>
        </div>

        <section className="mt-5 space-y-3">
          {visible.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
            >
              <Link
                to="/ovning/$id"
                params={{ id: ex.id }}
                className="block rounded-3xl bg-black/10 p-5 transition hover:bg-black/15 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold leading-tight">
                        {ex.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm opacity-85">{ex.short}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full ${t.chip} px-3 py-1 text-xs font-bold`}
                  >
                    <Clock className="h-3 w-3" />
                    {ex.minutes} min
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {ex.kind === "short" ? (
                    <>
                      <Wind className="h-3 w-3" /> Kort övning
                    </>
                  ) : (
                    <>
                      <Brain className="h-3 w-3" /> Reflekterande
                    </>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}

          {exercises.length === 0 && (
            <p className="rounded-3xl bg-black/10 p-6 text-sm opacity-80">
              Inga övningar i den här kategorin för det filtret än.
            </p>
          )}

          {exercises.length > 8 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full rounded-full bg-black/15 py-3 text-sm font-bold transition active:scale-[0.99]"
            >
              Visa fler ({exercises.length - 8} till)
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active ? "bg-foreground text-background" : "bg-black/10 hover:bg-black/15"
      }`}
    >
      {children}
    </button>
  );
}
