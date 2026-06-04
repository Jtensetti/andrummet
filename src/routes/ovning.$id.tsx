import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Pause, Play, ArrowLeft } from "lucide-react";
import { getExercise, METRIC_LABELS, type Category } from "@/lib/exercises";
import { addEntry } from "@/lib/history";
import { AnimationFor } from "@/components/animations";
import { LottiePlayer } from "@/components/animations/LottiePlayer";
import { BoxBreath, type BoxPhase } from "@/components/animations/BoxBreath";
import { BreathWave, type WavePhase } from "@/components/animations/BreathWave";
import { Grounding54321, type Sense } from "@/components/animations/Grounding54321";
import { BodyScan } from "@/components/animations/BodyScan";
import { LeavesOnStream } from "@/components/animations/LeavesOnStream";

export const Route = createFileRoute("/ovning/$id")({
  component: Player,
});

const themeBg: Record<Category, string> = {
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

type Phase = "intro" | "before" | "running" | "after" | "done";

/**
 * Plocka en aktuell undertext-fras ur steg-scriptet utifrån stepProgress.
 * Saknas script används labeln själv som enda fras.
 */
function subtitleFor(
  step: { label: string; script?: string[] } | undefined,
  stepProgress: number,
): { text: string; index: number; total: number } {
  if (!step) return { text: "", index: 0, total: 1 };
  const script = step.script && step.script.length > 0 ? step.script : [step.label];
  const total = script.length;
  const idx = Math.min(total - 1, Math.max(0, Math.floor(stepProgress * total)));
  return { text: script[idx], index: idx, total };
}

function Player() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  if (!ex) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <p className="font-bold">Övningen hittades inte.</p>
          <Link to="/" className="mt-3 inline-block text-sm underline">
            Tillbaka hem
          </Link>
        </div>
      </div>
    );
  }
  return <PlayerInner ex={ex} />;
}

