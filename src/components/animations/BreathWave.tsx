export type WavePhase = 0 | 1; // 0=in, 1=ut

interface Props {
  phaseIndex: WavePhase;
  phaseProgress: number;
}

/**
 * Lång utandning — en båge stiger under "in" och sjunker under "ut".
 * Platt geometri: en linje + en prick. Ingen gradient, ingen fyllning.
 */
export function BreathWave({ phaseIndex, phaseProgress }: Props) {
  const w = 280;
  const h = 180;
  const baseY = h * 0.78;
  const maxAmp = h * 0.55;

  const t = Math.max(0, Math.min(1, phaseProgress));
  const ease = (u: number) => 0.5 - Math.cos(Math.PI * u) / 2;
  const amp = phaseIndex === 0 ? maxAmp * ease(t) : maxAmp * (1 - ease(t));

  const points: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = baseY - Math.sin((i / steps) * Math.PI) * amp;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const linePath = `M ${points.join(" L ")}`;

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
        <line
          x1={0}
          x2={w}
          y1={baseY}
          y2={baseY}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={2}
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--anim-soft, currentColor)"
          strokeOpacity={0.85}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={dotX} cy={dotY} r={11} fill="var(--anim-accent, currentColor)" />
      </svg>
    </div>
  );
}
