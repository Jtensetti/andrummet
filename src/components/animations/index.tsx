import { motion } from "framer-motion";

type Props = { phase: string };

/** Andas-blob som växer/krymper utifrån fras */
export function BreathBlob({ phase }: Props) {
  const isIn = /in/i.test(phase);
  const isHold = /håll|paus|vila/i.test(phase);
  const scale = isIn ? 1 : isHold ? 0.9 : 0.55;
  return (
    <div className="relative flex h-72 w-72 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 blur-2xl"
        animate={{ scale: scale * 1.15 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="relative rounded-full bg-white"
        style={{ width: 220, height: 220 }}
        animate={{ scale }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-6">
            <span className="block h-3 w-6 rounded-full bg-[var(--stress-ink)]/70" />
            <span className="block h-3 w-6 rounded-full bg-[var(--stress-ink)]/70" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Box-breathing — punkt rör sig längs en fyrkant */
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
      <div className="absolute inset-0 rounded-3xl border-[6px] border-white/60" />
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-yellow-300 shadow-lg"
        animate={{ x: positions[corner].x, y: positions[corner].y }}
        transition={{ duration: 4, ease: "easeInOut" }}
        style={{ top: -4, left: -4 }}
      />
    </div>
  );
}

/** Passerande tankar — färgglada former glider förbi */
export function PassingThoughts() {
  const items = [
    { color: "#fbbf24", delay: 0, y: 40, size: 60 },
    { color: "#60a5fa", delay: 2, y: 120, size: 80 },
    { color: "#f472b6", delay: 4, y: 200, size: 50 },
    { color: "#34d399", delay: 6, y: 80, size: 70 },
    { color: "#fb923c", delay: 8, y: 160, size: 90 },
  ];
  return (
    <div className="relative h-72 w-full overflow-hidden">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute rounded-3xl"
          style={{
            background: it.color,
            width: it.size,
            height: it.size,
            top: it.y,
          }}
          initial={{ x: -120 }}
          animate={{ x: "110vw" }}
          transition={{
            duration: 12,
            delay: it.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/** Kroppsskanning — ljuspunkt rör sig längs en siluett */
export function BodyScan() {
  return (
    <div className="relative" style={{ width: 140, height: 320 }}>
      <svg viewBox="0 0 140 320" className="absolute inset-0 h-full w-full">
        <circle cx="70" cy="40" r="32" fill="rgba(255,255,255,0.85)" />
        <rect x="32" y="76" width="76" height="140" rx="32" fill="rgba(255,255,255,0.85)" />
        <rect x="44" y="216" width="22" height="92" rx="11" fill="rgba(255,255,255,0.85)" />
        <rect x="74" y="216" width="22" height="92" rx="11" fill="rgba(255,255,255,0.85)" />
      </svg>
      <motion.div
        className="absolute left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-yellow-300"
        style={{ boxShadow: "0 0 40px 14px rgba(253,224,71,0.7)" }}
        animate={{ top: [0, 280, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Stress-reset — stora former rör sig isär */
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

/** Sömn — vågor, måne */
export function SleepWaves() {
  return (
    <div className="relative h-72 w-full overflow-hidden">
      <motion.div
        className="absolute right-10 top-6 h-20 w-20 rounded-full bg-yellow-100"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 rounded-[100%] bg-white/15"
          style={{
            width: 600,
            height: 200,
            bottom: -100 + i * -30,
            x: "-50%",
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
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
      <motion.div
        className="absolute inset-0 rounded-full bg-white/30"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full bg-white"
        animate={{ scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
