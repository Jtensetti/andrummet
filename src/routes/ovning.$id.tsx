import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import { getExercise, METRIC_LABELS } from "@/lib/exercises";
import { addEntry } from "@/lib/history";
import {
  BreathBlob,
  BoxBreath,
  PassingThoughts,
  BodyScan,
  ResetShapes,
  SleepWaves,
  CompassionHeart,
  PulseCircle,
} from "@/components/animations";

export const Route = createFileRoute("/ovning/$id")({
  component: Player,
});

const themeBg: Record<string, string> = {
  calm: "bg-[var(--calm)] text-[var(--calm-ink)]",
  stress: "bg-[var(--stress)] text-[var(--stress-ink)]",
  sleep: "bg-[var(--sleep)] text-[var(--sleep-ink)]",
  anxiety: "bg-[var(--anxiety)] text-[var(--anxiety-ink)]",
  focus: "bg-[var(--focus)] text-[var(--focus-ink)]",
  compassion: "bg-[var(--compassion)] text-[var(--compassion-ink)]",
  recovery: "bg-[var(--recovery)] text-[var(--recovery-ink)]",
};

type Phase = "before" | "running" | "after" | "done";

function Player() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  if (!ex) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <p className="font-bold">Övningen hittades inte.</p>
          <Link to="/ovningar" className="mt-3 inline-block text-sm underline">
            Tillbaka till övningar
          </Link>
        </div>
      </div>
    );
  }
  return <PlayerInner ex={ex} />;
}