function PlayerInner({ ex }: { ex: NonNullable<ReturnType<typeof getExercise>> }) {
  const navigate = useNavigate();

  const initialPhase: Phase = ex.metaphor
    ? "intro"
    : ex.requiresRating
      ? "before"
      : "running";

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [stepIdx, setStepIdx] = useState(0);
  /** Förfluten tid i aktuellt steg, i millisekunder. Drivs av requestAnimationFrame. */
  const [stepElapsedMs, setStepElapsedMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ratingBefore, setRatingBefore] = useState<number | null>(null);
  const [ratingAfter, setRatingAfter] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  // Smooth klocka via requestAnimationFrame.
  // Vi uppdaterar stepElapsedMs varje frame så att animation, räknare och
  // textbyten kan följa exakt samma timing — inte rycka i 1-sekundssprång.
  useEffect(() => {
    if (phase !== "running" || paused) {
      lastFrameRef.current = null;
      return;
    }
    const loop = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const delta = now - last;
      lastFrameRef.current = now;
      setStepElapsedMs((prev) => {
        const stepMs = (ex.steps[stepIdx]?.seconds ?? 1) * 1000;
        const next = prev + delta;
        if (next >= stepMs) {
          const overflow = next - stepMs;
          const nextIdx = stepIdx + 1;
          if (nextIdx >= ex.steps.length) {
            setPhase(ex.requiresRating ? "after" : "done");
            return stepMs;
          }
          setStepIdx(nextIdx);
          return overflow;
        }
        return next;
      });
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [phase, paused, ex.steps, ex.requiresRating, stepIdx]);

  // Nollställ stegklockan när stegindex byts (efter overflow-hopp ovan
  // sätter loopen tillbaka ett kort värde; här försäkrar vi 0 vid faktiskt byte).
  useEffect(() => {
    setStepElapsedMs(0);
  }, [stepIdx]);

  const totalSeconds = useMemo(
    () => ex.steps.reduce((s, x) => s + x.seconds, 0),
    [ex.steps],
  );
  const stepSeconds = ex.steps[stepIdx]?.seconds ?? 1;
  const stepElapsed = stepElapsedMs / 1000;
  const stepRemaining = Math.max(0, stepSeconds - stepElapsed);
  const stepProgress = Math.min(
    1,
    Math.max(0, stepElapsed / Math.max(1, stepSeconds)),
  );
  const elapsed = useMemo(
    () =>
      ex.steps.slice(0, stepIdx).reduce((s, x) => s + x.seconds, 0) + stepElapsed,
    [ex.steps, stepIdx, stepElapsed],
  );
  const progress = Math.min(1, elapsed / Math.max(1, totalSeconds));
  void stepRemaining;

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

  function afterToDone() {
    if (ex.requiresRating || ex.reflectionPrompt) {
      setPhase("after");
    } else {
      finish(null, null, "");
    }
  }

  const delta =
    ratingBefore !== null && ratingAfter !== null
      ? ratingBefore - ratingAfter
      : null;

  return (
    <div className={`relative min-h-[100dvh] ${themeBg[ex.category]}`}>
      <button
        onClick={() =>
          navigate({ to: "/k/$category", params: { category: ex.category } })
        }
        aria-label="Avsluta"
        className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/10 backdrop-blur"
      >
        <X className="h-5 w-5" />
      </button>

      <AnimatePresence mode="wait">
        {phase === "intro" && ex.metaphor && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-75">
              Bilden bakom övningen
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
              {ex.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed opacity-95">
              {ex.metaphor.intro}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="rounded-3xl bg-black/10 p-6">
                <AnimationFor
                  kind={ex.metaphor.illustration ?? ex.animation}
                  phase="andas in"
                  progress={0.4}
                />
              </div>
            </div>
            <p className="mt-6 text-center text-xs font-semibold uppercase tracking-widest opacity-60">
              Följ texten — den byter med några sekunders mellanrum.
            </p>
            <button
              onClick={() => setPhase(ex.requiresRating ? "before" : "running")}
              className="mt-6 rounded-full bg-black/85 px-6 py-4 text-base font-extrabold text-white active:scale-[0.98]"
            >
              Jag är med
            </button>
          </motion.div>
        )}

        {phase === "before" && (
          <motion.div
            key="before"
            initial={{ opacity: 0, y: 16 }}
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
                Hur stark är din {METRIC_LABELS[ex.metric].toLowerCase()} just nu?
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
            {ex.metaphor && (
              <button
                onClick={() => setPhase("intro")}
                className="mt-4 inline-flex items-center justify-center gap-1 text-xs font-semibold opacity-60"
              >
                <ArrowLeft className="h-3 w-3" /> Tillbaka till bilden
              </button>
            )}
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
            {/* progress */}
            <div className="w-full max-w-md">
              <div className="h-1 w-full overflow-hidden rounded-full bg-black/15">
                <motion.div
                  className="h-full bg-white/80"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ ease: "linear", duration: 0.4 }}
                />
              </div>
            </div>

            {/* central animation + undertext + steg-rubrik */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {ex.id === "andas-i-en-ruta" ? (
                (() => {
                  const phase = (stepIdx % 4) as BoxPhase;
                  const word =
                    phase === 0
                      ? "Andas in"
                      : phase === 1
                        ? "Håll"
                        : phase === 2
                          ? "Andas ut"
                          : "Vila";
                  const count = Math.min(
                    stepSeconds,
                    Math.floor(stepElapsed) + 1,
                  );
                  return (
                    <>
                      <BoxBreath phaseIndex={phase} phaseProgress={stepProgress} />
                      <div className="flex max-w-md flex-col items-center gap-3 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`bb-${stepIdx}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl"
                          >
                            {word}
                          </motion.p>
                        </AnimatePresence>
                        <div
                          className="flex items-center gap-2 text-lg font-bold tabular-nums"
                          aria-live="polite"
                        >
                          {Array.from({ length: stepSeconds }, (_, i) => i + 1).map(
                            (n) => (
                              <span
                                key={n}
                                className={
                                  n <= count
                                    ? "opacity-100"
                                    : "opacity-30"
                                }
                              >
                                {n}
                              </span>
                            ),
                          )}
                        </div>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                          Följ pricken runt rutan · näsan in, munnen ut
                        </p>
                      </div>
                    </>
                  );
                })()
              ) : ex.id === "lang-utandning" ? (
                (() => {
                  const phase = (stepIdx % 2) as WavePhase;
                  const word = phase === 0 ? "Andas in" : "Andas ut";
                  const count = Math.min(
                    stepSeconds,
                    Math.floor(stepElapsed) + 1,
                  );
                  return (
                    <>
                      <BreathWave phaseIndex={phase} phaseProgress={stepProgress} />
                      <div className="flex max-w-md flex-col items-center gap-3 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`bw-${stepIdx}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl"
                          >
                            {word}
                          </motion.p>
                        </AnimatePresence>
                        <div
                          className="flex flex-wrap items-center justify-center gap-2 text-lg font-bold tabular-nums"
                          aria-live="polite"
                        >
                          {Array.from({ length: stepSeconds }, (_, i) => i + 1).map(
                            (n) => (
                              <span
                                key={n}
                                className={n <= count ? "opacity-100" : "opacity-30"}
                              >
                                {n}
                              </span>
                            ),
                          )}
                        </div>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                          Näsan in · munnen ut · längre ut än in
                        </p>
                      </div>
                    </>
                  );
                })()
              ) : ex.id === "grounding-54321" ? (
                (() => {
                  const senses: Sense[] = ["see", "hear", "feel", "smell", "taste"];
                  const totals = [5, 4, 3, 2, 1];
                  const helpers = [
                    "Låt blicken vandra. Säg sakerna tyst för dig själv.",
                    "Stäng ögonen om du vill. Även tystnad räknas.",
                    "Märk kroppen mot stolen, golvet, kläderna.",
                    "Andas in genom näsan. Inget alls är också ett svar.",
                    "Vad finns kvar i munnen? Stanna med det.",
                  ];
                  const sense = senses[stepIdx] ?? "see";
                  const total = totals[stepIdx] ?? 1;
                  const helper = helpers[stepIdx] ?? "";
                  const raw = stepProgress * total;
                  const activeIndex = Math.min(total - 1, Math.floor(raw));
                  const itemProgress = raw - activeIndex;
                  return (
                    <>
                      <Grounding54321
                        total={total}
                        activeIndex={activeIndex}
                        itemProgress={itemProgress}
                        sense={sense}
                      />
                      <div className="flex max-w-md flex-col items-center gap-3 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`g54-${stepIdx}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
                          >
                            {ex.steps[stepIdx]?.label}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-base font-bold tabular-nums opacity-90">
                          Sak {activeIndex + 1} av {total}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                          {helper}
                        </p>
                      </div>
                    </>
                  );
                })()
              ) : ex.id === "kroppsskanning-huvud-till-fot" ? (
                (() => {
                  const step = ex.steps[stepIdx];
                  const script = step?.script ?? [step?.label ?? ""];
                  const phraseIdx = Math.min(
                    script.length - 1,
                    Math.max(0, Math.floor(stepProgress * script.length)),
                  );
                  const phrase = script[phraseIdx];
                  return (
                    <>
                      <BodyScan zoneIndex={stepIdx} zoneProgress={stepProgress} />
                      <div className="flex max-w-md flex-col items-center gap-3 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`bs-${stepIdx}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
                          >
                            {step?.label}
                          </motion.p>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`bs-p-${stepIdx}-${phraseIdx}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.4 }}
                            className="min-h-[1.5rem] text-base font-semibold opacity-90"
                          >
                            {phrase}
                          </motion.p>
                        </AnimatePresence>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">
                          Bara märk · du behöver inte fixa något
                        </p>
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  {ex.lottie ? (
                    <LottiePlayer
                      spec={ex.lottie}
                      stepProgress={stepProgress}
                      stepIndex={stepIdx}
                    />
                  ) : (
                    <AnimationFor
                      kind={ex.animation}
                      phase={ex.steps[stepIdx]?.label ?? ""}
                      progress={progress}
                      stepIndex={stepIdx}
                      stepCount={ex.steps.length}
                      stepProgress={stepProgress}
                    />
                  )}
                  {(() => {
                    const sub = subtitleFor(ex.steps[stepIdx], stepProgress);
                    return (
                      <div className="flex max-w-md flex-col items-center gap-3 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={`${stepIdx}-${sub.index}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="min-h-[3.5rem] text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
                          >
                            {sub.text}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                          Steg {stepIdx + 1} / {ex.steps.length} · {ex.steps[stepIdx]?.label}
                        </p>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>


            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaused((p) => !p)}
                className="grid h-14 w-14 place-items-center rounded-full bg-black/15"
                aria-label={paused ? "Fortsätt" : "Pausa"}
              >
                {paused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </button>
              <button
                onClick={afterToDone}
                className="rounded-full bg-black/10 px-4 py-3 text-xs font-bold opacity-70"
              >
                Hoppa till slut
              </button>
            </div>
          </motion.div>
        )}

        {phase === "after" && (
          <motion.div
            key="after"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12"
          >
            <p className="text-sm font-bold uppercase tracking-wide opacity-80">
              Färdigt
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight">
              Hur känns det nu?
            </h1>
            <p className="mt-2 opacity-90">{ex.closing}</p>

            {ex.requiresRating && (
              <div className="mt-8 rounded-3xl bg-black/10 p-5">
                <p className="text-sm font-bold">
                  Din {METRIC_LABELS[ex.metric].toLowerCase()} just nu
                </p>
                <RatingRow value={ratingAfter} onChange={setRatingAfter} />
                {delta !== null && delta !== 0 && (
                  <p className="mt-3 text-xs opacity-80">
                    {delta > 0
                      ? `Din skattning gick från ${ratingBefore} till ${ratingAfter}. Det betyder inte att allt är löst — bara en liten signal.`
                      : `Skattningen gick från ${ratingBefore} till ${ratingAfter}. Det räknas också. Du gjorde övningen.`}
                  </p>
                )}
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-sm font-bold">
                {ex.reflectionPrompt ?? "Vill du lämna en tanke?"}
              </span>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="En mening räcker. Alla tankar behöver inte bli dokument."
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
                to="/k/$category"
                params={{ category: ex.category }}
                className="rounded-full bg-black/10 px-6 py-3 text-sm font-bold"
              >
                Tillbaka
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
