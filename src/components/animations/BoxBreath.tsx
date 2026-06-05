export type BoxPhase = 0 | 1 | 2 | 3; // 0=in, 1=håll, 2=ut, 3=vila

interface Props {
  phaseIndex: BoxPhase;
  phaseProgress: number;
}

/**
 * Box-andning: en prick vandrar runt en kvadrat, en sida per fas.
 * Platt geometri — ingen gradient, ingen skugga, ingen glow.
 */
export function BoxBreath({ phaseIndex, phaseProgress }: Props) {
  const size = 220;
  const pad = 0;
  const a = pad;
  const b = size - pad;
  const t = Math.max(0, Math.min(1, phaseProgress));

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

  return (
    <div className="grid place-items-center">
      <svg
        viewBox={`-20 -20 ${size + 40} ${size + 40}`}
        className="h-64 w-64 md:h-72 md:w-72"
        aria-hidden
      >
        <rect
          x={a}
          y={a}
          width={b - a}
          height={b - a}
          rx={8}
          ry={8}
          fill="var(--anim-soft, currentColor)"
          fillOpacity={0.35}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={2}
        />
        <circle cx={x} cy={y} r={12} fill="var(--anim-accent, currentColor)" />
      </svg>
    </div>
  );
}
