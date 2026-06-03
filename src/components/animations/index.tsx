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
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 280 }}>
      <div className="relative h-64 w-32 rounded-3xl border-[6px] border-white/70 p-2">
        <div className="absolute -top-4 left-1/2 h-4 w-12 -translate-x-1/2 rounded-t-md bg-white/70" />
        <div className="flex h-full flex-col-reverse gap-1.5">
          {blocks.map((i) => {
            const isCurrent = i === stepIndex;
            const filled = i < stepIndex;
            const t = isCurrent ? clamp01(stepProgress) : filled ? 1 : 0;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-md bg-gradient-to-t from-emerald-400 to-emerald-200"
                animate={{ opacity: 0.15 + t * 0.85, scaleY: 0.3 + t * 0.7 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
              />
            );
          })}
        </div>
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
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 340 }}>
      <div className="relative h-80 w-10 rounded-full bg-white/15">
        {/* skala-markörer */}
        {Array.from({ length: safeCount + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute -right-3 h-0.5 w-3 bg-white/40"
            style={{ top: `${(i / safeCount) * 100}%` }}
          />
        ))}
        <div
          className="absolute inset-x-0 bottom-0 rounded-full bg-white/70"
          style={{ height: `${(1 - p) * 100}%` }}
        />
        <motion.div
          className="absolute left-1/2 h-12 w-20 -translate-x-1/2 rounded-2xl bg-white shadow-xl"
          animate={{ top: `calc(${p * 100}% - 24px)` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="absolute right-1/4 flex h-80 flex-col justify-between text-[10px] font-bold text-white/60">
        <span>Högt</span>
        <span>Lågt</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 15. EMBER — flamman sjunker till glöd per steg
// ─────────────────────────────────────────────────────────────
export function Ember({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const p = (stepIndex + clamp01(stepProgress)) / safeCount;
  const flameScale = 1 - p * 0.75;
  const flameOpacity = 1 - p * 0.85;
  const emberOpacity = 0.25 + p * 0.75;
  return (
    <div className="relative grid place-items-end" style={{ width: 260, height: 280 }}>
      <div
        className="absolute inset-x-0 bottom-0 h-20 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.7) 0%, rgba(251,146,60,0.3) 50%, transparent 80%)",
          opacity: emberOpacity,
          filter: "blur(3px)",
        }}
      />
      <motion.svg
        viewBox="0 0 100 120"
        className="relative h-56 w-44"
        animate={{ scaleY: flameScale, opacity: flameOpacity }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "bottom" }}
      >
        <motion.path
          fill="url(#flameG)"
          animate={{ d: [
            "M50 110 Q 18 100 18 70 Q 18 50 36 38 Q 30 58 44 60 Q 38 42 52 22 Q 56 46 66 50 Q 60 38 74 36 Q 86 56 82 80 Q 82 100 50 110 Z",
            "M50 110 Q 20 100 20 72 Q 22 52 38 42 Q 32 60 46 62 Q 40 44 52 26 Q 56 48 66 52 Q 62 40 74 38 Q 84 56 80 80 Q 80 100 50 110 Z",
          ] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
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
// 16. CANDLE — ljusets låga dämpas per steg (sömn / lugna ner)
// ─────────────────────────────────────────────────────────────
export function Candle({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  const p = (stepIndex + clamp01(stepProgress)) / safeCount;
  const flameH = 60 - p * 45;
  const glow = 0.6 - p * 0.5;
  return (
    <div className="relative grid place-items-center" style={{ width: 220, height: 320 }}>
      {/* glöd runt lågan */}
      <motion.div
        className="absolute h-40 w-40 rounded-full"
        style={{
          top: 40,
          background:
            "radial-gradient(circle, rgba(254,240,138,0.7) 0%, rgba(251,146,60,0.2) 40%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: glow, scale: 1 - p * 0.4 }}
        transition={{ duration: 0.8 }}
      />
      {/* låga */}
      <motion.div
        className="absolute"
        style={{ top: 80, left: "50%", marginLeft: -10 }}
        animate={{ height: flameH }}
        transition={{ duration: 0.6 }}
      >
        <motion.svg
          viewBox="0 0 20 60"
          style={{ width: 20, height: flameH }}
          animate={{ scaleX: [1, 0.92, 1.05, 1], scaleY: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M10 60 Q 0 50 2 32 Q 4 18 10 0 Q 16 18 18 32 Q 20 50 10 60 Z"
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
      {/* ljusstake */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-md bg-white/85"
        style={{ top: 160, width: 28, height: 120 }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/60"
        style={{ top: 278, width: 80, height: 14 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 17. PEBBLES — en sten läggs i skålen per steg (grounding / räkna)
// ─────────────────────────────────────────────────────────────
export function Pebbles({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const safeCount = Math.max(1, stepCount);
  return (
    <div className="relative" style={{ width: 320, height: 280 }}>
      {/* skål */}
      <div className="absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 overflow-hidden rounded-b-[120px] bg-white/15 border-t-2 border-white/40">
        <div className="absolute inset-x-0 top-0 h-2 bg-white/30" />
      </div>
      {/* befintliga stenar i botten */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex w-48 flex-wrap justify-center gap-1.5">
        {Array.from({ length: stepIndex }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-7 rounded-full"
            style={{
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
      {/* nuvarande sten faller */}
      {stepIndex < safeCount && (
        <motion.div
          className="absolute left-1/2 h-6 w-9 -translate-x-1/2 rounded-full bg-slate-200 shadow"
          animate={{ top: -10 + clamp01(stepProgress) * 230, opacity: clamp01(stepProgress) < 0.95 ? 1 : 0.2 }}
          transition={{ duration: 0.35, ease: "easeIn" }}
        />
      )}
      {/* steg-räknare */}
      <div className="absolute right-2 top-2 text-xs font-extrabold opacity-60">
        {Math.min(stepIndex + 1, safeCount)} / {safeCount}
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
  // himmel: dag → solnedgång → natt
  const sky =
    p < 0.5
      ? `linear-gradient(180deg, oklch(0.85 0.05 230 / 0.5), oklch(0.78 0.1 60 / 0.5))`
      : `linear-gradient(180deg, oklch(${0.55 - p * 0.3} 0.08 280 / 0.7), oklch(${0.45 - p * 0.25} 0.1 30 / 0.7))`;
  const sunY = 30 + p * 150;
  const sunOpacity = 1 - p * 0.3;
  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ width: 320, height: 240, background: sky }}
    >
      {/* sol */}
      <motion.div
        className="absolute left-1/2 h-20 w-20 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #fef08a 0%, #f97316 70%, transparent 100%)",
          filter: "blur(1px)",
        }}
        animate={{ top: sunY, opacity: sunOpacity }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* horisontlinje */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-black/30" />
      <div className="absolute inset-x-0" style={{ bottom: 80, height: 1, background: "rgba(255,255,255,0.3)" }} />
      {/* stjärnor när det blir mörkare */}
      {p > 0.6 && (
        <div className="absolute inset-0">
          {[20, 60, 110, 180, 240, 280].map((x, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: x, top: 20 + ((i * 19) % 80), opacity: (p - 0.6) * 2 }}
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
  // 5 fingrar: mappa stegen över 5 fingrar oavsett antal steg
  const fingers = [0, 1, 2, 3, 4].map((i) => {
    const fingerProgress = (stepIndex + clamp01(stepProgress)) / safeCount;
    // varje finger "öppnas" sekventiellt över hela animationen
    const start = i / 5;
    const end = (i + 1) / 5;
    const local = clamp01((fingerProgress - start) / (end - start));
    return local;
  });
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 280 }}>
      <svg viewBox="0 0 200 220" className="h-72 w-64">
        {/* handflata */}
        <ellipse cx="100" cy="160" rx="55" ry="45" fill="white" opacity="0.95" />
        {/* tumme */}
        <motion.ellipse
          cx="40"
          cy="140"
          rx="14"
          ry="28"
          fill="white"
          opacity="0.95"
          animate={{
            rotate: -30 + fingers[0] * 30,
            cy: 140 - fingers[0] * 10,
          }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "40px 160px" }}
        />
        {/* 4 fingrar */}
        {[
          { x: 75, baseY: 120 },
          { x: 100, baseY: 110 },
          { x: 125, baseY: 115 },
          { x: 150, baseY: 130 },
        ].map((f, i) => {
          const open = fingers[i + 1];
          // stängd: kort + nedböjd; öppen: full längd uppåt
          const length = 30 + open * 50;
          const y = f.baseY + (1 - open) * 20;
          return (
            <motion.rect
              key={i}
              x={f.x - 10}
              width={20}
              rx={10}
              fill="white"
              opacity={0.95}
              animate={{ y: y - length, height: length }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 20. WARM-HAND — hand på bröstet, mjuk puls per steg (medkänsla)
// ─────────────────────────────────────────────────────────────
export function WarmHand({ stepIndex = 0, stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  // puls: andas in växer, andas ut krymper
  const scale = 1 + Math.sin(t * Math.PI) * 0.08;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 300 }}>
      {/* värmestrålning */}
      <motion.div
        className="absolute h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(254,215,170,0.6) 0%, rgba(254,202,202,0.3) 50%, transparent 80%)",
          filter: "blur(8px)",
        }}
        animate={{ scale: scale * 1.1, opacity: 0.5 + t * 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {/* bröstkorg-siluett */}
      <svg viewBox="0 0 200 240" className="absolute h-72 w-60">
        <ellipse cx="100" cy="100" rx="55" ry="65" fill="rgba(255,255,255,0.18)" />
      </svg>
      {/* hand */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute h-32 w-32"
        animate={{ scale }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <ellipse cx="50" cy="62" rx="30" ry="26" fill="white" opacity="0.95" />
        {[30, 42, 54, 66].map((x, i) => (
          <rect
            key={i}
            x={x - 5}
            y={20 + (i === 1 || i === 2 ? -2 : 2)}
            width={10}
            height={36}
            rx={5}
            fill="white"
            opacity="0.95"
          />
        ))}
        <ellipse cx="22" cy="58" rx="9" ry="16" fill="white" opacity="0.95" transform="rotate(-25 22 58)" />
      </motion.svg>
      {/* hjärtpuls-indikator (en prick per steg) */}
      <div className="absolute bottom-2 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: i <= stepIndex % 5 ? "white" : "rgba(255,255,255,0.3)" }}
          />
        ))}
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
      return <WarmHand {...p} />;
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