function PlayerInner({ ex }: { ex: NonNullable<ReturnType<typeof getExercise>> }) {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("before");
  const [stepIdx, setStepIdx] = useState(0);
  const [stepRemaining, setStepRemaining] = useState(ex.steps[0]?.seconds ?? 0);
  const [paused, setPaused] = useState(false);
  const [ratingBefore, setRatingBefore] = useState<number | null>(null);
  const [ratingAfter, setRatingAfter] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running" || paused) return;
    tickRef.current = window.setInterval(() => {
      setStepRemaining((s) => {
        if (s > 1) return s - 1;
        // gå vidare
        setStepIdx((i) => {
          const next = i + 1;
          if (next >= ex.steps.length) {
            setPhase("after");
            return i;
          }
          setStepRemaining(ex.steps[next].seconds);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase, paused, ex.steps]);

  const totalSeconds = useMemo(
    () => ex.steps.reduce((s, x) => s + x.seconds, 0),
    [ex.steps],
  );
  const elapsed = useMemo(
    () =>
      ex.steps.slice(0, stepIdx).reduce((s, x) => s + x.seconds, 0) +
      (ex.steps[stepIdx]?.seconds ?? 0) -
      stepRemaining,
    [ex.steps, stepIdx, stepRemaining],
  );
  const progress = Math.min(100, (elapsed / totalSeconds) * 100);

  function finish(beforeVal: number | null, afterVal: number | null, text: string) {
    addEntry({
      id: crypto.randomUUID(),
      exerciseId: ex.id,
      title: ex.title,
      category: ex.category,
      minutes: ex.minutes,
      metric: ex.metric,
      ratingBefore: beforeVal ?? undefined,
      ratingAfter: afterVal ?? undefined,
      reflection: text.trim() || undefined,
      completedAt: Date.now(),
    });
    setPhase("done");
  }

  return (
    <div className={`relative min-h-[100dvh] ${themeBg[ex.category]}`}>
      <button
        onClick={() => navigate({ to: "/ovningar" })}
        aria-label="Avsluta"
        className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/10 backdrop-blur"
      >
        <X className="h-5 w-5" />
      </button>

      <AnimatePresence mode="wait">
        {phase === "before" && (
          <motion.div
            key="before"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12"
          >
            <p className="text-sm font-bold uppercase tracking-wide opacity-80">
              {ex.categoryLabel} · {ex.minutes} min
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight">{ex.title}</h1>
            <p className="mt-3 opacity-90">{ex.short}</p>

            <div className="mt-10 rounded-3xl bg-black/10 p-5">
              <p className="text-sm font-bold">
                Hur känns din {METRIC_LABELS[ex.metric].toLowerCase()} just nu?
              </p>
              <RatingRow value={ratingBefore} onChange={setRatingBefore} />
            </div>

            <button
              onClick={() => setPhase("running")}
              className="mt-8 rounded-full bg-black/85 px-6 py-4 text-base font-extrabold text-white active:scale-[0.98]"
            >
              Starta
            </button>
            <button
              onClick={() => setPhase("running")}
              className="mt-2 text-sm font-semibold opacity-70 underline-offset-2 hover:underline"
            >
              Hoppa över skattning
            </button>
          </motion.div>
        )}

        {phase === "running" && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[100dvh] flex-col items-center justify-between px-6 py-10"
          >
            <div className="w-full max-w-md">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/15">
                <motion.div
                  className="h-full bg-white/80"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.4 }}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-10">
              <h2 className="text-center text-5xl font-extrabold leading-tight md:text-6xl">
                {ex.steps[stepIdx]?.label}
              </h2>
              <AnimationFor ex={ex} phase={ex.steps[stepIdx]?.label ?? ""} />
              <p className="text-sm font-semibold opacity-70">
                Steg {stepIdx + 1} av {ex.steps.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaused((p) => !p)}
                className="grid h-14 w-14 place-items-center rounded-full bg-black/15"
                aria-label={paused ? "Fortsätt" : "Pausa"}
              >
                {paused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </button>
            </div>
          </motion.div>
        )}

        {phase === "after" && (
          <motion.div
            key="after"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12"
          >
            <p className="text-sm font-bold uppercase tracking-wide opacity-80">Färdigt</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight">Hur känns det nu?</h1>
            <p className="mt-2 opacity-90">{ex.closing}</p>

            <div className="mt-8 rounded-3xl bg-black/10 p-5">
              <p className="text-sm font-bold">
                Din {METRIC_LABELS[ex.metric].toLowerCase()} just nu
              </p>
              <RatingRow value={ratingAfter} onChange={setRatingAfter} />
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-bold">Vill du lämna en tanke?</span>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="En mening räcker. Din hjärna behöver inte lämna rapport."
                className="mt-2 w-full resize-none rounded-2xl bg-black/10 p-3 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-black/30"
              />
            </label>

            <button
              onClick={() => finish(ratingBefore, ratingAfter, reflection)}
              className="mt-6 rounded-full bg-black/85 px-6 py-4 text-base font-extrabold text-white active:scale-[0.98]"
            >
              Spara och avsluta
            </button>
            <button
              onClick={() => finish(ratingBefore, null, "")}
              className="mt-2 text-sm font-semibold opacity-70 underline-offset-2 hover:underline"
            >
              Hoppa över
            </button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 text-center"
          >
            <div className="text-6xl">🌿</div>
            <h1 className="mt-4 text-3xl font-extrabold">Sparat.</h1>
            <p className="mt-2 opacity-90">{ex.microcopy ?? ex.closing}</p>
            <div className="mt-8 flex flex-col gap-2">
              <Link
                to="/min-vecka"
                className="rounded-full bg-black/85 px-6 py-3 text-sm font-extrabold text-white"
              >
                Se min vecka
              </Link>
              <Link
                to="/ovningar"
                className="rounded-full bg-black/10 px-6 py-3 text-sm font-bold"
              >
                Tillbaka till övningar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimationFor({
  ex,
  phase,
}: {
  ex: ReturnType<typeof getExercise>;
  phase: string;
}) {
  if (!ex) return null;
  switch (ex.animation) {
    case "breath-blob":
      return <BreathBlob phase={phase} />;
    case "box-breath":
      return <BoxBreath phase={phase} />;
    case "passing-thoughts":
      return <PassingThoughts />;
    case "body-scan":
      return <BodyScan />;
    case "reset-shapes":
      return <ResetShapes />;
    case "sleep-waves":
      return <SleepWaves />;
    case "compassion-heart":
      return <CompassionHeart />;
    case "pulse":
      return <PulseCircle />;
  }
}

function RatingRow({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3 grid grid-cols-10 gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`aspect-square rounded-lg text-sm font-bold transition ${
            value === n
              ? "bg-black text-white scale-105"
              : "bg-white/30 hover:bg-white/50"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
