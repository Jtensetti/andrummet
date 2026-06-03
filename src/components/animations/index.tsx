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
  // sekundära (poleras nu — alla step-synkade)
  | "unknotting"
  | "walking-path"
  | "battery-fill"
  | "volume-slider"
  | "ember"
  | "candle"
  | "pebbles"
  | "horizon"
  | "opening-hand"
  | "warm-hand"
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
  | "constellation"
  // tredje vågen — kroppsspecifika och kontextuella
  | "belly-hand"
  | "shoulder-drop"
  | "jaw-release"
  | "footprints"
  | "doorway"
  | "first-step"
  | "typing-cursor"
  | "morning-sun"
  | "stretch-up"
  | "inbox-priority"
  // fjärde vågen — situations- och metafor-specifika
  | "release-balloon"
  | "sand-clock"
  | "steering-wheel"
  | "closing-laptop"
  | "note-to-self"
  | "inner-voice"
  | "path-fork"
  | "deflate"
  | "measuring-tape"
  | "dropping-bags";

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
// ─────────────────────────────────────────────────────────────
// 11. UNKNOTTING — en knut släpper per steg
// ─────────────────────────────────────────────────────────────
export function Unknotting({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  // En knut per steg. Knutarna sitter på linjen och "släpper" diskret.
  const safeCount = Math.max(1, stepCount);
  const W = 320;
  const H = 220;
  const knots = Array.from({ length: safeCount }, (_, i) => {
    const t = (i + 1) / (safeCount + 1);
    return { x: 20 + t * (W - 40), i };
  });
  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0">
        {/* baslinje (rep) */}
        <line
          x1={20}
          y1={H / 2}
          x2={W - 20}
          y2={H / 2}
          stroke="white"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.85}
        />
        {knots.map((k) => {
          const isReleased = k.i < stepIndex;
          const isCurrent = k.i === stepIndex;
          const t = isCurrent ? clamp01(stepProgress) : isReleased ? 1 : 0;
          // knut: knot-radie krymper från 18 → 0, opacity fade
          const r = 18 * (1 - t);
          const op = 1 - t * 0.9;
          return (
            <motion.g key={k.i} animate={{ opacity: op }} transition={{ duration: 0.4 }}>
              <circle cx={k.x} cy={H / 2} r={r} fill="white" />
              <circle cx={k.x} cy={H / 2} r={r * 0.55} fill="rgba(0,0,0,0.25)" />
            </motion.g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: safeCount }).map((_, k) => (
          <div
            key={k}
            className="h-1.5 w-4 rounded-full"
            style={{ background: k < stepIndex ? "white" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 12. WALKING-PATH — figuren går till nästa milstolpe per steg
// ─────────────────────────────────────────────────────────────
export function WalkingPath({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const waypoints = Array.from({ length: safeCount + 1 }, (_, i) => {
    const t = i / safeCount;
    return { x: 20 + t * 280, y: 180 - t * 130 };
  });
  const a = waypoints[stepIndex];
  const b = waypoints[Math.min(stepIndex + 1, safeCount)];
  const t = clamp01(stepProgress);
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const bob = Math.sin(t * Math.PI * 4) * 3; // gångrörelse
  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ width: 320, height: 220 }}>
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-[oklch(0.85_0.1_80/0.4)]" />
        <div className="absolute inset-x-0 top-1/3 h-1/3 bg-[oklch(0.78_0.1_150/0.4)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.7_0.1_245/0.4)]" />
      </div>
      <svg viewBox="0 0 320 220" className="absolute inset-0">
        <path
          d="M 20 180 Q 100 140 160 130 T 300 50"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
          strokeDasharray="6 8"
        />
        {waypoints.map((w, i) => {
          const passed = i <= stepIndex;
          return (
            <g key={i}>
              {passed && i > 0 && (
                <circle cx={w.x} cy={w.y} r={8} fill="rgba(255,255,255,0.25)" />
              )}
              <circle
                cx={w.x}
                cy={w.y}
                r={i <= stepIndex ? 4.5 : 3}
                fill={passed ? "white" : "rgba(255,255,255,0.55)"}
              />
            </g>
          );
        })}
      </svg>
      <motion.div
        className="absolute h-7 w-7 rounded-full bg-white shadow-[0_0_24px_8px_rgba(255,255,255,0.55)]"
        animate={{ left: `${x}px`, top: `${y + bob}px` }}
        transition={{ duration: 0.25, ease: "linear" }}
        style={{ marginLeft: -14, marginTop: -14 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 13. BATTERY-FILL — en stapel fylls per steg (diskreta block)
// ─────────────────────────────────────────────────────────────
export function BatteryFill({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const blocks = Array.from({ length: safeCount }, (_, i) => i);
  const filledCount = stepIndex + clamp01(stepProgress);
  const pct = Math.round((filledCount / safeCount) * 100);
  return (
    <div className="relative grid place-items-center" style={{ width: 260, height: 320 }}>
      <div className="relative h-72 w-32 rounded-3xl border-[6px] border-white/80 p-2">
        <div className="absolute -top-4 left-1/2 h-4 w-14 -translate-x-1/2 rounded-t-md bg-white/80" />
        <div className="flex h-full flex-col-reverse gap-1.5">
          {blocks.map((i) => {
            const isCurrent = i === stepIndex;
            const filled = i < stepIndex;
            const t = isCurrent ? clamp01(stepProgress) : filled ? 1 : 0;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-md bg-gradient-to-t from-emerald-500 to-emerald-200"
                animate={{
                  opacity: 0.18 + t * 0.82,
                  scaleY: 0.25 + t * 0.75,
                  boxShadow: isCurrent && t > 0.05
                    ? "0 0 18px rgba(110,231,183,0.65)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
              />
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-0 text-2xl font-black tabular-nums text-white/85">
        {pct}%
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 14. VOLUME-SLIDER — knoppen dras ner ett snäpp per steg
// ─────────────────────────────────────────────────────────────
export function VolumeSlider({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const p = (stepIndex + clamp01(stepProgress)) / safeCount;
  // ljudvågor uppe: tystnar gradvis
  const waveOpacity = 1 - p * 0.85;
  return (
    <div className="relative grid place-items-center" style={{ width: 300, height: 360 }}>
      {/* ljudvågor som tystnar */}
      <svg viewBox="0 0 80 60" className="absolute top-2 h-12 w-24" style={{ opacity: waveOpacity }}>
        {[10, 25, 40, 55, 70].map((x, i) => {
          const h = 8 + (i % 3) * 8;
          return (
            <rect
              key={i}
              x={x - 3}
              y={30 - h / 2}
              width={6}
              height={h}
              rx={3}
              fill="white"
            />
          );
        })}
      </svg>
      <div className="relative h-80 w-10 rounded-full bg-white/15">
        {Array.from({ length: safeCount + 1 }).map((_, i) => {
          const passed = i <= stepIndex;
          return (
            <div
              key={i}
              className="absolute -right-4 h-0.5 rounded-full"
              style={{
                top: `${(i / safeCount) * 100}%`,
                width: passed ? 16 : 10,
                background: passed ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              }}
            />
          );
        })}
        <div
          className="absolute inset-x-0 bottom-0 rounded-full bg-white/70 transition-all"
          style={{ height: `${(1 - p) * 100}%` }}
        />
        <motion.div
          className="absolute left-1/2 h-12 w-20 -translate-x-1/2 rounded-2xl bg-white shadow-xl"
          animate={{ top: `calc(${p * 100}% - 24px)` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <div className="absolute right-6 flex h-72 flex-col justify-between text-[10px] font-bold text-white/70">
        <span>HÖGT</span>
        <span>LÅGT</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 15. EMBER — flamman sjunker till glöd per steg
// ─────────────────────────────────────────────────────────────
export function Ember({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  // diskret: flamhöjd = 1 - stepIndex/safeCount, glöd byggs upp diskret
  const flameLevel = 1 - stepIndex / safeCount;
  const emberLevel = stepIndex / safeCount;
  // gnistor: släpps vid varje stegbyte
  const sparkPhase = clamp01(stepProgress);
  return (
    <div className="relative grid place-items-end" style={{ width: 280, height: 300 }}>
      {/* glöd-bädd nere */}
      <motion.div
        className="absolute inset-x-6 bottom-2 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.8) 0%, rgba(251,146,60,0.45) 45%, transparent 80%)",
          filter: "blur(4px)",
        }}
        animate={{ opacity: 0.2 + emberLevel * 0.8 }}
        transition={{ duration: 0.6 }}
      />
      {/* små glödklumpar som tänds en per steg */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: safeCount }).map((_, i) => {
          const lit = i < stepIndex;
          return (
            <div
              key={i}
              className="h-3 w-5 rounded-full"
              style={{
                background: lit
                  ? "radial-gradient(circle, #fde047 0%, #f97316 60%, #b91c1c 100%)"
                  : "rgba(120,30,30,0.4)",
                boxShadow: lit ? "0 0 8px rgba(251,146,60,0.7)" : "none",
              }}
            />
          );
        })}
      </div>
      {/* flamma som krymper diskret */}
      <motion.svg
        viewBox="0 0 100 120"
        className="relative h-56 w-44"
        animate={{ scaleY: 0.2 + flameLevel * 0.8, opacity: 0.15 + flameLevel * 0.85 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "bottom" }}
      >
        <motion.path
          fill="url(#flameG)"
          animate={{
            d: [
              "M50 110 Q 18 100 18 70 Q 18 50 36 38 Q 30 58 44 60 Q 38 42 52 22 Q 56 46 66 50 Q 60 38 74 36 Q 86 56 82 80 Q 82 100 50 110 Z",
              "M50 110 Q 20 100 20 72 Q 22 52 38 42 Q 32 60 46 62 Q 40 44 52 26 Q 56 48 66 52 Q 62 40 74 38 Q 84 56 80 80 Q 80 100 50 110 Z",
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
      </motion.svg>
      {/* gnistor som flyger upp när ett nytt steg börjar */}
      {sparkPhase < 0.4 && stepIndex > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {[0.2, 0.5, 0.8].map((x, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-amber-200"
              style={{ left: `${x * 100}%`, bottom: 40 }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -100 - i * 20, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 16. CANDLE — ljusets låga dämpas per steg (sömn / lugna ner)
// ─────────────────────────────────────────────────────────────
export function Candle({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  // diskret: vid varje steg sänks lågan till nästa nivå
  const targetLevel = 1 - (stepIndex + clamp01(stepProgress)) / safeCount;
  const flameH = 22 + targetLevel * 48; // 22..70
  const glow = 0.15 + targetLevel * 0.55;
  // vax-droppar: en per slutfört steg
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 340 }}>
      {/* glöd runt lågan */}
      <motion.div
        className="absolute h-44 w-44 rounded-full"
        style={{
          top: 30,
          background:
            "radial-gradient(circle, rgba(254,240,138,0.8) 0%, rgba(251,146,60,0.25) 40%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{ opacity: glow, scale: 0.7 + targetLevel * 0.5 }}
        transition={{ duration: 0.8 }}
      />
      {/* låga */}
      <motion.div
        className="absolute"
        style={{ top: 80, left: "50%", marginLeft: -10 }}
        animate={{ y: 70 - flameH }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.svg
          viewBox="0 0 20 70"
          style={{ width: 22, height: flameH }}
          animate={{ scaleX: [1, 0.94, 1.04, 1], scaleY: [1, 1.04, 0.96, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M10 70 Q 0 58 2 38 Q 4 22 10 0 Q 16 22 18 38 Q 20 58 10 70 Z"
            fill="url(#candleG)"
          />
          <defs>
            <linearGradient id="candleG" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fef9c3" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>
      {/* ljusstake + vax-droppar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-md bg-white/85"
        style={{ top: 170, width: 30, height: 130 }}
      />
      {/* droppe per slutfört steg, växer ner längs ljuset */}
      {Array.from({ length: stepIndex }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/90"
          style={{
            top: 180 + i * 18,
            left: `calc(50% + ${i % 2 === 0 ? -16 : 14}px)`,
            width: 8 + (i % 2) * 2,
            height: 16,
          }}
        />
      ))}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/60"
        style={{ top: 298, width: 90, height: 14 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 17. PEBBLES — en sten läggs i skålen per steg
// ─────────────────────────────────────────────────────────────
export function Pebbles({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const t = clamp01(stepProgress);
  // studsig in-fall: först ner snabbt, sen liten studs
  const fallY = t < 0.7 ? (t / 0.7) * 220 : 220 + Math.sin((t - 0.7) / 0.3 * Math.PI) * -10;
  return (
    <div className="relative" style={{ width: 320, height: 280 }}>
      {/* skål */}
      <div className="absolute bottom-0 left-1/2 h-28 w-60 -translate-x-1/2 overflow-hidden rounded-b-[120px] bg-white/15 border-t-2 border-white/40">
        <div className="absolute inset-x-0 top-0 h-2 bg-white/30" />
      </div>
      {/* befintliga stenar i botten */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-52 flex-wrap justify-center gap-1.5">
        {Array.from({ length: stepIndex }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 26 + (i % 3) * 4,
              height: 18 + (i % 2) * 4,
              background:
                i % 3 === 0
                  ? "#cbd5e1"
                  : i % 3 === 1
                    ? "#e2e8f0"
                    : "#94a3b8",
            }}
          />
        ))}
      </div>
      {/* nuvarande sten faller med studs */}
      {stepIndex < safeCount && (
        <motion.div
          className="absolute left-1/2 h-6 w-9 -translate-x-1/2 rounded-full bg-slate-200 shadow"
          animate={{
            top: -10 + fallY,
            opacity: t < 0.92 ? 1 : 0.15,
            scaleY: t < 0.7 ? 1 : 0.85,
          }}
          transition={{ duration: 0.25, ease: "linear" }}
        />
      )}
      {/* steg-räknare stor och tydlig */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 text-3xl font-black tabular-nums opacity-80">
        {Math.min(stepIndex + 1, safeCount)}
        <span className="text-base opacity-60"> / {safeCount}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 18. HORIZON — solen sjunker mot horisonten per steg (kvällsläge)
// ─────────────────────────────────────────────────────────────
export function Horizon({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const p = (stepIndex + clamp01(stepProgress)) / safeCount;
  const sky =
    p < 0.5
      ? `linear-gradient(180deg, oklch(0.85 0.05 230 / 0.6), oklch(0.78 0.12 60 / 0.55))`
      : `linear-gradient(180deg, oklch(${0.55 - p * 0.35} 0.08 280 / 0.85), oklch(${0.42 - p * 0.22} 0.1 30 / 0.7))`;
  const sunY = 30 + p * 160;
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ width: 320, height: 240, background: sky }}
    >
      {/* sol */}
      <motion.div
        className="absolute left-1/2 h-24 w-24 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #fef08a 0%, #f97316 65%, transparent 100%)",
          filter: "blur(1px)",
          boxShadow: "0 0 40px rgba(251,146,60,0.6)",
        }}
        animate={{ top: sunY, opacity: 1 - p * 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* hav/horisont */}
      <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))" }} />
      <div className="absolute inset-x-0" style={{ bottom: 80, height: 1, background: "rgba(255,255,255,0.55)" }} />
      {/* reflektion på vattnet */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: 4,
          width: 90,
          height: 70,
          background: "radial-gradient(ellipse at top, rgba(254,215,170,0.55) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
        animate={{ opacity: 0.3 + p * 0.5 }}
      />
      {/* stjärnor i mörkare lägen */}
      {p > 0.55 && (
        <div className="pointer-events-none absolute inset-0">
          {[15, 55, 105, 175, 235, 280, 35, 200].map((x, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: x, top: 18 + ((i * 23) % 60) }}
              animate={{ opacity: [(p - 0.55) * 2, (p - 0.55) * 1.2, (p - 0.55) * 2] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// 19. OPENING-HAND — knytnäve öppnas finger för finger per steg
// ─────────────────────────────────────────────────────────────
export function OpeningHand({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  // Diskret: vid steg i är fingrar 0..i-1 helt öppna; finger i öppnar nu;
  // resten stängda. Vi mappar safeCount steg över 5 fingrar.
  const fingers = [0, 1, 2, 3, 4].map((i) => {
    const fingerStartStep = (i / 5) * safeCount;
    const fingerEndStep = ((i + 1) / 5) * safeCount;
    const now = stepIndex + clamp01(stepProgress);
    if (now >= fingerEndStep) return 1;
    if (now <= fingerStartStep) return 0;
    return clamp01((now - fingerStartStep) / (fingerEndStep - fingerStartStep));
  });
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 300 }}>
      <svg viewBox="0 0 200 240" className="h-72 w-64">
        {/* handflata */}
        <ellipse cx="100" cy="170" rx="58" ry="48" fill="white" opacity="0.95" />
        {/* tumme */}
        <motion.ellipse
          cx="38"
          cy="150"
          rx="15"
          ry="30"
          fill="white"
          opacity="0.95"
          animate={{
            rotate: -40 + fingers[0] * 45,
            cy: 150 - fingers[0] * 12,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ transformOrigin: "38px 175px" }}
        />
        {/* 4 fingrar */}
        {[
          { x: 75, baseY: 130, maxLen: 78 },
          { x: 100, baseY: 118, maxLen: 90 },
          { x: 125, baseY: 122, maxLen: 84 },
          { x: 150, baseY: 138, maxLen: 70 },
        ].map((f, i) => {
          const open = fingers[i + 1];
          const length = 28 + open * (f.maxLen - 28);
          const y = f.baseY + (1 - open) * 25;
          return (
            <motion.rect
              key={i}
              x={f.x - 11}
              width={22}
              rx={11}
              fill="white"
              opacity={0.95}
              animate={{ y: y - length, height: length }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 20. WARM-HAND — hand på bröstet, ett hjärtslag per steg
// ─────────────────────────────────────────────────────────────
export function WarmHand({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const t = clamp01(stepProgress);
  // hjärtslag: två snabba pulser inom varje steg
  const beat = Math.max(
    Math.sin(t * Math.PI * 2) * 0.5 + 0.5,
    Math.sin((t - 0.15) * Math.PI * 2) * 0.5 + 0.5,
  );
  const scale = 1 + beat * 0.07;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 320 }}>
      {/* värmestrålning som andas */}
      <motion.div
        className="absolute h-52 w-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(254,215,170,0.7) 0%, rgba(254,202,202,0.3) 50%, transparent 80%)",
          filter: "blur(10px)",
        }}
        animate={{ scale: 1 + beat * 0.12, opacity: 0.45 + beat * 0.35 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
      {/* bröstkorg-siluett */}
      <svg viewBox="0 0 200 240" className="absolute h-72 w-60">
        <ellipse cx="100" cy="110" rx="60" ry="70" fill="rgba(255,255,255,0.2)" />
      </svg>
      {/* hand */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute h-36 w-36"
        animate={{ scale }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <ellipse cx="50" cy="62" rx="32" ry="28" fill="white" opacity="0.97" />
        {[30, 42, 54, 66].map((x, i) => (
          <rect
            key={i}
            x={x - 5}
            y={20 + (i === 1 || i === 2 ? -2 : 2)}
            width={10}
            height={36}
            rx={5}
            fill="white"
            opacity="0.97"
          />
        ))}
        <ellipse cx="22" cy="58" rx="9" ry="16" fill="white" opacity="0.97" transform="rotate(-25 22 58)" />
      </motion.svg>
      {/* hjärtslags-räknare (en per steg) */}
      <div className="absolute bottom-3 flex gap-1.5">
        {Array.from({ length: safeCount }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              background: i < stepIndex
                ? "white"
                : i === stepIndex
                  ? `rgba(255,255,255,${0.4 + beat * 0.6})`
                  : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 21. SLEEP-WAVES — långsam vågrörelse som sjunker mot natten
// ─────────────────────────────────────────────────────────────
export function SleepWaves({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const sink = clamp01((stepIndex + stepProgress) / safeCount);
  const baseY = 70 + sink * 70;
  const amp = 16 - sink * 11;
  const phase = stepProgress * Math.PI * 2;
  return (
    <div className="relative grid place-items-center overflow-hidden rounded-3xl" style={{ width: 280, height: 220 }}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(30,27,75,${0.25 + sink * 0.5}) 0%, rgba(15,23,42,${0.15 + sink * 0.6}) 100%)`,
        }}
      />
      {[0, 1, 2].map((layer) => {
        const layerAmp = amp * (1 - layer * 0.3);
        const layerY = baseY + layer * 24;
        const speed = 1 + layer * 0.6;
        let d = `M0,${layerY}`;
        for (let x = 0; x <= 280; x += 14) {
          const y = layerY + Math.sin((x / 280) * Math.PI * 2 + phase / speed) * layerAmp;
          d += ` L${x},${y}`;
        }
        d += ` L280,220 L0,220 Z`;
        return (
          <svg key={layer} viewBox="0 0 280 220" className="absolute inset-0 h-full w-full">
            <path d={d} fill={`rgba(255,255,255,${0.18 - layer * 0.04})`} />
          </svg>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 22. DRIFTING-LEAVES — ett löv per steg driver förbi
// ─────────────────────────────────────────────────────────────
export function DriftingLeaves({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const colors = ["#fed7aa", "#fbbf24", "#fca5a5", "#d9f99d", "#fde68a", "#fdba74"];
  return (
    <div className="relative grid place-items-center overflow-hidden rounded-3xl" style={{ width: 280, height: 220 }}>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15" />
      {Array.from({ length: safeCount }).map((_, i) => {
        const isPast = i < stepIndex;
        const isCurrent = i === stepIndex;
        const isFuture = i > stepIndex;
        const x = isPast ? 320 : isFuture ? -40 : -40 + stepProgress * 360;
        const yJitter = Math.sin(stepProgress * Math.PI * 2 + i) * 12;
        const rot = isCurrent ? stepProgress * 280 : 0;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: x,
              top: 90 + ((i * 17) % 40) + yJitter,
              transform: `rotate(${rot}deg)`,
              opacity: isFuture ? 0 : 1,
              transition: "left 0.15s linear",
            }}
          >
            <svg viewBox="0 0 30 20" width="28" height="20">
              <path d="M2,10 Q15,-2 28,10 Q15,22 2,10 Z" fill={colors[i % colors.length]} opacity="0.85" />
              <line x1="2" y1="10" x2="28" y2="10" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 23. CLOSING-TABS — en webbläsarflik stängs per steg
// ─────────────────────────────────────────────────────────────
export function ClosingTabs({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 220 }}>
      <div className="flex flex-col gap-2">
        {Array.from({ length: safeCount }).map((_, i) => {
          const closed = i < stepIndex;
          const closing = i === stepIndex;
          const t = closing ? stepProgress : 0;
          const opacity = closed ? 0.15 : 1 - t * 0.85;
          const xShift = closed ? -40 : -t * 40;
          const scaleY = closed ? 0.4 : 1 - t * 0.6;
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                width: 200,
                background: "rgba(255,255,255,0.16)",
                opacity,
                transform: `translateX(${xShift}px) scaleY(${scaleY})`,
                transformOrigin: "center",
                transition: "all 0.25s ease",
              }}
            >
              <div className="h-2 w-2 rounded-full bg-white/60" />
              <div className="h-1.5 flex-1 rounded-full bg-white/30" />
              <div className="grid h-4 w-4 place-items-center rounded-full text-[10px] text-white/70">
                {closed ? "" : "×"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 24. WARM-BEAM — varm stråle vandrar nedåt över kroppen
// ─────────────────────────────────────────────────────────────
export function WarmBeam({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const y = ((stepIndex + stepProgress) / safeCount) * 200 + 20;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 260 }}>
      <svg viewBox="0 0 120 240" className="absolute h-60 w-32">
        <ellipse cx="60" cy="30" rx="20" ry="22" fill="rgba(255,255,255,0.22)" />
        <path d="M40,55 Q60,50 80,55 L88,160 Q60,170 32,160 Z" fill="rgba(255,255,255,0.22)" />
        <rect x="46" y="160" width="12" height="70" rx="6" fill="rgba(255,255,255,0.22)" />
        <rect x="62" y="160" width="12" height="70" rx="6" fill="rgba(255,255,255,0.22)" />
      </svg>
      <motion.div
        className="absolute left-1/2 h-20 w-40 -translate-x-1/2 rounded-full"
        style={{
          top: y - 40,
          background:
            "radial-gradient(ellipse, rgba(254,215,170,0.85) 0%, rgba(252,165,165,0.4) 40%, transparent 75%)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute left-1/2 w-24 -translate-x-1/2 rounded-full"
        style={{
          top: 20,
          height: Math.max(0, y - 20),
          background: "linear-gradient(180deg, rgba(254,215,170,0.0), rgba(254,215,170,0.35))",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 25. LIFTING-STONE — en sten lyfts av bröstet, steg för steg
// ─────────────────────────────────────────────────────────────
export function LiftingStone({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const lift = clamp01((stepIndex + stepProgress) / safeCount);
  const y = 120 - lift * 100;
  const x = lift * 80;
  const rot = lift * 25;
  const stoneOpacity = 1 - Math.max(0, lift - 0.85) * 5;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 200 200" className="absolute h-56 w-56">
        <ellipse cx="100" cy="120" rx="70" ry="55" fill="rgba(255,255,255,0.18)" />
      </svg>
      <div
        className="absolute h-20 w-32 rounded-full"
        style={{
          top: 120,
          background: "radial-gradient(ellipse, rgba(254,215,170,0.7), transparent 70%)",
          filter: "blur(10px)",
          opacity: lift * 0.9,
        }}
      />
      <svg
        viewBox="0 0 60 50"
        className="absolute h-14 w-16"
        style={{ top: y, left: 140 + x, opacity: stoneOpacity, transform: `rotate(${rot}deg)`, transition: "all 0.25s ease" }}
      >
        <ellipse cx="30" cy="28" rx="26" ry="18" fill="#475569" />
        <ellipse cx="22" cy="22" rx="8" ry="4" fill="#64748b" />
        <ellipse cx="38" cy="32" rx="6" ry="3" fill="#334155" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 26. CONSTELLATION — en stjärna tänds per steg, linjer ritas
// ─────────────────────────────────────────────────────────────
export function Constellation({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const stars = Array.from({ length: Math.max(safeCount, 7) }, (_, i) => {
    const a = (i * 137.5) % 360;
    const r = 60 + ((i * 53) % 50);
    return {
      x: 140 + Math.cos((a * Math.PI) / 180) * r,
      y: 110 + Math.sin((a * Math.PI) / 180) * r * 0.7,
    };
  });
  return (
    <div
      className="relative grid place-items-center overflow-hidden rounded-3xl"
      style={{ width: 280, height: 220, background: "linear-gradient(180deg, rgba(30,27,75,0.4), rgba(15,23,42,0.5))" }}
    >
      <svg viewBox="0 0 280 220" className="absolute inset-0 h-full w-full">
        {stars.slice(0, stepIndex).map((s, i) => {
          if (i === 0) return null;
          const prev = stars[i - 1];
          return <line key={`l${i}`} x1={prev.x} y1={prev.y} x2={s.x} y2={s.y} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />;
        })}
        {stepIndex > 0 && stepIndex < stars.length && (
          <line
            x1={stars[stepIndex - 1].x}
            y1={stars[stepIndex - 1].y}
            x2={stars[stepIndex - 1].x + (stars[stepIndex].x - stars[stepIndex - 1].x) * stepProgress}
            y2={stars[stepIndex - 1].y + (stars[stepIndex].y - stars[stepIndex - 1].y) * stepProgress}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
        )}
        {stars.map((s, i) => {
          const lit = i < stepIndex;
          const lighting = i === stepIndex;
          const opacity = lit ? 1 : lighting ? 0.3 + stepProgress * 0.7 : 0.15;
          const r = lit ? 2.6 : lighting ? 2 + stepProgress * 0.6 : 1.4;
          return (
            <g key={i}>
              {(lit || lighting) && <circle cx={s.x} cy={s.y} r={r * 2.8} fill="white" opacity={opacity * 0.25} />}
              <circle cx={s.x} cy={s.y} r={r} fill="white" opacity={opacity} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 27. SPIRAL — spiral som öppnas/lossnar steg för steg
// ─────────────────────────────────────────────────────────────
export function Spiral({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const unwind = clamp01((stepIndex + stepProgress) / safeCount);
  const points: string[] = [];
  const turns = 4 - unwind * 2.8;
  const maxR = 70 + unwind * 20;
  const total = 200;
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const angle = t * turns * Math.PI * 2;
    const r = t * maxR;
    points.push(`${140 + Math.cos(angle) * r},${110 + Math.sin(angle) * r}`);
  }
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 220 }}>
      <svg viewBox="0 0 280 220" className="h-full w-full">
        <motion.polyline
          points={points.join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ rotate: unwind * -90 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "140px 110px" }}
        />
        <circle cx="140" cy="110" r="5" fill="white" opacity={0.6 + unwind * 0.4} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 28. ORBIT — distraktioner dras in i mitten, en per steg
// ─────────────────────────────────────────────────────────────
export function Orbit({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const center = { x: 140, y: 110 };
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 220 }}>
      <svg viewBox="0 0 280 220" className="h-full w-full">
        <circle cx={center.x} cy={center.y} r="78" fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 5" />
        <circle cx={center.x} cy={center.y} r="10" fill="white" opacity="0.9" />
        <circle cx={center.x} cy={center.y} r={14 + stepIndex * 1.2} fill="none" stroke="white" strokeWidth="0.6" opacity="0.35" />
        {Array.from({ length: safeCount }).map((_, i) => {
          const angle = (i / safeCount) * Math.PI * 2 - Math.PI / 2;
          const orbitX = center.x + Math.cos(angle) * 78;
          const orbitY = center.y + Math.sin(angle) * 78;
          const absorbed = i < stepIndex;
          const absorbing = i === stepIndex;
          const t = absorbing ? stepProgress : 0;
          const x = absorbed ? center.x : orbitX + (center.x - orbitX) * t;
          const y = absorbed ? center.y : orbitY + (center.y - orbitY) * t;
          const opacity = absorbed ? 0 : 1 - t * 0.4;
          return <circle key={i} cx={x} cy={y} r={5} fill="rgba(254,215,170,0.9)" opacity={opacity} />;
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 29. PENDULUM — pendelns utslag minskar per steg
// ─────────────────────────────────────────────────────────────
export function Pendulum({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const decay = 1 - (stepIndex + stepProgress) / safeCount;
  const maxSwing = 45 * Math.max(decay, 0.08);
  const angle = Math.cos(stepProgress * Math.PI * 2 - stepIndex * Math.PI) * maxSwing;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 200 240" className="h-full w-full">
        <rect x="90" y="20" width="20" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
        <g style={{ transformOrigin: "100px 26px", transform: `rotate(${angle}deg)` }}>
          <line x1="100" y1="26" x2="100" y2="170" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <circle cx="100" cy="180" r="14" fill="white" opacity="0.92" />
          <circle cx="100" cy="180" r="20" fill="none" stroke="white" strokeWidth="0.6" opacity={0.3 * decay} />
        </g>
        <line x1="100" y1="200" x2="100" y2="220" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 30. COMPASSION-HEART — mjuk hjärtform som värms upp per steg
// ─────────────────────────────────────────────────────────────
export function CompassionHeart({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const warmth = clamp01((stepIndex + stepProgress) / safeCount);
  const beat = Math.sin(stepProgress * Math.PI * 2) * 0.5 + 0.5;
  const scale = 1 + beat * 0.08 + warmth * 0.05;
  const heartPath = "M50,82 C20,60 8,38 26,22 C38,12 50,22 50,32 C50,22 62,12 74,22 C92,38 80,60 50,82 Z";
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <motion.div
        className="absolute h-48 w-48 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(254,202,202,${0.25 + warmth * 0.55}) 0%, rgba(254,215,170,${0.15 + warmth * 0.3}) 50%, transparent 80%)`,
          filter: "blur(12px)",
        }}
        animate={{ scale: 1 + beat * 0.14, opacity: 0.5 + beat * 0.4 }}
        transition={{ duration: 0.4 }}
      />
      <motion.svg viewBox="0 0 100 100" className="absolute h-40 w-40" animate={{ scale }} transition={{ duration: 0.4 }}>
        <defs>
          <linearGradient id="heart-warm" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fecaca" stopOpacity="0.95" />
            <stop offset="100%" stopColor={`rgba(254,${165 - warmth * 20},${165 - warmth * 40},0.95)`} />
          </linearGradient>
        </defs>
        <path d={heartPath} fill="url(#heart-warm)" />
        <path d={heartPath} fill="white" opacity={warmth * 0.18} transform="scale(0.7) translate(21 18)" />
      </motion.svg>
      <div className="absolute bottom-3 flex gap-1.5">
        {Array.from({ length: safeCount }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-6 rounded-full"
            style={{ background: i < stepIndex ? "white" : i === stepIndex ? `rgba(255,255,255,${0.4 + beat * 0.5})` : "rgba(255,255,255,0.2)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 31. BELLY-HAND — handen på magen lyfts/sänks med andetaget
// ─────────────────────────────────────────────────────────────
export function BellyHand({ stepIndex = 0, stepProgress = 0, phase = "" }: Props) {
  const breath = detectBreath(phase);
  // tolkning: "in" → handen åker upp; "ut" → handen åker ner
  const t = clamp01(stepProgress);
  const rise = breath === "in" ? t : breath === "out" ? 1 - t : 0.4;
  const handY = 120 - rise * 22;
  const bellyScale = 1 + rise * 0.12;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      {/* siluett — bröstet ovanför, magen nedanför */}
      <svg viewBox="0 0 200 220" className="absolute h-56 w-56">
        <path d="M50,30 Q100,20 150,30 L155,90 Q100,100 45,90 Z" fill="rgba(255,255,255,0.18)" />
        <ellipse cx="100" cy="135" rx="55" ry={36 * bellyScale} fill="rgba(255,255,255,0.28)" style={{ transition: "all 0.25s ease" }} />
      </svg>
      {/* hand */}
      <svg viewBox="0 0 80 80" className="absolute h-20 w-20" style={{ top: handY + 30, transition: "top 0.25s ease" }}>
        <ellipse cx="40" cy="50" rx="26" ry="22" fill="white" opacity="0.95" />
        {[24, 34, 44, 54].map((x, i) => (
          <rect key={i} x={x - 4} y={18 + (i === 1 || i === 2 ? -2 : 2)} width={8} height={28} rx={4} fill="white" opacity="0.95" />
        ))}
        <ellipse cx="16" cy="46" rx="7" ry="12" fill="white" opacity="0.95" transform="rotate(-25 16 46)" />
      </svg>
      {/* riktningsmarkör */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-white/60">
        {breath === "in" ? "↑" : breath === "out" ? "↓" : "·"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 32. SHOULDER-DROP — axlarna åker upp och sedan tydligt ner per steg
// ─────────────────────────────────────────────────────────────
export function ShoulderDrop({ stepIndex = 0, stepProgress = 0 }: Props) {
  // 0:upp 1:ner 2:märk 3:upp 4:ner 5:hänger — generisk: jämna=upp, udda=ner, sista=hänger lågt
  const t = clamp01(stepProgress);
  const isUp = stepIndex % 2 === 0;
  // shoulderY: 60 = normal, 40 = upp, 78 = ner
  const targetY = isUp ? 40 + (1 - t) * 20 : 78 - (1 - t) * 18;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 200 220" className="h-56 w-56">
        {/* huvud */}
        <ellipse cx="100" cy="40" rx="22" ry="24" fill="rgba(255,255,255,0.22)" />
        {/* nacke */}
        <rect x="92" y="58" width="16" height="14" fill="rgba(255,255,255,0.2)" />
        {/* axlar — rör sig vertikalt */}
        <path
          d={`M40,${targetY + 20} Q100,${targetY} 160,${targetY + 20} L160,${targetY + 40} Q100,${targetY + 28} 40,${targetY + 40} Z`}
          fill="rgba(255,255,255,0.28)"
          style={{ transition: "d 0.3s ease" }}
        />
        {/* torso */}
        <path d={`M55,${targetY + 38} Q100,${targetY + 50} 145,${targetY + 38} L145,180 Q100,190 55,180 Z`} fill="rgba(255,255,255,0.18)" style={{ transition: "d 0.3s ease" }} />
        {/* riktningspilar */}
        <text x="170" y={targetY + 30} fill="rgba(255,255,255,0.55)" fontSize="18" fontWeight="300">
          {isUp ? "↑" : "↓"}
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 33. JAW-RELEASE — munnen öppnas, tungan släpper, utandning
// ─────────────────────────────────────────────────────────────
export function JawRelease({ stepIndex = 0, stepProgress = 0 }: Props) {
  // steg-tolkning: 0 märk käken, 1 öppna munnen, 2 tunga ner, 3 andas ut
  const t = clamp01(stepProgress);
  const mouthOpen = stepIndex >= 1 ? Math.min(1, 0.3 + (stepIndex - 1) * 0.4 + t * 0.3) : 0.05;
  const tongueDown = stepIndex >= 2 ? Math.min(1, (stepIndex - 2) * 0.6 + t * 0.4) : 0;
  const exhaling = stepIndex >= 3;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 200 200" className="h-56 w-56">
        {/* ansikte */}
        <ellipse cx="100" cy="100" rx="68" ry="78" fill="rgba(255,255,255,0.18)" />
        {/* näsa-antydan */}
        <ellipse cx="100" cy="95" rx="6" ry="10" fill="rgba(255,255,255,0.12)" />
        {/* mun — ellips som höjs när den öppnas */}
        <ellipse
          cx="100"
          cy="135"
          rx={24}
          ry={4 + mouthOpen * 16}
          fill="rgba(15,23,42,0.55)"
          style={{ transition: "ry 0.4s ease" }}
        />
        {/* tunga */}
        <ellipse
          cx="100"
          cy={135 + tongueDown * 8}
          rx={16}
          ry={3 + tongueDown * 3}
          fill="rgba(252,165,165,0.85)"
          opacity={mouthOpen * 0.9}
          style={{ transition: "all 0.4s ease" }}
        />
        {/* utandning som dimma */}
        {exhaling && (
          <motion.ellipse
            cx="100"
            cy={180}
            rx="40"
            ry="14"
            fill="rgba(255,255,255,0.35)"
            animate={{ cy: [165, 200], opacity: [0.6, 0], rx: [30, 55] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 34. FOOTPRINTS — fötter mot golvet, vikten hittar hälen
// ─────────────────────────────────────────────────────────────
export function Footprints({ stepIndex = 0, stepProgress = 0 }: Props) {
  // 0: hela foten 1: vikt i hälarna 2: tårna mjuka 3: andas ut nedåt
  const t = clamp01(stepProgress);
  const heelWeight = stepIndex >= 1 ? Math.min(1, (stepIndex - 1) * 0.5 + t * 0.5) : 0.2;
  const toesRelaxed = stepIndex >= 2 ? Math.min(1, (stepIndex - 2) * 0.5 + t * 0.5) : 0;
  const exhale = stepIndex >= 3;
  const heelOpacity = 0.25 + heelWeight * 0.7;
  const toeOpacity = 0.25 + (1 - toesRelaxed) * 0.5;
  const groundPulse = 1 + heelWeight * 0.08;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      {/* golvring */}
      <div
        className="absolute h-44 w-56 rounded-full"
        style={{
          top: 80,
          background: "radial-gradient(ellipse, rgba(254,215,170,0.35), transparent 70%)",
          transform: `scale(${groundPulse})`,
          transition: "transform 0.4s ease",
        }}
      />
      <svg viewBox="0 0 200 180" className="absolute h-44 w-56" style={{ top: 60 }}>
        {[60, 140].map((cx, i) => (
          <g key={i}>
            {/* hälen */}
            <ellipse cx={cx} cy={120} rx={24} ry={18} fill={`rgba(255,255,255,${heelOpacity})`} style={{ transition: "fill 0.3s" }} />
            {/* fotvalv */}
            <ellipse cx={cx} cy={88} rx={20} ry={26} fill="rgba(255,255,255,0.45)" />
            {/* tårna */}
            <g opacity={toeOpacity} style={{ transition: "opacity 0.3s" }}>
              {[-12, -4, 4, 12].map((dx, j) => (
                <circle key={j} cx={cx + dx} cy={62} r={4} fill="white" />
              ))}
            </g>
          </g>
        ))}
        {/* nedåt-pilar vid utandning */}
        {exhale && (
          <motion.g animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <path d="M60,150 L60,166 M55,160 L60,168 L65,160" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M140,150 L140,166 M135,160 L140,168 L145,160" stroke="white" strokeWidth="1.5" fill="none" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 35. DOORWAY — figur stannar utanför en dörr, går in på sista steget
// ─────────────────────────────────────────────────────────────
export function Doorway({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const isLast = stepIndex === safeCount - 1;
  const doorOpen = isLast ? stepProgress : 0;
  const figureX = isLast ? stepProgress * 30 : 0;
  const figureOpacity = isLast ? 1 - stepProgress * 0.7 : 1;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 240 200" className="h-56 w-72">
        {/* dörrkarm */}
        <rect x="130" y="30" width="80" height="160" rx="2" fill="rgba(255,255,255,0.18)" />
        <rect x="138" y="38" width="64" height="148" rx="1" fill="rgba(15,23,42,0.35)" />
        {/* dörr — svänger upp */}
        <g style={{ transformOrigin: "138px 112px", transform: `rotateY(${doorOpen * 75}deg)`, transition: "transform 0.4s ease" }}>
          <rect x="138" y="38" width="64" height="148" rx="1" fill="rgba(254,215,170,0.55)" />
          <circle cx="194" cy="112" r="2" fill="rgba(15,23,42,0.5)" />
        </g>
        {/* ljus från dörröppning när öppen */}
        {doorOpen > 0.05 && (
          <ellipse cx="170" cy="112" rx={40 * doorOpen} ry={70 * doorOpen} fill="rgba(254,215,170,0.4)" />
        )}
        {/* figur utanför */}
        <g transform={`translate(${70 + figureX}, 80)`} opacity={figureOpacity} style={{ transition: "all 0.4s ease" }}>
          <circle cx="0" cy="0" r="12" fill="rgba(255,255,255,0.85)" />
          <path d="M-14,16 Q0,12 14,16 L14,60 Q0,68 -14,60 Z" fill="rgba(255,255,255,0.85)" />
          <rect x="-10" y="60" width="8" height="40" rx="3" fill="rgba(255,255,255,0.85)" />
          <rect x="2" y="60" width="8" height="40" rx="3" fill="rgba(255,255,255,0.85)" />
        </g>
        {/* andnings-glöd kring figuren */}
        <motion.circle
          cx={70 + figureX}
          cy="100"
          r="40"
          fill="none"
          stroke="rgba(254,215,170,0.4)"
          strokeWidth="1"
          animate={{ r: [38, 50, 38], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 36. FIRST-STEP — en trappa, första trappsteget lyser starkast
// ─────────────────────────────────────────────────────────────
export function FirstStep({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <svg viewBox="0 0 280 220" className="h-full w-full">
        {/* hela trappan i bakgrunden — ljusare för aktuellt steg */}
        {Array.from({ length: safeCount }).map((_, i) => {
          const reached = i < stepIndex;
          const current = i === stepIndex;
          const baseY = 200 - i * 22;
          const w = 200 - i * 18;
          const x = (280 - w) / 2;
          const opacity = current ? 0.35 + stepProgress * 0.55 : reached ? 0.65 : 0.18;
          return (
            <g key={i}>
              <rect x={x} y={baseY - 16} width={w} height={16} rx={2} fill={`rgba(255,255,255,${opacity})`} style={{ transition: "fill 0.3s" }} />
              {/* skugga under steget */}
              <rect x={x} y={baseY} width={w} height={3} fill="rgba(0,0,0,0.15)" />
            </g>
          );
        })}
        {/* glödande prick som markerar "här är du nu" */}
        {(() => {
          const baseY = 200 - stepIndex * 22 - 8;
          const w = 200 - stepIndex * 18;
          const x = 140;
          return (
            <g>
              <circle cx={x} cy={baseY - 14} r={14} fill="rgba(254,215,170,0.2)" />
              <circle cx={x} cy={baseY - 14} r={7} fill="white" />
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 37. TYPING-CURSOR — blinkande markör; första ordet ramas in per steg
// ─────────────────────────────────────────────────────────────
export function TypingCursor({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  // skapar en abstrakt "rad text" där en grå platta byts mot en ljus per steg
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <div className="flex flex-col gap-2 rounded-2xl bg-white/10 p-5" style={{ width: 230 }}>
        {/* dokument-header */}
        <div className="mb-2 flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
        </div>
        {Array.from({ length: safeCount }).map((_, i) => {
          const typed = i < stepIndex;
          const typing = i === stepIndex;
          const t = typing ? stepProgress : 0;
          const widthPct = typed ? 100 : typing ? 8 + t * 84 : 0;
          return (
            <div key={i} className="flex h-3 items-center gap-1">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${widthPct}%`,
                  background: typed ? "rgba(255,255,255,0.85)" : "rgba(254,215,170,0.85)",
                  transition: "width 0.25s linear, background 0.3s",
                  maxWidth: `${80 + ((i * 17) % 40)}%`,
                }}
              />
              {typing && (
                <motion.div
                  className="h-3 w-[2px] bg-white"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 38. MORNING-SUN — solen går upp, en stråle tänds per steg
// ─────────────────────────────────────────────────────────────
export function MorningSun({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const rise = clamp01((stepIndex + stepProgress) / safeCount);
  const sunY = 170 - rise * 60;
  return (
    <div className="relative grid place-items-center overflow-hidden rounded-3xl" style={{ width: 280, height: 220 }}>
      {/* himmel som ljusnar */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(254,215,170,${0.15 + rise * 0.4}) 0%, rgba(252,165,165,${0.1 + rise * 0.25}) 60%, rgba(30,27,75,${0.3 - rise * 0.2}) 100%)`,
          transition: "background 0.4s",
        }}
      />
      {/* horisontlinje */}
      <div className="absolute left-0 right-0 top-[170px] h-px bg-white/30" />
      <svg viewBox="0 0 280 220" className="absolute inset-0 h-full w-full">
        {/* strålar — en per "lit" steg */}
        {Array.from({ length: safeCount }).map((_, i) => {
          const lit = i <= stepIndex;
          if (!lit) return null;
          const litProgress = i === stepIndex ? stepProgress : 1;
          const angle = -85 + (i / Math.max(safeCount - 1, 1)) * 170;
          const rad = (angle * Math.PI) / 180;
          const len = 50 + litProgress * 30;
          return (
            <line
              key={i}
              x1="140"
              y1={sunY}
              x2={140 + Math.cos(rad) * len}
              y2={sunY + Math.sin(rad) * len}
              stroke="rgba(254,215,170,0.7)"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity={i === stepIndex ? 0.4 + litProgress * 0.6 : 0.9}
            />
          );
        })}
        {/* glöd kring solen */}
        <circle cx="140" cy={sunY} r={32 + rise * 8} fill="rgba(254,215,170,0.25)" />
        {/* solen själv */}
        <circle cx="140" cy={sunY} r="18" fill="white" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 39. STRETCH-UP — figur reser sig, sträcker, andas ut
// ─────────────────────────────────────────────────────────────
export function StretchUp({ stepIndex = 0, stepProgress = 0 }: Props) {
  // 0: stå upp 1: släpp axlarna 2: tre långa utandningar 3: vad behöver nästa möte
  const t = clamp01(stepProgress);
  const standing = stepIndex >= 0 ? Math.min(1, 0.4 + (stepIndex === 0 ? t * 0.6 : 0.6)) : 0;
  const armsUp = stepIndex >= 1 ? (stepIndex === 1 ? t : 1) : 0;
  // armarna: tillbaka ner när axlarna släpper (steg 1) — men för enkelhet sträcker uppåt
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 260 }}>
      <svg viewBox="0 0 200 240" className="h-64 w-56">
        {/* huvud */}
        <circle cx="100" cy={50 - standing * 8} r="14" fill="rgba(255,255,255,0.9)" style={{ transition: "cy 0.4s ease" }} />
        {/* torso */}
        <path
          d={`M82,${68 - standing * 6} Q100,${64 - standing * 6} 118,${68 - standing * 6} L118,${150 - standing * 6} Q100,${158 - standing * 6} 82,${150 - standing * 6} Z`}
          fill="rgba(255,255,255,0.8)"
          style={{ transition: "d 0.4s ease" }}
        />
        {/* armar — sträcker uppåt */}
        <g style={{ transition: "all 0.4s ease" }}>
          <line
            x1="82"
            y1={72 - standing * 6}
            x2={82 - armsUp * 12}
            y2={72 - standing * 6 - armsUp * 50}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="118"
            y1={72 - standing * 6}
            x2={118 + armsUp * 12}
            y2={72 - standing * 6 - armsUp * 50}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
        {/* ben */}
        <rect x="88" y={150 - standing * 6} width="8" height={70 + standing * 10} rx={3} fill="rgba(255,255,255,0.75)" style={{ transition: "all 0.4s ease" }} />
        <rect x="104" y={150 - standing * 6} width="8" height={70 + standing * 10} rx={3} fill="rgba(255,255,255,0.75)" style={{ transition: "all 0.4s ease" }} />
        {/* utandningar — tre puffar för steg 2 */}
        {stepIndex === 2 && (
          <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ellipse cx="140" cy="60" rx="8" ry="5" fill="rgba(255,255,255,0.4)" />
            <ellipse cx="155" cy="50" rx="10" ry="6" fill="rgba(255,255,255,0.3)" />
            <ellipse cx="172" cy="42" rx="12" ry="7" fill="rgba(255,255,255,0.22)" />
          </motion.g>
        )}
        {/* riktningspil vid steg 3 */}
        {stepIndex === 3 && (
          <motion.path
            d="M150,120 L180,120 M172,112 L180,120 L172,128"
            stroke="rgba(254,215,170,0.9)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 40. INBOX-PRIORITY — mejl sorteras: akut / vänta / imorgon
// ─────────────────────────────────────────────────────────────
export function InboxPriority({ stepIndex = 0, stepProgress = 0 }: Props) {
  // 0 stäng inkorgen, 1 akut idag, 2 akut för annan, 3 kan vänta, 4 öppna - gör en sak
  const buckets = [
    { label: "NU", color: "rgba(252,165,165,0.85)" },
    { label: "ANDRAS", color: "rgba(254,215,170,0.85)" },
    { label: "IMORGON", color: "rgba(196,181,253,0.75)" },
  ];
  // Vilken bucket är aktiv per steg
  const activeBucket = stepIndex === 1 ? 0 : stepIndex === 2 ? 1 : stepIndex === 3 ? 2 : -1;
  const inboxClosed = stepIndex === 0;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 240 }}>
      <div className="flex flex-col items-center gap-3">
        {/* inkorg */}
        <div
          className="relative rounded-xl border border-white/30 px-4 py-2"
          style={{
            width: 180,
            background: inboxClosed ? "rgba(15,23,42,0.4)" : "rgba(255,255,255,0.16)",
            transition: "all 0.4s ease",
          }}
        >
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/70">
            <span>Inkorg</span>
            <span>{inboxClosed ? "✕" : "•"}</span>
          </div>
          {/* ett mejl som flyger ut till aktiv bucket */}
          {!inboxClosed &&
            Array.from({ length: 3 }).map((_, i) => {
              const sent = i < activeBucket;
              const sending = i === activeBucket;
              const t = sending ? stepProgress : 0;
              const opacity = sent ? 0 : 1 - t * 0.8;
              const x = sending ? -40 + t * 80 : 0;
              const y = sending ? t * 40 : 0;
              return (
                <div
                  key={i}
                  className="my-1 h-2 rounded-full bg-white/60"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    opacity,
                    transition: "all 0.3s linear",
                  }}
                />
              );
            })}
          {stepIndex === 4 && (
            <motion.div
              className="absolute -right-2 -top-2 h-3 w-3 rounded-full"
              style={{ background: "rgba(254,215,170,1)" }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
        {/* tre buckets */}
        <div className="flex gap-3">
          {buckets.map((b, i) => {
            const active = i === activeBucket;
            const filled = i < activeBucket || (i === activeBucket && stepProgress > 0.5);
            return (
              <div
                key={i}
                className="rounded-lg px-3 py-2 text-center"
                style={{
                  background: active ? b.color : `${b.color.replace(/[\d.]+\)/, "0.25)")}`,
                  transform: active ? "scale(1.08)" : "scale(1)",
                  transition: "all 0.3s ease",
                  minWidth: 56,
                }}
              >
                <div className="text-[9px] font-semibold tracking-wider text-white/90">{b.label}</div>
                <div className="mt-1 h-1.5 w-full rounded-full" style={{ background: filled ? "white" : "rgba(255,255,255,0.3)" }} />
              </div>
            );
          })}
        </div>
      </div>
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
      return <Unknotting {...p} />;
    case "walking-path":
      return <WalkingPath {...p} />;
    case "battery-fill":
      return <BatteryFill {...p} />;
    case "volume-slider":
      return <VolumeSlider {...p} />;
    case "ember":
      return <Ember {...p} />;
    case "candle":
      return <Candle {...p} />;
    case "pebbles":
      return <Pebbles {...p} />;
    case "horizon":
      return <Horizon {...p} />;
    case "opening-hand":
      return <OpeningHand {...p} />;
    case "warm-hand":
      return <WarmHand {...p} />;

    // promoverade: egna dedikerade animationer
    case "sleep-waves":
      return <SleepWaves {...p} />;
    case "drifting-leaves":
      return <DriftingLeaves {...p} />;
    case "closing-tabs":
      return <ClosingTabs {...p} />;
    case "warm-beam":
      return <WarmBeam {...p} />;
    case "lifting-stone":
      return <LiftingStone {...p} />;
    case "constellation":
      return <Constellation {...p} />;
    case "spiral":
      return <Spiral {...p} />;
    case "orbit":
      return <Orbit {...p} />;
    case "pendulum":
      return <Pendulum {...p} />;
    case "compassion-heart":
      return <CompassionHeart {...p} />;

    // kvarvarande legacy
    case "breath-blob":
      return <BreathWave {...p} />;
    case "passing-thoughts":
      return <PassingTraffic {...p} />;
    case "reset-shapes":
      return <VolumeSlider {...p} />;
    case "pulse":
      return <AnchorDrop {...p} />;

    // tredje vågen
    case "belly-hand":
      return <BellyHand {...p} />;
    case "shoulder-drop":
      return <ShoulderDrop {...p} />;
    case "jaw-release":
      return <JawRelease {...p} />;
    case "footprints":
      return <Footprints {...p} />;
    case "doorway":
      return <Doorway {...p} />;
    case "first-step":
      return <FirstStep {...p} />;
    case "typing-cursor":
      return <TypingCursor {...p} />;
    case "morning-sun":
      return <MorningSun {...p} />;
    case "stretch-up":
      return <StretchUp {...p} />;
    case "inbox-priority":
      return <InboxPriority {...p} />;
  }
}
