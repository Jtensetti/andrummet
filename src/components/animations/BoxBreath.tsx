export type BoxPhase = 0 | 1 | 2 | 3; // 0=in, 1=håll, 2=ut, 3=vila

interface Props {
  /** 0=Andas in, 1=Håll, 2=Andas ut, 3=Vila */
  phaseIndex: BoxPhase;
  /** 0→1 inom aktuell fas (drivs av övningens klocka, ~60 fps) */
  phaseProgress: number;
}

/**
 * Box-andning: en lysande punkt vandrar runt en kvadrat, en sida per fas.
 * Komponenten är "dum" — den drivs helt av phaseIndex + phaseProgress
 * från övningens klocka. Inga egna transitions, varje frame är exakt rätt.
 */
export function BoxBreath({ phaseIndex, phaseProgress }: Props) {
  const size = 220;
  const pad = 24;
  const a = pad;
  const b = size - pad;
  const t = Math.max(0, Math.min(1, phaseProgress));

  // Punktens position längs aktuell sida.
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

  // Fyllnivå (0→1): växer under in, full under håll, sjunker under ut, tom under vila.
  let fill = 0;
  if (phaseIndex === 0) fill = t;
  else if (phaseIndex === 1) fill = 1;
  else if (phaseIndex === 2) fill = 1 - t;
  else fill = 0;

  const fillTop = b - (b - a) * fill;

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
          <rect
            x={a}
            y={fillTop}
            width={b - a}
            height={b - fillTop}
            fill="url(#bb-fill)"
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

        {/* glödhalo */}
        <circle cx={x} cy={y} r={18} fill="currentColor" opacity={0.18} />
        {/* pricken */}
        <circle cx={x} cy={y} r={10} fill="currentColor" />
      </svg>
    </div>
  );
}
