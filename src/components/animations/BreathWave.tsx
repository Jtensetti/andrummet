export type WavePhase = 0 | 1; // 0=in, 1=ut

interface Props {
  phaseIndex: WavePhase;
  /** 0→1 inom aktuell fas */
  phaseProgress: number;
}

/**
 * Lång utandning — en horisontal våg som stiger under "in" och sjunker
 * under "ut". Eftersom ut är längre än in, ser och känner man att
 * utandningen tar mer tid. Drivs helt av phaseProgress; inga egna transitions.
 */
export function BreathWave({ phaseIndex, phaseProgress }: Props) {
  const w = 280;
  const h = 180;
  const baseY = h * 0.72;
  const maxAmp = h * 0.35;

  const t = Math.max(0, Math.min(1, phaseProgress));
  // Mjuk in/out så amplituden inte rycker vid ändpunkterna.
  const ease = (u: number) => 0.5 - Math.cos(Math.PI * u) / 2;
  const amp = phaseIndex === 0 ? maxAmp * ease(t) : maxAmp * (1 - ease(t));

  // Bygg en sinusvåg över bredden.
  const points: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    // En enda mjuk båge (halv sinus) som blir högre när amp växer.
    const y = baseY - Math.sin((i / steps) * Math.PI) * amp;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const linePath = `M ${points.join(" L ")}`;
  const fillPath = `${linePath} L ${w},${h} L 0,${h} Z`;

  // Punkten åker längs vågen — under in från vänster till topp,
  // under ut från topp ner mot höger.
  const dotU = phaseIndex === 0 ? t * 0.5 : 0.5 + t * 0.5;
  const dotX = dotU * w;
  const dotY = baseY - Math.sin(dotU * Math.PI) * amp;

  return (
    <div className="grid place-items-center">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-56 w-[22rem] md:h-64 md:w-[26rem]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bw-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* bottenlinje */}
        <line
          x1={0}
          x2={w}
          y1={baseY}
          y2={baseY}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1.5}
        />

        {/* fylld våg */}
        <path d={fillPath} fill="url(#bw-fill)" />
        {/* vågens kant */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* glödhalo + punkt */}
        <circle cx={dotX} cy={dotY} r={16} fill="currentColor" opacity={0.18} />
        <circle cx={dotX} cy={dotY} r={9} fill="currentColor" />
      </svg>
    </div>
  );
}
