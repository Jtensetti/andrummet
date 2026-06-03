import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Zap } from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_SUBTITLE,
  getByCategory,
  type Category,
} from "@/lib/exercises";
import { FloatingAkutPaus } from "./index";

const VALID: Category[] = [
  "calm",
  "focus",
  "anxiety",
  "sleep",
  "stress",
  "compassion",
  "recovery",
];

export const Route = createFileRoute("/k/$category")({
  loader: ({ params }) => {
    if (!VALID.includes(params.category as Category)) throw notFound();
    return { category: params.category as Category };
  },
  head: ({ params }) => ({
    meta: [
      { title: `${CATEGORY_LABELS[params.category as Category] ?? "Andrum"} – Andrum` },
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

const THEME: Record<
  Category,
  { bg: string; ink: string; chip: string; accent: string }
> = {
  calm: {
    bg: "bg-[var(--calm)]",
    ink: "text-[var(--calm-ink)]",
    chip: "bg-white/20 text-[var(--calm-ink)]",
    accent: "var(--calm)",
  },
  focus: {
    bg: "bg-[var(--focus)]",
    ink: "text-[var(--focus-ink)]",
    chip: "bg-black/10 text-[var(--focus-ink)]",
    accent: "var(--focus)",
  },
  anxiety: {
    bg: "bg-[var(--anxiety)]",
    ink: "text-[var(--anxiety-ink)]",
    chip: "bg-white/20 text-[var(--anxiety-ink)]",
    accent: "var(--anxiety)",
  },
  sleep: {
    bg: "bg-[var(--sleep)]",
    ink: "text-[var(--sleep-ink)]",
    chip: "bg-white/15 text-[var(--sleep-ink)]",
    accent: "var(--sleep)",
  },
  stress: {
    bg: "bg-[var(--stress)]",
    ink: "text-[var(--stress-ink)]",
    chip: "bg-black/10 text-[var(--stress-ink)]",
    accent: "var(--stress)",
  },
  compassion: {
    bg: "bg-[var(--compassion)]",
    ink: "text-[var(--compassion-ink)]",
    chip: "bg-white/30 text-[var(--compassion-ink)]",
    accent: "var(--compassion)",
  },
  recovery: {
    bg: "bg-[var(--recovery)]",
    ink: "text-[var(--recovery-ink)]",
    chip: "bg-black/10 text-[var(--recovery-ink)]",
    accent: "var(--recovery)",
  },
};

function CategoryPage() {
  const data = Route.useLoaderData() as { category: Category };
  const category = data.category;
  const t = THEME[category];
  const exercises = getByCategory(category);
  const quick = exercises.find((e) => e.minutes <= 2) ?? exercises[0];

  return (
    <div className={`relative min-h-[100dvh] ${t.bg} ${t.ink}`}>
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-6 md:px-8 md:pt-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-full bg-black/10 px-3 py-1.5 text-xs font-bold transition hover:bg-black/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Hem
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            En känsla
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

        <section className="mt-8 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-70">
            Övningar för dig som vill {CATEGORY_LABELS[category].toLowerCase()}
          </h2>
          {exercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
            >
              <Link
                to="/ovning/$id"
                params={{ id: ex.id }}
                className="block rounded-3xl bg-black/10 p-5 transition hover:bg-black/15 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold leading-tight">
                      {ex.title}
                    </h3>
                    <p className="mt-1 text-sm opacity-85">{ex.short}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full ${t.chip} px-3 py-1 text-xs font-bold`}
                  >
                    <Clock className="h-3 w-3" />
                    {ex.minutes} min
                  </span>
                </div>
                {ex.metaphor && (
                  <p className="mt-3 text-xs italic opacity-75">
                    "{ex.metaphor.intro.split(". ")[0]}."
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </section>
      </div>

      {category !== "recovery" && <FloatingAkutPaus />}
    </div>
  );
}
