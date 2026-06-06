import { createFileRoute, Link } from "@tanstack/react-router";
import { FEELINGS, type Category } from "@/lib/exercises";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andrum – ett litet mellanrum i vardagen" },
      {
        name: "description",
        content:
          "Vad behöver du just nu? Välj en känsla. Få en kort övning eller en längre reflektion.",
      },
    ],
  }),
  component: Home,
});

const TILE_BG: Record<Category, string> = {
  body: "bg-[var(--body)] text-[var(--body-ink)]",
  breath: "bg-[var(--breath)] text-[var(--breath-ink)]",
  anxiety: "bg-[var(--anxiety)] text-[var(--anxiety-ink)]",
  stress: "bg-[var(--stress)] text-[var(--stress-ink)]",
  focus: "bg-[var(--focus)] text-[var(--focus-ink)]",
  sleep: "bg-[var(--sleep)] text-[var(--sleep-ink)]",
  reflection: "bg-[var(--reflection)] text-[var(--reflection-ink)]",
  "quick-pause": "bg-[var(--quick-pause)] text-[var(--quick-pause-ink)]",
  compassion: "bg-[var(--compassion)] text-[var(--compassion-ink)]",
  anger: "bg-[var(--anger)] text-[var(--anger-ink)]",
  worklife: "bg-[var(--worklife)] text-[var(--worklife-ink)]",
};

function Home() {
  const [greeting, setGreeting] = useState<string>("Hej");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 5
        ? "Sen natt"
        : hour < 10
          ? "God morgon"
          : hour < 17
            ? "Hej"
            : hour < 22
              ? "God kväll"
              : "Sen kväll",
    );
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 pt-4 md:px-10 md:pt-10">
      <header className="mb-6 md:mb-8">
        <p className="text-sm font-semibold text-muted-foreground">{greeting}.</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">
          Vad behöver du <span className="text-[var(--stress)]">just nu</span>?
        </h1>
      </header>

      {/* Primär CTA — en kort paus */}
      <Link
        to="/ovning/$id"
        params={{ id: "mellan-tva-moten" }}
        className="group relative mb-6 flex items-center justify-between gap-3 overflow-hidden rounded-3xl bg-foreground p-5 text-background shadow-lg transition active:scale-[0.99] md:mb-8 md:p-6"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            Om du bara har en minut
          </p>
          <p className="mt-1 text-xl font-extrabold leading-tight md:text-2xl">
            Starta en minutspaus
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-background/15 backdrop-blur md:h-14 md:w-14">
          <Timer className="h-6 w-6" />
        </div>
      </Link>

      {/* Alla kategorier — enhetligt rutnät med lika stora kort */}
      <section
        aria-label="Välj ett behov"
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
      >
        {FEELINGS.map((f, i) => (
          <motion.div
            key={f.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
          >
            <Link
              to="/k/$category"
              params={{ category: f.category }}
              className={`group relative flex h-[140px] items-end overflow-hidden rounded-3xl ${TILE_BG[f.category]} p-4 shadow-sm transition active:scale-[0.98] hover:shadow-md sm:h-[170px] md:aspect-square md:h-auto md:p-6`}
            >
              <TileDecor category={f.category} />
              <h2 className="relative text-xl font-extrabold leading-[1.05] tracking-tight sm:text-2xl md:text-3xl lg:text-[2rem]">
                {f.label}
              </h2>
            </Link>
          </motion.div>
        ))}
      </section>

      <p className="mt-10 max-w-prose text-xs text-muted-foreground">
        Andrum är ett stöd för återhämtning och reflektion. Det ersätter inte vård eller terapi.
      </p>
    </div>
  );
}

function TileDecor({ category }: { category: Category }) {
  const items: Partial<Record<Category, ReactNode>> = {
    body: (
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/20" />
    ),
    breath: (
      <>
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
        <div className="absolute -bottom-6 -left-2 h-16 w-32 rounded-[100%] bg-white/10" />
      </>
    ),
    anxiety: (
      <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/20" />
    ),
    stress: (
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-orange-300/50" />
    ),
    focus: (
      <div className="absolute right-2 top-2 h-16 w-16 rounded-full bg-yellow-300/50" />
    ),
    sleep: (
      <>
        <div className="absolute right-5 top-5 h-10 w-10 rounded-full bg-yellow-100/70" />
        <div className="absolute -bottom-10 -left-6 h-24 w-48 rounded-[100%] bg-white/10" />
      </>
    ),
    reflection: (
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-3xl bg-white/15 rotate-12" />
    ),
    "quick-pause": (
      <div className="absolute -right-6 -bottom-8 h-24 w-24 rounded-3xl bg-white/30 rotate-6" />
    ),
  };
  return <>{items[category]}</>;
}
