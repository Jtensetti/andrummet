import { createFileRoute, Link } from "@tanstack/react-router";
import { FEELINGS } from "@/lib/exercises";
import { useHistory } from "@/lib/history";
import { motion } from "framer-motion";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andrum – ett litet mellanrum i vardagen" },
      {
        name: "description",
        content:
          "Välj en känsla. Få en kort övning. Stäng några flikar i huvudet på två minuter.",
      },
    ],
  }),
  component: Home,
});

const TILE_BG: Record<string, string> = {
  calm: "bg-[var(--calm)] text-[var(--calm-ink)]",
  focus: "bg-[var(--focus)] text-[var(--focus-ink)]",
  anxiety: "bg-[var(--anxiety)] text-[var(--anxiety-ink)]",
  sleep: "bg-[var(--sleep)] text-[var(--sleep-ink)]",
  stress: "bg-[var(--stress)] text-[var(--stress-ink)]",
  compassion: "bg-[var(--compassion)] text-[var(--compassion-ink)]",
};

function Home() {
  const history = useHistory();
  const last = history[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Sen natt" :
    hour < 10 ? "God morgon" :
    hour < 17 ? "Hej" :
    hour < 22 ? "God kväll" :
    "Sen kväll";

  return (
    <div className="mx-auto max-w-5xl px-5 pt-2 md:px-10 md:pt-10">
      <header className="mb-8 md:mb-10">
        <p className="text-sm font-semibold text-muted-foreground">{greeting}.</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-5xl">
          Vad behöver du{" "}
          <span className="text-[var(--stress)]">just nu</span>?
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
          Välj en känsla. Du får en kort övning. Reflektion kan komma sen, om du vill.
        </p>
      </header>

      <section
        aria-label="Välj en känsla"
        className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
      >
        {FEELINGS.map((f, i) => (
          <motion.div
            key={f.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
          >
            <Link
              to="/k/$category"
              params={{ category: f.category }}
              className={`group relative block aspect-square overflow-hidden rounded-3xl ${TILE_BG[f.category]} p-5 shadow-sm transition active:scale-[0.98] hover:shadow-lg md:p-6`}
            >
              <TileDecor category={f.category} />
              <div className="relative flex h-full flex-col justify-between">
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                  {f.question}
                </p>
                <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                  {f.label}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {last && (
        <section className="mt-10">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Senast
          </h3>
          <Link
            to="/ovning/$id"
            params={{ id: last.exerciseId }}
            className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 text-sm"
          >
            <div>
              <p className="font-bold">{last.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(last.completedAt).toLocaleDateString("sv-SE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                {typeof last.ratingBefore === "number" &&
                  typeof last.ratingAfter === "number" && (
                    <> · {last.ratingBefore} → {last.ratingAfter}</>
                  )}
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Gör igen</span>
          </Link>
        </section>
      )}

      <p className="mt-12 max-w-prose text-xs text-muted-foreground">
        Andrum är ett stöd för återhämtning och reflektion. Det ersätter inte vård eller terapi.
      </p>

      <FloatingAkutPaus />
    </div>
  );
}

function TileDecor({ category }: { category: string }) {
  const items: Record<string, JSX.Element> = {
    calm: (
      <>
        <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -bottom-10 -right-2 h-24 w-24 rounded-3xl bg-yellow-300/40 rotate-12" />
      </>
    ),
    focus: (
      <>
        <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-yellow-300/60" />
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-3xl bg-blue-400/30" />
      </>
    ),
    anxiety: (
      <>
        <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/20" />
        <div className="absolute right-6 top-3 h-14 w-14 rounded-2xl bg-orange-300/60" />
      </>
    ),
    sleep: (
      <>
        <div className="absolute right-5 top-5 h-12 w-12 rounded-full bg-yellow-100/80" />
        <div className="absolute -bottom-12 -left-8 h-32 w-64 rounded-[100%] bg-white/10" />
      </>
    ),
    stress: (
      <>
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-orange-300/50" />
        <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-3xl bg-yellow-200/60 rotate-12" />
      </>
    ),
    compassion: (
      <>
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow-200/70" />
        <div className="absolute -bottom-6 left-1/3 h-20 w-20 rounded-full bg-white/40" />
      </>
    ),
  };
  return <>{items[category]}</>;
}

export function FloatingAkutPaus() {
  return (
    <Link
      to="/ovning/$id"
      params={{ id: "akut-paus" }}
      aria-label="Akut paus — 60 sekunder"
      className="fixed bottom-24 right-5 z-30 flex items-center gap-2 rounded-full bg-foreground px-4 py-3 text-xs font-extrabold text-background shadow-xl shadow-black/15 transition active:scale-95 md:bottom-8 md:right-8 md:text-sm"
    >
      <LifeBuoy className="h-4 w-4" />
      60 sek
    </Link>
  );
}
