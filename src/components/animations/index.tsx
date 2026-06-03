import { motion } from "framer-motion";

/**
 * Animation kinds - varje typ har en egen rörelselogik kopplad till
 * övningens syfte. Ingen generisk centrum-puls.
 */
export type AnimationKind =
  // Kärntyper (syftesstyrda)
  | "box-breath"
  | "breath-wave"
  | "body-scan"
  | "passing-traffic"
  | "drifting-clouds"
  | "anchor-drop"
  | "focus-lens"
  | "sorting-shelf"
  | "unknotting"
  | "walking-path"
  | "traffic-light"
  | "battery-fill"
  | "volume-slider"
  | "mailbox"
  | "ember"
  // Legacy aliases (mappas till någon av ovanstående)
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

type Props = { phase?: string; progress?: number };

// ─────────────────────────────────────────────────────────────
// 1. BOX-BREATH — prick åker längs fyrkantens sidor, en per fas
// ─────────────────────────────────────────────────────────────
export function BoxBreath({ phase = "" }: Props) {
  const corner = /in/i.test(phase) && !/ut/i.test(phase)
    ? 0
    : /håll/i.test(phase) && !/ut/i.test(phase)
      ? 1
      : /ut/i.test(phase)
        ? 2
        : /vila|paus|håll/i.test(phase)
          ? 3
          : 0;
  const positions = [
    { x: 0, y: 0 },
    { x: 240, y: 0 },
    { x: 240, y: 240 },
    { x: 0, y: 240 },
  ];
  return (
    <div className="relative" style={{ width: 280, height: 280 }}>
      <div className="absolute inset-0 rounded-3xl border-[6px] border-white/40" />
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-white shadow-[0_0_36px_12px_rgba(255,255,255,0.45)]"
        animate={{ x: positions[corner].x, y: positions[corner].y }}
        transition={{ duration: 3.6, ease: "easeInOut" }}
        style={{ top: -4, left: -4 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. BREATH-WAVE — horisontell våg in/ut från sidan
// ─────────────────────────────────────────────────────────────
export function BreathWave({ phase = "" }: Props) {
  const isIn = /in/i.test(phase) && !/ut/i.test(phase);
  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ width: 320, height: 220 }}>
      <div className="absolute inset-0 bg-white/5" />
      <motion.div
        className="absolute inset-y-0 left-0 bg-white/35"
        animate={{ width: isIn ? "100%" : "0%" }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 100% at left center, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 100% at left center, black 60%, transparent 100%)",
        }}
      />
      <svg className="absolute inset-x-0 bottom-0" viewBox="0 0 320 60" preserveAspectRatio="none">
        <motion.path
          d="M0 30 Q 80 10 160 30 T 320 30 V 60 H 0 Z"
          fill="rgba(255,255,255,0.5)"
          animate={{ x: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. BODY-SCAN — ljuspunkt vandrar nedåt längs siluett
// ─────────────────────────────────────────────────────────────
export function BodyScan({ progress }: Props) {
  // Använd progress om given, annars loopa
  const p = typeof progress === "number" ? progress : undefined;
  return (
    <div className="relative" style={{ width: 160, height: 320 }}>
      <svg viewBox="0 0 160 320" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bodyGr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="40" r="32" fill="url(#bodyGr)" />
        <rect x="42" y="76" width="76" height="140" rx="32" fill="url(#bodyGr)" />
        <rect x="54" y="216" width="22" height="92" rx="11" fill="url(#bodyGr)" />
        <rect x="84" y="216" width="22" height="92" rx="11" fill="url(#bodyGr)" />
      </svg>
      <motion.div
        className="absolute left-1/2 h-10 w-40 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(254,240,138,0.85) 0%, transparent 70%)",
          filter: "blur(3px)",
          mixBlendMode: "screen",
        }}
        {...(p !== undefined
          ? { animate: { top: 10 + p * 280 }, transition: { duration: 0.8, ease: "easeOut" } }
          : {
              animate: { top: [10, 280] },
              transition: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            })}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. PASSING-TRAFFIC — former glider vänster→höger
// ─────────────────────────────────────────────────────────────
export function PassingTraffic() {
  const items = [
    { color: "#fbbf24", y: 20, dur: 14, delay: 0, shape: "rect", size: 60 },
    { color: "#60a5fa", y: 80, dur: 18, delay: 2, shape: "round", size: 44 },
    { color: "#f472b6", y: 140, dur: 12, delay: 5, shape: "rect", size: 70 },
    { color: "#34d399", y: 200, dur: 16, delay: 1, shape: "round", size: 50 },
    { color: "#fb923c", y: 60, dur: 20, delay: 7, shape: "rect", size: 40 },
  ];
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
      {/* horisontlinje */}
      <div className="absolute inset-x-0 bottom-8 h-px bg-white/30" />
      {items.map((it, i) => (
        <motion.div
          key={i}
          className={it.shape === "round" ? "absolute rounded-full" : "absolute rounded-xl"}
          style={{
            top: it.y,
            width: it.size,
            height: it.size * 0.55,
            background: it.color,
            opacity: 0.85,
          }}
          initial={{ x: "-25%" }}
          animate={{ x: ["-25%", "120%"] }}
          transition={{
            duration: it.dur,
            delay: it.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. DRIFTING-CLOUDS — moln i olika opacitet och tempo
// ─────────────────────────────────────────────────────────────
export function DriftingClouds() {
  const clouds = [
    { y: 30, dur: 50, opacity: 0.65, size: 1, delay: 0 },
    { y: 90, dur: 70, opacity: 0.4, size: 1.4, delay: 5 },
    { y: 150, dur: 60, opacity: 0.5, size: 1.1, delay: 12 },
    { y: 200, dur: 80, opacity: 0.3, size: 1.6, delay: 2 },
  ];
  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: 260, background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.16))" }}>
      {clouds.map((c, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 200 80"
          className="absolute"
          style={{
            top: c.y,
            width: 200 * c.size,
            opacity: c.opacity,
          }}
          initial={{ x: "-30%" }}
          animate={{ x: ["-30%", "130%"] }}
          transition={{
            duration: c.dur,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M40 60 Q 20 60 20 45 Q 20 30 38 30 Q 42 18 60 18 Q 78 12 90 28 Q 110 22 120 36 Q 140 36 140 50 Q 140 62 122 62 Z"
            fill="white"
          />
        </motion.svg>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. ANCHOR-DROP — vertikal tyngd sjunker långsamt
// ─────────────────────────────────────────────────────────────
export function AnchorDrop() {
  return (
    <div className="relative overflow-hidden" style={{ width: 240, height: 320 }}>
      {/* vatten / botten */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.32) 100%)",
        }}
      />
      <div className="absolute inset-x-8 bottom-3 h-1 rounded-full bg-white/20" />
      {/* lina */}
      <motion.div
        className="absolute left-1/2 top-0 w-px bg-white/50"
        animate={{ height: [40, 260, 40] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* ankare */}
      <motion.svg
        viewBox="0 0 80 80"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 70, height: 70 }}
        animate={{ top: [40, 250, 40] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
// 7. FOCUS-LENS — spridda punkter samlas mot mitten
// ─────────────────────────────────────────────────────────────
export function FocusLens() {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    return {
      i,
      sx: Math.cos(angle) * 110,
      sy: Math.sin(angle) * 110,
      delay: i * 0.1,
    };
  });
  return (
    <div className="relative grid place-items-center" style={{ width: 300, height: 280 }}>
      <div className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_24px_8px_rgba(255,255,255,0.6)]" />
      {dots.map((d) => (
        <motion.div
          key={d.i}
          className="absolute h-2.5 w-2.5 rounded-full bg-white/80"
          initial={{ x: d.sx, y: d.sy, opacity: 0.4 }}
          animate={{ x: [d.sx, 0], y: [d.sy, 0], opacity: [0.4, 1] }}
          transition={{
            duration: 6,
            delay: d.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. SORTING-SHELF — lappar glider in i fack
// ─────────────────────────────────────────────────────────────
export function SortingShelf() {
  const notes = [
    { color: "#fbbf24", slot: 0, delay: 0 },
    { color: "#60a5fa", slot: 1, delay: 1.5 },
    { color: "#f472b6", slot: 2, delay: 3 },
    { color: "#34d399", slot: 0, delay: 4.5 },
    { color: "#fb923c", slot: 1, delay: 6 },
  ];
  return (
    <div className="relative" style={{ width: 300, height: 240 }}>
      {/* hyllor */}
      <div className="absolute inset-x-4 top-32 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className="h-24 rounded-2xl border-2 border-white/40 bg-white/5"
          />
        ))}
      </div>
      {notes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute h-10 w-16 rounded-md shadow-md"
          style={{ background: n.color, top: 0, left: 110 }}
          animate={{
            top: [0, 0, 150],
            left: [110, 110, 20 + n.slot * 95],
            opacity: [0, 1, 1, 0.85],
            rotate: [0, 0, n.slot === 1 ? 0 : n.slot === 0 ? -6 : 6],
          }}
          transition={{
            duration: 9,
            delay: n.delay,
            repeat: Infinity,
            times: [0, 0.1, 0.6, 1],
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. UNKNOTTING — linje som långsamt mjuknar
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

// ─────────────────────────────────────────────────────────────
// 10. WALKING-PATH — figur går steg-för-steg genom färgfält
// ─────────────────────────────────────────────────────────────
export function WalkingPath({ progress }: Props) {
  const p = typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : undefined;
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
              animate: {
                left: `${20 + p * 270}px`,
                top: `${180 - p * 130}px`,
              },
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

// ─────────────────────────────────────────────────────────────
// 11. TRAFFIC-LIGHT — rött → gult → grönt
// ─────────────────────────────────────────────────────────────
export function TrafficLight({ phase = "" }: Props) {
  const stage = /grön|välj|nästa|handla/i.test(phase)
    ? 2
    : /gul|märk|lägg märke/i.test(phase)
      ? 1
      : /röd|stanna|stopp/i.test(phase)
        ? 0
        : -1; // -1 = autoplay
  const colors = [
    { color: "#ef4444", glow: "rgba(239,68,68,0.6)" },
    { color: "#facc15", glow: "rgba(250,204,21,0.6)" },
    { color: "#22c55e", glow: "rgba(34,197,94,0.6)" },
  ];
  return (
    <div className="relative grid place-items-center" style={{ width: 140, height: 320 }}>
      <div className="flex h-full w-28 flex-col items-center justify-around rounded-3xl bg-black/40 p-4">
        {colors.map((c, i) => {
          const active = stage === -1 ? false : stage === i;
          return (
            <motion.div
              key={i}
              className="h-20 w-20 rounded-full"
              style={{ background: c.color }}
              animate={
                stage === -1
                  ? {
                      opacity: [0.2, 1, 0.2],
                      boxShadow: [
                        `0 0 0 ${c.glow}`,
                        `0 0 36px 8px ${c.glow}`,
                        `0 0 0 ${c.glow}`,
                      ],
                    }
                  : {
                      opacity: active ? 1 : 0.18,
                      boxShadow: active ? `0 0 40px 10px ${c.glow}` : `0 0 0 ${c.glow}`,
                    }
              }
              transition={
                stage === -1
                  ? { duration: 6, delay: i * 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6 }
              }
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 12. BATTERY-FILL — ojämn, långsam fyllning
// ─────────────────────────────────────────────────────────────
export function BatteryFill({ progress }: Props) {
  const p =
    typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : undefined;
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 260 }}>
      <div className="relative h-56 w-32 rounded-3xl border-[6px] border-white/70">
        <div className="absolute -top-4 left-1/2 h-4 w-12 -translate-x-1/2 rounded-t-md bg-white/70" />
        <motion.div
          className="absolute inset-x-1 bottom-1 rounded-2xl bg-gradient-to-t from-emerald-400 to-emerald-200"
          {...(p !== undefined
            ? {
                animate: { height: `${10 + p * 90}%` },
                transition: { duration: 1, ease: "easeOut" },
              }
            : {
                animate: { height: ["10%", "35%", "32%", "60%", "58%", "85%", "10%"] },
                transition: {
                  duration: 24,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.3, 0.5, 0.6, 0.85, 1],
                },
              })}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 13. VOLUME-SLIDER — reglage dras nedåt
// ─────────────────────────────────────────────────────────────
export function VolumeSlider({ progress }: Props) {
  const p =
    typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : undefined;
  return (
    <div className="relative grid place-items-center" style={{ width: 280, height: 320 }}>
      <div className="relative h-72 w-8 rounded-full bg-white/15">
        <div className="absolute inset-x-0 bottom-0 rounded-full bg-white/70" style={{ height: "50%" }} />
        <motion.div
          className="absolute left-1/2 h-14 w-20 -translate-x-1/2 rounded-2xl bg-white shadow-xl"
          {...(p !== undefined
            ? {
                animate: { top: `${10 + p * 75}%` },
                transition: { duration: 0.8, ease: "easeOut" },
              }
            : {
                animate: { top: ["10%", "80%"] },
                transition: {
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              })}
        />
      </div>
      {/* skala */}
      <div className="absolute right-1/4 flex h-72 flex-col justify-between text-[10px] font-bold text-white/60">
        <span>Högt</span>
        <span>Mitt</span>
        <span>Lågt</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 14. MAILBOX — lappar läggs i brevlåda märkt "sen"
// ─────────────────────────────────────────────────────────────
export function Mailbox() {
  return (
    <div className="relative" style={{ width: 320, height: 260 }}>
      {/* brevlåda */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="h-32 w-44 rounded-t-3xl bg-white/85 shadow-xl">
          <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-black/60" />
          <div className="mx-auto mt-3 text-center text-xs font-extrabold text-black/70">
            SEN
          </div>
        </div>
        <div className="h-3 w-44 rounded-b-md bg-white/60" />
      </div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-10 w-20 rounded-md bg-yellow-200 shadow"
          style={{ left: "50%", marginLeft: -40 }}
          animate={{
            top: [-30, 60, 105],
            opacity: [0, 1, 0],
            rotate: [-8, 6, 0],
          }}
          transition={{
            duration: 5,
            delay: i * 2.2,
            repeat: Infinity,
            repeatDelay: 1.5,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 15. EMBER — eld → glöd
// ─────────────────────────────────────────────────────────────
export function Ember({ progress }: Props) {
  const p =
    typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : 0.5;
  // tidig: höga flammor; sent: låg glöd
  const flameOpacity = 1 - p * 0.7;
  const emberOpacity = 0.3 + p * 0.7;
  return (
    <div className="relative grid place-items-end" style={{ width: 260, height: 260 }}>
      {/* glöd */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.7) 0%, rgba(251,146,60,0.3) 50%, transparent 80%)",
          opacity: emberOpacity,
          filter: "blur(2px)",
        }}
      />
      {/* flammor */}
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
// Router — mappar kind → komponent. Legacy-värden faller tillbaka.
// ─────────────────────────────────────────────────────────────
export function AnimationFor({
  kind,
  phase,
  progress,
}: {
  kind: AnimationKind;
  phase?: string;
  progress?: number;
}) {
  switch (kind) {
    // kärntyper
    case "box-breath":
      return <BoxBreath phase={phase} />;
    case "breath-wave":
      return <BreathWave phase={phase} />;
    case "body-scan":
      return <BodyScan progress={progress} />;
    case "passing-traffic":
      return <PassingTraffic />;
    case "drifting-clouds":
      return <DriftingClouds />;
    case "anchor-drop":
      return <AnchorDrop />;
    case "focus-lens":
      return <FocusLens />;
    case "sorting-shelf":
      return <SortingShelf />;
    case "unknotting":
      return <Unknotting />;
    case "walking-path":
      return <WalkingPath progress={progress} />;
    case "traffic-light":
      return <TrafficLight phase={phase} />;
    case "battery-fill":
      return <BatteryFill progress={progress} />;
    case "volume-slider":
      return <VolumeSlider progress={progress} />;
    case "mailbox":
      return <Mailbox />;
    case "ember":
      return <Ember progress={progress} />;

    // legacy → mappar till närmaste syftesstyrda typ
    case "breath-blob":
      return <BreathWave phase={phase} />;
    case "passing-thoughts":
    case "drifting-leaves":
      return <PassingTraffic />;
    case "reset-shapes":
      return <VolumeSlider progress={progress} />;
    case "sleep-waves":
      return <BodyScan progress={progress} />;
    case "compassion-heart":
      return <Unknotting />;
    case "pulse":
      return <AnchorDrop />;
    case "spiral":
      return <BreathWave phase={phase} />;
    case "orbit":
      return <SortingShelf />;
    case "pendulum":
      return <TrafficLight phase={phase} />;
    case "closing-tabs":
      return <Mailbox />;
    case "warm-beam":
      return <BodyScan progress={progress} />;
    case "lifting-stone":
      return <AnchorDrop />;
    case "constellation":
      return <FocusLens />;
  }
}
