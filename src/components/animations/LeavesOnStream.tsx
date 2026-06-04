import { useEffect, useRef, useState } from "react";

/**
 * Löv på en flod — mjuk horisontal flod med ett aktivt löv som driver förbi
 * en gång per steg. Tidigare lövs spöken ligger kvar längre ner i strömmen.
 *
 * stepIndex: nuvarande steg (0-baserat). Antal "ghost"-löv = clamp(stepIndex, 0..3).
 * stepProgress: 0..1 inom steget. Driver lövets x-position, vagga och opacity-envelop.
 */
export interface LeavesOnStreamProps {
  stepIndex: number;
  stepProgress: number;
}

const W = 600;
const H = 240;

function envelope(p: number): number {
  if (p < 0.08) return p / 0.08;
  if (p > 0.9) return Math.max(0, 1 - (p - 0.9) / 0.1);
  return 1;
}

interface LeafProps {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  shaded?: boolean;
}

function Leaf({ x, y, rot, scale, opacity, shaded = false }: LeafProps) {
  return (
    <g
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${scale.toFixed(3)})`}
      opacity={opacity}
    >
      {/* mandelformat löv */}
      <path
        d="M -30 0 Q -10 -14 30 0 Q 10 14 -30 0 Z"
        fill="currentColor"
        fillOpacity={shaded ? 0.6 : 0.92}
      />
      {/* nerv */}
      <path
        d="M -26 0 L 26 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity={shaded ? 0.35 : 0.55}
        strokeWidth={0.9}
      />
      {/* svag stjälk */}
      <path
        d="M -30 0 L -36 -2"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </g>
  );
}

function Wave({ y, amp, flow, freq, opacity }: {
  y: number;
  amp: number;
  flow: number;
  freq: number;
  opacity: number;
}) {
  const phase = flow * Math.PI * 2;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 10) {
    const yy = y + Math.sin(x * freq + phase) * amp;
    pts.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)},${yy.toFixed(2)}`);
  }
  return (
    <path
      d={pts.join(" ")}
      fill="none"
      stroke="currentColor"
      strokeOpacity={opacity}
      strokeWidth={1.1}
      strokeLinecap="round"
    />
  );
}

export function LeavesOnStream({ stepIndex, stepProgress }: LeavesOnStreamProps) {
  // Kontinuerligt flöde — oberoende av paus i övningsklockan.
  const [flow, setFlow] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;
      // 1 hel cykel per 9 s
      setFlow((elapsed / 9) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = Math.max(0, Math.min(1, stepProgress));

  // Aktivt löv — driver från vänster till höger.
  const ax = (-0.18 + p * 1.36) * W;
  const aRot = Math.sin(p * Math.PI * 4 + 0.3) * 13;
  const aBob = Math.sin(p * Math.PI * 6) * 5;
  const aOp = envelope(p);
  const aScale = 1 + Math.sin(p * Math.PI) * 0.08;

  // Spöklöv — upp till 3 tidigare löv, utspridda nedströms.
  const ghostCount = Math.min(3, Math.max(0, stepIndex));
  const ghosts = Array.from({ length: ghostCount }, (_, i) => {
    const seed = stepIndex - 1 - i; // de senaste först
    const offset = (seed * 0.27 + 0.55) % 1; // 0..1 längs floden
    return {
      x: offset * W,
      y: H * 0.5 + ((seed * 13) % 14) - 7,
      rot: ((seed * 53) % 28) - 14,
      op: 0.16 - i * 0.04,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-md"
      role="img"
      aria-label="En lugn flod där ett löv driver förbi"
    >
      <defs>
        <linearGradient id="lof-river" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="lof-bank" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* strand (övre + nedre) */}
      <rect x="0" y="0" width={W} height={H * 0.3} fill="url(#lof-bank)" />
      <rect
        x="0"
        y={H * 0.7}
        width={W}
        height={H * 0.3}
        fill="url(#lof-bank)"
        transform={`rotate(180 ${W / 2} ${H * 0.85})`}
      />

      {/* flod */}
      <rect x="0" y={H * 0.3} width={W} height={H * 0.4} fill="url(#lof-river)" />

      {/* vågor / reflexer */}
      <Wave y={H * 0.36} amp={2.5} flow={flow} freq={0.028} opacity={0.18} />
      <Wave y={H * 0.46} amp={3.2} flow={flow + 0.18} freq={0.022} opacity={0.28} />
      <Wave y={H * 0.56} amp={2.8} flow={flow + 0.42} freq={0.026} opacity={0.22} />
      <Wave y={H * 0.64} amp={2.2} flow={flow + 0.6} freq={0.03} opacity={0.16} />

      {/* spöklöv */}
      {ghosts.map((g, i) => (
        <Leaf
          key={`ghost-${i}`}
          x={g.x}
          y={g.y}
          rot={g.rot}
          scale={0.7}
          opacity={g.op}
          shaded
        />
      ))}

      {/* aktivt löv */}
      <Leaf x={ax} y={H * 0.5 + aBob} rot={aRot} scale={aScale} opacity={aOp} />
    </svg>
  );
}
