import { motion } from "framer-motion";

/**
 * Animation kinds. De tio första är de "syftesstyrda" som syncar med
 * övningens steg via stepIndex/stepCount/stepProgress. Övriga finns kvar
 * som legacy-mappar.
 */
export type AnimationKind =
  | "box-breath"
  | "breath-wave"
  | "body-scan"
  | "passing-traffic"
  | "drifting-clouds"
  | "anchor-drop"
  | "focus-lens"
  | "sorting-shelf"
  | "traffic-light"
  | "mailbox"
  // sekundära (ej step-synkade ännu — håller egen rytm)
  | "unknotting"
  | "walking-path"
  | "battery-fill"
  | "volume-slider"
  | "ember"
  // legacy aliases
  | "breath-blob"
  | "passing-thoughts"
  | "reset-shapes"
  | "sleep-waves"
  | "compassion-heart"
  | "pulse"
  | "spiral"
  | "orbit"
  | "pendulum"
  | "drifting-leaves"
  | "closing-tabs"
  | "warm-beam"
  | "lifting-stone"
  | "constellation";

type Props = {
  phase?: string;
  progress?: number;
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number; // 0..1 inom aktuellt steg
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function detectBreath(phase: string): "in" | "out" | "hold" | "rest" | null {
  const p = phase.toLowerCase();
  if (/andas\s*in|in[-\s]?and/.test(p) && !/ut/.test(p)) return "in";
  if (/andas\s*ut|ut[-\s]?and/.test(p)) return "out";
  if (/håll/.test(p)) return "hold";
  if (/vila|paus/.test(p)) return "rest";
  return null;
}

// ─────────────────────────────────────────────────────────────
// 1. BOX-BREATH — pricken vandrar EN sida per steg
// ─────────────────────────────────────────────────────────────
export function BoxBreath({ stepIndex = 0, stepProgress = 0, phase = "" }: Props) {
  const corners = [
    { x: 0, y: 0 },
    { x: 240, y: 0 },
    { x: 240, y: 240 },
    { x: 0, y: 240 },
  ];
  // Mappa steg → sida. Phase override för icke-4-takts pass.
  const b = detectBreath(phase);
  const sideFromPhase =
    b === "in" ? 0 : b === "hold" ? 1 : b === "out" ? 2 : b === "rest" ? 3 : null;
  const side = sideFromPhase ?? stepIndex % 4;
  const from = corners[side];
  const to = corners[(side + 1) % 4];
  const t = clamp01(stepProgress);
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  return (
    <div className="relative" style={{ width: 280, height: 280 }}>
      <div className="absolute inset-0 rounded-3xl border-[6px] border-white/30" />
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-white shadow-[0_0_36px_12px_rgba(255,255,255,0.45)]"
        animate={{ x, y }}
        transition={{ duration: 0.25, ease: "linear" }}
        style={{ top: -4, left: -4 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. BREATH-WAVE — fylls upp på inandning, töms på utandning
// ─────────────────────────────────────────────────────────────
export function BreathWave({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = detectBreath(phase);
  // fallback: alternera in/ut per steg
  const mode = b ?? (stepIndex % 2 === 0 ? "in" : "out");
  const t = clamp01(stepProgress);
  const width =
    mode === "in" ? t : mode === "out" ? 1 - t : mode === "hold" ? 1 : 0.15;
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ width: 320, height: 220 }}
    >
      <div className="absolute inset-0 bg-white/5" />
      <motion.div
        className="absolute inset-y-0 left-0 bg-white/35"
        animate={{ width: `${width * 100}%` }}
        transition={{ duration: 0.4, ease: "linear" }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-2 w-2 rounded-full bg-white/80" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. BODY-SCAN — ljuset hoppar till ny zon per steg
// ─────────────────────────────────────────────────────────────
export function BodyScan({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const start = stepIndex / safeCount;
  const end = (stepIndex + 1) / safeCount;
  const p = start + (end - start) * clamp01(stepProgress);
  return (
    <div className="relative" style={{ width: 160, height: 320 }}>
      <svg viewBox="0 0 160 320" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bodyGr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.65)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="40" r="32" fill="url(#bodyGr)" />
        <rect x="42" y="76" width="76" height="140" rx="32" fill="url(#bodyGr)" />
        <rect x="54" y="216" width="22" height="92" rx="11" fill="url(#bodyGr)" />
        <rect x="84" y="216" width="22" height="92" rx="11" fill="url(#bodyGr)" />
      </svg>
      <motion.div
        className="absolute left-1/2 h-10 w-44 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(254,240,138,0.85) 0%, transparent 70%)",
          filter: "blur(3px)",
          mixBlendMode: "screen",
        }}
        animate={{ top: 10 + p * 280 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. PASSING-TRAFFIC — EN ny form per steg, korsar över
// ─────────────────────────────────────────────────────────────
export function PassingTraffic({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const palette = ["#fbbf24", "#60a5fa", "#f472b6", "#34d399", "#fb923c", "#a78bfa"];
  // Visa nuvarande + tidigare 2 (utvecklas över tid)
  const visible = Array.from({ length: Math.min(stepIndex + 1, stepCount) }, (_, i) => i)
    .slice(-3);
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-black/10" style={{ height: 260 }}>
      <div className="absolute inset-x-0 bottom-10 h-px bg-white/30" />
      {visible.map((i) => {
        const isCurrent = i === stepIndex;
        const t = isCurrent ? clamp01(stepProgress) : 1;
        const yRow = 30 + ((i * 53) % 170);
        const color = palette[i % palette.length];
        const shape = i % 2 === 0 ? "rect" : "round";
        const size = 50 + ((i * 7) % 30);
        return (
          <motion.div
            key={i}
            className={shape === "round" ? "absolute rounded-full" : "absolute rounded-xl"}
            style={{
              top: yRow,
              width: size,
              height: size * 0.55,
              background: color,
              opacity: isCurrent ? 0.95 : 0.35,
            }}
            animate={{ left: `${-15 + t * 130}%` }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. DRIFTING-CLOUDS — ETT nytt moln per steg
// ─────────────────────────────────────────────────────────────
export function DriftingClouds({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const visible = Array.from({ length: Math.min(stepIndex + 1, stepCount) }, (_, i) => i)
    .slice(-4);
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        height: 260,
        background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.16))",
      }}
    >
      {visible.map((i) => {
        const isCurrent = i === stepIndex;
        const t = isCurrent ? clamp01(stepProgress) : 1;
        const y = 20 + ((i * 47) % 180);
        const size = 1 + ((i * 0.3) % 0.7);
        return (
          <motion.svg
            key={i}
            viewBox="0 0 200 80"
            className="absolute"
            style={{
              top: y,
              width: 200 * size,
              opacity: isCurrent ? 0.7 : 0.25,
            }}
            animate={{ left: `${-25 + t * 130}%` }}
            transition={{ duration: 0.6, ease: "linear" }}
          >
            <path
              d="M40 60 Q 20 60 20 45 Q 20 30 38 30 Q 42 18 60 18 Q 78 12 90 28 Q 110 22 120 36 Q 140 36 140 50 Q 140 62 122 62 Z"
              fill="white"
            />
          </motion.svg>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. ANCHOR-DROP — ankaret sjunker ETT snäpp per steg
// ─────────────────────────────────────────────────────────────
export function AnchorDrop({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const start = stepIndex / safeCount;
  const end = (stepIndex + 1) / safeCount;
  const p = start + (end - start) * clamp01(stepProgress);
  const top = 30 + p * 220;
  return (
    <div className="relative overflow-hidden" style={{ width: 240, height: 320 }}>
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.32) 100%)",
        }}
      />
      <div className="absolute inset-x-8 bottom-3 h-1 rounded-full bg-white/20" />
      <motion.div
        className="absolute left-1/2 top-0 w-px bg-white/40"
        animate={{ height: top + 8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.svg
        viewBox="0 0 80 80"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 70, height: 70 }}
        animate={{ top }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <circle cx="40" cy="14" r="8" fill="none" stroke="white" strokeWidth="4" />
        <line x1="40" y1="22" x2="40" y2="58" stroke="white" strokeWidth="4" />
        <path
          d="M16 50 Q 16 70 40 70 Q 64 70 64 50"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line x1="28" y1="36" x2="52" y2="36" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. FOCUS-LENS — en ny punkt samlas in per steg
// ─────────────────────────────────────────────────────────────
export function FocusLens({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const dots = Array.from({ length: stepCount }, (_, i) => {
    const angle = (i / Math.max(1, stepCount)) * Math.PI * 2;
    return {
      i,
      sx: Math.cos(angle) * 120,
      sy: Math.sin(angle) * 120,
    };
  });
  return (
    <div className="relative grid place-items-center" style={{ width: 300, height: 280 }}>
      <div className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.6)]" />
      {dots.map((d) => {
        let t = 0;
        if (d.i < stepIndex) t = 1;
        else if (d.i === stepIndex) t = clamp01(stepProgress);
        const x = d.sx * (1 - t);
        const y = d.sy * (1 - t);
        return (
          <motion.div
            key={d.i}
            className="absolute h-2.5 w-2.5 rounded-full bg-white"
            animate={{ x, y, opacity: 0.4 + t * 0.6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. SORTING-SHELF — en ny lapp läggs i fack per steg
// ─────────────────────────────────────────────────────────────
export function SortingShelf({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const palette = ["#fbbf24", "#60a5fa", "#f472b6", "#34d399", "#fb923c", "#a78bfa"];
  const notes = Array.from({ length: Math.min(stepIndex + 1, stepCount) }, (_, i) => ({
    i,
    slot: i % 3,
    color: palette[i % palette.length],
  }));
  return (
    <div className="relative" style={{ width: 300, height: 240 }}>
      <div className="absolute inset-x-4 top-32 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((s) => (
          <div key={s} className="h-24 rounded-2xl border-2 border-white/40 bg-white/5" />
        ))}
      </div>
      {notes.map((n) => {
        const isCurrent = n.i === stepIndex;
        const t = isCurrent ? clamp01(stepProgress) : 1;
        const startLeft = 110;
        const targetLeft = 20 + n.slot * 95;
        const left = startLeft + (targetLeft - startLeft) * t;
        const top = 0 + 150 * t;
        return (
          <motion.div
            key={n.i}
            className="absolute h-10 w-16 rounded-md shadow-md"
            style={{ background: n.color }}
            animate={{
              left,
              top,
              opacity: isCurrent ? 0.4 + t * 0.6 : 0.9,
              rotate: (1 - t) * (n.slot === 0 ? -8 : n.slot === 2 ? 8 : 0),
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. TRAFFIC-LIGHT — rött → gult → grönt, en åt gången
// ─────────────────────────────────────────────────────────────
export function TrafficLight({ phase = "", stepIndex = 0, stepCount = 1 }: Props) {
  const p = phase.toLowerCase();
  let stage =
    /grön|välj|nästa|handla|skicka/.test(p)
      ? 2
      : /gul|märk|lägg märke|känns|rädd/.test(p)
        ? 1
        : /röd|stanna|stopp|lägg/.test(p)
          ? 0
          : -1;
  if (stage === -1 && stepCount > 0) {
    // dela stegen i tre tredjedelar
    const r = stepIndex / Math.max(1, stepCount);
    stage = r < 1 / 3 ? 0 : r < 2 / 3 ? 1 : 2;
  }
  const colors = [
    { color: "#ef4444", glow: "rgba(239,68,68,0.6)" },
    { color: "#facc15", glow: "rgba(250,204,21,0.6)" },
    { color: "#22c55e", glow: "rgba(34,197,94,0.6)" },
  ];
  return (
    <div className="relative grid place-items-center" style={{ width: 140, height: 320 }}>
      <div className="flex h-full w-28 flex-col items-center justify-around rounded-3xl bg-black/40 p-4">
        {colors.map((c, i) => {
          const active = stage === i;
          return (
            <motion.div
              key={i}
              className="h-20 w-20 rounded-full"
              style={{ background: c.color }}
              animate={{
                opacity: active ? 1 : 0.18,
                boxShadow: active ? `0 0 40px 10px ${c.glow}` : `0 0 0 ${c.glow}`,
              }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. MAILBOX — en lapp läggs ner i lådan per steg
// ─────────────────────────────────────────────────────────────
export function Mailbox({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const notes = Array.from({ length: Math.min(stepIndex + 1, stepCount) }, (_, i) => i);
  return (
    <div className="relative" style={{ width: 320, height: 260 }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="h-32 w-44 rounded-t-3xl bg-white/85 shadow-xl">
          <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-black/60" />
          <div className="mx-auto mt-3 text-center text-xs font-extrabold text-black/70">
            SEN
          </div>
        </div>
        <div className="h-3 w-44 rounded-b-md bg-white/60" />
      </div>
      {notes.map((i) => {
        const isCurrent = i === stepIndex;
        const t = isCurrent ? clamp01(stepProgress) : 1;
        const top = -20 + t * 130;
        const opacity = isCurrent ? (t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15) : 0;
        return (
          <motion.div
            key={i}
            className="absolute h-10 w-20 rounded-md bg-yellow-200 shadow"
            style={{ left: "50%", marginLeft: -40 }}
            animate={{ top, opacity, rotate: -8 + t * 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SEKUNDÄRA (egen rytm — uppdateras nästa pass)
// ─────────────────────────────────────────────────────────────
export function Unknotting() {
  return (
    <div className="relative" style={{ width: 300, height: 220 }}>
      <svg viewBox="0 0 300 220" className="absolute inset-0">
        <motion.path
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{
            d: [
              "M20 110 C 80 30, 80 190, 150 110 C 220 30, 220 190, 280 110",
              "M20 110 C 80 60, 80 160, 150 110 C 220 60, 220 160, 280 110",
              "M20 110 C 80 95, 80 125, 150 110 C 220 95, 220 125, 280 110",
              "M20 110 C 100 105, 200 115, 280 110",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export function WalkingPath({ progress }: Props) {
  const p = typeof progress === "number" ? clamp01(progress) : undefined;
  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ width: 320, height: 220 }}>
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-[oklch(0.85_0.1_80/0.4)]" />
        <div className="absolute inset-x-0 top-1/3 h-1/3 bg-[oklch(0.78_0.1_150/0.4)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.7_0.1_245/0.4)]" />
      </div>
      <svg viewBox="0 0 320 220" className="absolute inset-0">
        <path
          d="M 20 180 Q 100 140 160 130 T 300 60"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="3"
          strokeDasharray="6 8"
        />
      </svg>
      <motion.div
        className="absolute h-6 w-6 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.5)]"
        {...(p !== undefined
          ? {
              animate: { left: `${20 + p * 270}px`, top: `${180 - p * 130}px` },
              transition: { duration: 0.8, ease: "easeInOut" },
            }
          : {
              animate: { left: [20, 300], top: [180, 60] },
              transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            })}
      />
    </div>
  );
}

export function BatteryFill({ progress }: Props) {
  const p = typeof progress === "number" ? clamp01(progress) : 0.3;
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 260 }}>
      <div className="relative h-56 w-32 rounded-3xl border-[6px] border-white/70">
        <div className="absolute -top-4 left-1/2 h-4 w-12 -translate-x-1/2 rounded-t-md bg-white/70" />
        <motion.div
          className="absolute inset-x-1 bottom-1 rounded-2xl bg-gradient-to-t from-emerald-400 to-emerald-200"
          animate={{ height: `${10 + p * 90}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function VolumeSlider({ stepIndex = 0, stepCount = 1, stepProgress = 0, progress }: Props) {
  const safeCount = Math.max(1, stepCount);
  const stepBased = (stepIndex + clamp01(stepProgress)) / safeCount;
  const p = typeof progress === "number" ? clamp01(progress) : stepBased;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 320 }}>
      <div className="relative h-72 w-8 rounded-full bg-white/15">
        <div
          className="absolute inset-x-0 bottom-0 rounded-full bg-white/70"
          style={{ height: `${(1 - p) * 90 + 10}%` }}
        />
        <motion.div
          className="absolute left-1/2 h-14 w-20 -translate-x-1/2 rounded-2xl bg-white shadow-xl"
          animate={{ top: `${10 + p * 75}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="absolute right-1/4 flex h-72 flex-col justify-between text-[10px] font-bold text-white/60">
        <span>Högt</span>
        <span>Mitt</span>
        <span>Lågt</span>
      </div>
    </div>
  );
}

export function Ember({ progress }: Props) {
  const p = typeof progress === "number" ? clamp01(progress) : 0.5;
  const flameOpacity = 1 - p * 0.7;
  const emberOpacity = 0.3 + p * 0.7;
  return (
    <div className="relative grid place-items-end" style={{ width: 260, height: 260 }}>
      <div
        className="absolute inset-x-0 bottom-0 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.7) 0%, rgba(251,146,60,0.3) 50%, transparent 80%)",
          opacity: emberOpacity,
          filter: "blur(2px)",
        }}
      />
      <motion.svg
        viewBox="0 0 100 120"
        className="relative h-48 w-40"
        style={{ opacity: flameOpacity }}
        animate={{ scaleY: [1, 1.12, 0.96, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M50 110 Q 18 100 18 70 Q 18 50 36 38 Q 30 58 44 60 Q 38 42 52 22 Q 56 46 66 50 Q 60 38 74 36 Q 86 56 82 80 Q 82 100 50 110 Z"
          fill="url(#flameG)"
        />
        <defs>
          <linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────
export function AnimationFor({
  kind,
  phase,
  progress,
  stepIndex,
  stepCount,
  stepProgress,
}: {
  kind: AnimationKind;
  phase?: string;
  progress?: number;
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number;
}) {
  const p: Props = { phase, progress, stepIndex, stepCount, stepProgress };
  switch (kind) {
    case "box-breath":
      return <BoxBreath {...p} />;
    case "breath-wave":
      return <BreathWave {...p} />;
    case "body-scan":
      return <BodyScan {...p} />;
    case "passing-traffic":
      return <PassingTraffic {...p} />;
    case "drifting-clouds":
      return <DriftingClouds {...p} />;
    case "anchor-drop":
      return <AnchorDrop {...p} />;
    case "focus-lens":
      return <FocusLens {...p} />;
    case "sorting-shelf":
      return <SortingShelf {...p} />;
    case "traffic-light":
      return <TrafficLight {...p} />;
    case "mailbox":
      return <Mailbox {...p} />;

    case "unknotting":
      return <Unknotting />;
    case "walking-path":
      return <WalkingPath {...p} />;
    case "battery-fill":
      return <BatteryFill {...p} />;
    case "volume-slider":
      return <VolumeSlider {...p} />;
    case "ember":
      return <Ember {...p} />;

    // legacy → mappa till närmaste
    case "breath-blob":
      return <BreathWave {...p} />;
    case "passing-thoughts":
    case "drifting-leaves":
      return <PassingTraffic {...p} />;
    case "reset-shapes":
      return <VolumeSlider {...p} />;
    case "sleep-waves":
      return <BodyScan {...p} />;
    case "compassion-heart":
      return <Unknotting />;
    case "pulse":
      return <AnchorDrop {...p} />;
    case "spiral":
      return <BreathWave {...p} />;
    case "orbit":
      return <SortingShelf {...p} />;
    case "pendulum":
      return <TrafficLight {...p} />;
    case "closing-tabs":
      return <Mailbox {...p} />;
    case "warm-beam":
      return <BodyScan {...p} />;
    case "lifting-stone":
      return <AnchorDrop {...p} />;
    case "constellation":
      return <FocusLens {...p} />;
  }
}
