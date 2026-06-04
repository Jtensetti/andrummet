import { motion } from "framer-motion";

export type BoxPhase = 0 | 1 | 2 | 3; // 0=in, 1=hold, 2=ut, 3=vila

interface Props {
  /** 0=Andas in, 1=Håll, 2=Andas ut, 3=Vila */
  phaseIndex: BoxPhase;
  /** 0→1 inom aktuell fas */
  phaseProgress: number;
}

/**
 * Box-andning: en lysande punkt vandrar runt en kvadrat, en sida per fas.
 * Komponenten är "dum" — den drivs helt av phaseIndex + phaseProgress
 * från övningens klocka, så text, räknare och animation kan inte glida isär.
 */
export function BoxBreath({ phaseIndex, phaseProgress }: Props) {
  const size = 220;
  const pad = 24;
  const a = pad;
  const b = size - pad;
  const t = Math.max(0, Math.min(1, phaseProgress));

  // Punktens position längs aktuell sida.
  // 0: topp v→h, 1: höger n→s, 2: botten h→v, 3: vänster s→n
  let x = a;
  let y = a;
  if (phaseIndex === 0) {
    x = a + (b - a) * t;
    y = a;
  } else if (phaseIndex === 1) {
    x = b;
    y = a + (b - a) * t;
  } else if (phaseIndex === 2) {
    x = b - (b - a) * t;
    y = b;
  } else {
    x = a;
    y = b - (b - a) * t;
  }

  // Fyllnivå (0→1): växer under in, står still under håll-1, sjunker under ut, står still under vila.
  let fill = 0;
  if (phaseIndex === 0) fill = t;
  else if (phaseIndex === 1) fill = 1;
  else if (phaseIndex === 2) fill = 1 - t;
  else fill = 0;

  const fillTop = b - (b - a) * fill;

  const pulse = phaseIndex === 1 || phaseIndex === 3;

  return (
    <div className="grid place-items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-64 w-64 md:h-72 md:w-72"
        aria-hidden
      >
        <defs>
          <linearGradient id="bb-fill" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
          <clipPath id="bb-clip">
            <rect x={a} y={a} width={b - a} height={b - a} rx={18} ry={18} />
          </clipPath>
        </defs>

        {/* fyllning som följer andetaget */}
        <g clipPath="url(#bb-clip)">
          <motion.rect
            x={a}
            width={b - a}
            fill="url(#bb-fill)"
            animate={{ y: fillTop, height: b - fillTop }}
            transition={{ ease: "linear", duration: 0.25 }}
          />
        </g>

        {/* själva boxen */}
        <rect
          x={a}
          y={a}
          width={b - a}
          height={b - a}
          rx={18}
          ry={18}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={2}
        />

        {/* glödande punkt */}
        <motion.circle
          cx={x}
          cy={y}
          r={10}
          fill="currentColor"
          animate={{
            cx: x,
            cy: y,
            scale: pulse ? [1, 1.15, 1] : 1,
            opacity: pulse ? [0.85, 1, 0.85] : 1,
          }}
          transition={{
            cx: { ease: "linear", duration: 0.25 },
            cy: { ease: "linear", duration: 0.25 },
            scale: pulse
              ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 },
            opacity: pulse
              ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 },
          }}
        />
        <motion.circle
          cx={x}
          cy={y}
          r={18}
          fill="currentColor"
          opacity={0.18}
          animate={{ cx: x, cy: y }}
          transition={{ ease: "linear", duration: 0.25 }}
        />
      </svg>
    </div>
  );
}
