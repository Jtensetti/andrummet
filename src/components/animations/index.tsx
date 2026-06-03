import { motion } from "framer-motion";
import type { AnimationKind } from "@/lib/exercises";

type Props = { phase: string };

/** Andas-blob med orbiterande prickar */
export function BreathBlob({ phase }: Props) {
  const isIn = /in/i.test(phase);
  const isHold = /håll|paus|vila/i.test(phase);
  const scale = isIn ? 1 : isHold ? 0.9 : 0.55;
  return (
    <div className="relative flex h-72 w-72 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-white/15 blur-2xl"
        animate={{ scale: scale * 1.15 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-white"
        style={{ width: 200, height: 200 }}
        animate={{ scale }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full bg-white/80"
          style={{ originX: "0px", originY: "0px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
        >
          <span
            className="absolute block h-3 w-3 rounded-full bg-white/90"
            style={{ left: 110 + i * 12, top: 0 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/** Box-breathing — ljus åker längs en fyrkant */
export function BoxBreath({ phase }: Props) {
  const corner = /in/i.test(phase)
    ? 0
    : /håll/i.test(phase) && !/ut/i.test(phase)
      ? 1
      : /ut/i.test(phase)
        ? 2
        : 3;
  const positions = [
    { x: 0, y: 0 },
    { x: 240, y: 0 },
    { x: 240, y: 240 },
    { x: 0, y: 240 },
  ];
  return (
    <div className="relative" style={{ width: 280, height: 280 }}>
      <div className="absolute inset-0 rounded-3xl border-[6px] border-white/50" />
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-yellow-300 shadow-[0_0_30px_10px_rgba(253,224,71,0.5)]"
        animate={{ x: positions[corner].x, y: positions[corner].y }}
        transition={{ duration: 4, ease: "easeInOut" }}
        style={{ top: -4, left: -4 }}
      />
    </div>
  );
}

/** Drivande löv längs bezier-banor — för "tankar som passerar" */
export function DriftingLeaves() {
  const leaves = [
    { color: "#fbbf24", delay: 0, dur: 14, y: 30, sway: 60, size: 36 },
    { color: "#60a5fa", delay: 3, dur: 18, y: 90, sway: 40, size: 28 },
    { color: "#f472b6", delay: 6, dur: 16, y: 170, sway: 80, size: 44 },
    { color: "#34d399", delay: 1, dur: 20, y: 220, sway: 50, size: 32 },
    { color: "#fb923c", delay: 9, dur: 15, y: 60, sway: 70, size: 40 },
  ];
  return (
    <div className="relative h-72 w-full overflow-hidden">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: l.y }}
          initial={{ x: -80, y: 0, rotate: 0 }}
          animate={{
            x: ["-10vw", "30vw", "60vw", "110vw"],
            y: [0, -l.sway, l.sway / 2, 0],
            rotate: [0, 60, -40, 120],
          }}
          transition={{
            duration: l.dur,
            delay: l.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 40 40">
            <path
              d="M20 4 C32 12 36 24 20 36 C4 24 8 12 20 4 Z"
              fill={l.color}
              opacity={0.85}
            />
            <path d="M20 6 L20 34" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** Spiral inåt/utåt — andetag följer en spiralbana */
export function Spiral({ phase }: Props) {
  const isIn = /in/i.test(phase);
  // Bygg en logaritmisk spiral som SVG-path
  const points: string[] = [];
  const turns = 3.5;
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const r = 8 + t * 110;
    const x = 150 + r * Math.cos(angle);
    const y = 150 + r * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return (
    <div className="relative grid place-items-center" style={{ width: 300, height: 300 }}>
      <svg viewBox="0 0 300 300" className="absolute inset-0">
        <motion.path
          d={points.join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isIn ? 1 : 0 }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="h-3 w-3 rounded-full bg-yellow-200 shadow-[0_0_24px_8px_rgba(254,240,138,0.6)]"
        animate={{ scale: isIn ? 1.4 : 0.8 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Orbit — flera prickar på ellipsbanor, fasförskjutna */
export function Orbit() {
  const orbits = [
    { rx: 110, ry: 70, dur: 9, color: "#fde68a", delay: 0 },
    { rx: 80, ry: 100, dur: 11, color: "#fca5a5", delay: 1 },
    { rx: 130, ry: 50, dur: 13, color: "#a7f3d0", delay: 2.5 },
  ];
  return (
    <div className="relative grid place-items-center" style={{ width: 300, height: 260 }}>
      <div className="h-6 w-6 rounded-full bg-white" />
      {orbits.map((o, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "linear" }}
          style={{ width: o.rx * 2, height: o.ry * 2 }}
        >
          <div
            className="absolute rounded-full"
            style={{
              left: o.rx * 2 - 10,
              top: o.ry - 8,
              width: 16,
              height: 16,
              background: o.color,
              boxShadow: `0 0 20px 6px ${o.color}80`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/** Pendel — passagerare på bussen */
export function Pendulum() {
  return (
    <div className="relative" style={{ width: 280, height: 300 }}>
      <div className="absolute left-1/2 top-0 h-2 w-32 -translate-x-1/2 rounded-full bg-white/30" />
      <motion.div
        className="absolute left-1/2 top-2 origin-top"
        style={{ width: 4, height: 200, background: "rgba(255,255,255,0.45)", translateX: -2 }}
        animate={{ rotate: [-18, 18, -18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-yellow-200 shadow-[0_0_40px_12px_rgba(254,240,138,0.4)]"
        />
      </motion.div>
    </div>
  );
}

/** Flikar som stängs — fyrkanter glider ut */
export function ClosingTabs() {
  return (
    <div className="relative" style={{ width: 300, height: 260 }}>
      {[
        { x: -160, delay: 0.5, color: "#fbbf24" },
        { x: 180, delay: 2.5, color: "#fb923c" },
        { x: -200, delay: 4.5, color: "#f472b6" },
      ].map((t, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 rounded-2xl"
          style={{
            width: 200,
            height: 56,
            top: 30 + i * 70,
            background: t.color,
            translateX: -100,
          }}
          initial={{ opacity: 1, x: -100 }}
          animate={{ x: [-100, -100, -100 + t.x], opacity: [1, 1, 0] }}
          transition={{
            duration: 6,
            delay: t.delay,
            times: [0, 0.6, 1],
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut",
          }}
        >
          <div className="flex h-full items-center gap-3 px-4">
            <div className="h-3 w-3 rounded-full bg-black/30" />
            <div className="h-2 flex-1 rounded-full bg-black/20" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Värmestråle vandrar genom kroppen */
export function WarmBeam() {
  return (
    <div className="relative" style={{ width: 160, height: 320 }}>
      <svg viewBox="0 0 160 320" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="40" r="32" fill="url(#bodyG)" />
        <rect x="42" y="76" width="76" height="140" rx="32" fill="url(#bodyG)" />
        <rect x="54" y="216" width="22" height="92" rx="11" fill="url(#bodyG)" />
        <rect x="84" y="216" width="22" height="92" rx="11" fill="url(#bodyG)" />
      </svg>
      <motion.div
        className="absolute left-1/2 h-16 w-44 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(254,240,138,0.8) 0%, rgba(251,146,60,0.4) 50%, transparent 75%)",
          filter: "blur(4px)",
          mixBlendMode: "screen",
        }}
        animate={{ top: [10, 280, 10] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Sten som sänks — lägg ner stenen */
export function LiftingStone() {
  return (
    <div className="relative h-72 w-72 overflow-hidden">
      {/* horisont */}
      <div
        className="absolute left-0 right-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 130, height: 130 }}
        animate={{
          y: [40, 40, 180],
          scale: [1, 1, 0.6],
          opacity: [1, 1, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 1] }}
      >
        <svg viewBox="0 0 130 130" className="h-full w-full">
          <ellipse cx="65" cy="78" rx="58" ry="40" fill="#a3a3a3" />
          <ellipse cx="50" cy="64" rx="34" ry="18" fill="rgba(255,255,255,0.25)" />
        </svg>
      </motion.div>
      {/* ringar i vattnet */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 bottom-12 -translate-x-1/2 rounded-full border border-white/40"
          style={{ width: 80, height: 18 }}
          animate={{ scale: [0.4, 1.6 + i * 0.4], opacity: [0.7, 0] }}
          transition={{
            duration: 3,
            delay: 5 + i * 0.6,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Konstellation — punkter ritar sig själva och förbinds */
export function Constellation() {
  const stars = [
    { x: 30, y: 60 },
    { x: 90, y: 30 },
    { x: 150, y: 80 },
    { x: 210, y: 50 },
    { x: 250, y: 140 },
    { x: 180, y: 180 },
    { x: 110, y: 200 },
    { x: 50, y: 160 },
  ];
  return (
    <div className="relative" style={{ width: 300, height: 240 }}>
      <svg viewBox="0 0 300 240" className="absolute inset-0">
        {stars.slice(0, -1).map((s, i) => {
          const next = stars[i + 1];
          return (
            <motion.line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={1.2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.7, repeat: Infinity, repeatDelay: 10 - i * 0.7 }}
            />
          );
        })}
        {stars.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={5}
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.6, delay: i * 0.7, repeat: Infinity, repeatDelay: 10 - i * 0.7 }}
            style={{
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))",
              transformOrigin: `${s.x}px ${s.y}px`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/** Stress-reset — stora former driver isär */
export function ResetShapes() {
  return (
    <div className="relative h-72 w-72">
      <motion.div
        className="absolute h-40 w-40 rounded-3xl bg-yellow-300"
        animate={{ x: [-10, -80, -10], y: [-10, -60, -10], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: 0, left: 0 }}
      />
      <motion.div
        className="absolute h-44 w-44 rounded-full bg-orange-400"
        animate={{ x: [10, 60, 10], y: [10, 50, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: 0, right: 0 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-amber-200"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Sömn-vågor med olika frekvens och fas */
export function SleepWaves() {
  return (
    <div className="relative h-72 w-full overflow-hidden">
      <motion.div
        className="absolute right-10 top-6 h-20 w-20 rounded-full bg-yellow-100"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {[
        { dur: 7, amp: 12, opacity: 0.18, offset: -80 },
        { dur: 11, amp: 18, opacity: 0.14, offset: -110 },
        { dur: 9, amp: 8, opacity: 0.22, offset: -140 },
      ].map((w, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 rounded-[100%] bg-white"
          style={{
            width: 700,
            height: 220,
            bottom: w.offset,
            x: "-50%",
            opacity: w.opacity,
          }}
          animate={{ y: [0, -w.amp, 0, w.amp, 0] }}
          transition={{
            duration: w.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.3,
          }}
        />
      ))}
    </div>
  );
}

/** Självmedkänsla — hjärta som landar mjukt */
export function CompassionHeart() {
  return (
    <div className="relative h-72 w-72">
      <motion.div
        className="absolute inset-0 m-auto h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,200,0.5) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 m-auto h-48 w-48"
        animate={{ scale: [1, 1.08, 1], y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M50 86 C20 64 10 42 28 30 C40 22 50 32 50 40 C50 32 60 22 72 30 C90 42 80 64 50 86 Z"
          fill="white"
        />
      </motion.svg>
    </div>
  );
}

/** Pulserande cirkel — akut paus */
export function PulseCircle() {
  return (
    <div className="relative h-64 w-64">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full bg-white/25"
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.3,
          }}
        />
      ))}
      <motion.div
        className="absolute inset-6 rounded-full bg-white"
        animate={{ scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Kroppsskanning (legacy — pekar på warm-beam) */
export function BodyScan() {
  return <WarmBeam />;
}

/** Passerande tankar (legacy — alias för drifting-leaves) */
export function PassingThoughts() {
  return <DriftingLeaves />;
}

export function AnimationFor({
  kind,
  phase,
}: {
  kind: AnimationKind;
  phase: string;
}) {
  switch (kind) {
    case "breath-blob": return <BreathBlob phase={phase} />;
    case "box-breath": return <BoxBreath phase={phase} />;
    case "passing-thoughts": return <DriftingLeaves />;
    case "body-scan": return <WarmBeam />;
    case "reset-shapes": return <ResetShapes />;
    case "sleep-waves": return <SleepWaves />;
    case "compassion-heart": return <CompassionHeart />;
    case "pulse": return <PulseCircle />;
    case "spiral": return <Spiral phase={phase} />;
    case "orbit": return <Orbit />;
    case "pendulum": return <Pendulum />;
    case "drifting-leaves": return <DriftingLeaves />;
    case "closing-tabs": return <ClosingTabs />;
    case "warm-beam": return <WarmBeam />;
    case "lifting-stone": return <LiftingStone />;
    case "constellation": return <Constellation />;
  }
}
