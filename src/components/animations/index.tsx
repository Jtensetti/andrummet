/**
 * Abstrakta animationsprimitiver.
 *
 * Bara: cirklar, rektanglar, linjer, prickar, polygoner.
 * Inga gradienter. Inga skuggor. Inga "glow"-haloar. Inga blur.
 * Platt fyllning + linje. Allt drivs av övningens klocka.
 *
 * Färgkontrakt (ärvs från sidans tema via CSS-variabler):
 *   currentColor       = text/ink (linjer, outline, neutralt)
 *   var(--anim-accent) = den centrala formen / aktiv prick
 *   var(--anim-soft)   = sekundär yta / spöken / bakgrundsformer
 *   var(--anim-on)     = ljus kontrast (mot mörka teman)
 */

export type AnimationKind =
  | "box"
  | "bow"
  | "orb"
  | "meter-down"
  | "meter-up"
  | "dots"
  | "drift"
  | "traffic-dots"
  | "ring"
  | "petals"
  | "stack"
  | "horizon"
  | "weight"
  | "gather"
  | "tilt"
  | "polygon";

type Props = {
  phase?: string;
  progress?: number; // hela övningens progress 0..1
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number; // 0..1 inom aktuellt steg
};

const ACCENT = "var(--anim-accent, currentColor)";
const SOFT = "var(--anim-soft, currentColor)";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

function breathOf(phase: string): "in" | "out" | "hold" | "rest" | null {
  const p = (phase ?? "").toLowerCase();
  if (/andas\s*in|inand/.test(p) && !/ut/.test(p)) return "in";
  if (/andas\s*ut|utand/.test(p)) return "out";
  if (/håll/.test(p)) return "hold";
  if (/vila|paus/.test(p)) return "rest";
  return null;
}

// ─── Box ──────────────────────────────────────────────────────
function Box({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase);
  const sideFromPhase =
    b === "in" ? 0 : b === "hold" ? 1 : b === "out" ? 2 : b === "rest" ? 3 : null;
  const side = (sideFromPhase ?? stepIndex) % 4;
  const t = clamp01(stepProgress);
  const S = 220;
  const pts: Array<[number, number]> = [
    [0, 0],
    [S, 0],
    [S, S],
    [0, S],
  ];
  const from = pts[side];
  const to = pts[(side + 1) % 4];
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  return (
    <svg viewBox={`-20 -20 ${S + 40} ${S + 40}`} className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <rect x={0} y={0} width={S} height={S} rx={8} ry={8} fill={SOFT} fillOpacity={0.35} stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
      <circle cx={x} cy={y} r={12} fill={ACCENT} />
    </svg>
  );
}

// ─── Bow ──────────────────────────────────────────────────────
function Bow({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase) ?? (stepIndex % 2 === 0 ? "in" : "out");
  const w = 280;
  const h = 180;
  const baseY = h * 0.78;
  const maxAmp = h * 0.55;
  const t = clamp01(stepProgress);
  const ease = (u: number) => 0.5 - Math.cos(Math.PI * u) / 2;
  const amp =
    b === "in" ? maxAmp * ease(t)
    : b === "out" ? maxAmp * (1 - ease(t))
    : b === "hold" ? maxAmp
    : 0;

  const points: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = baseY - Math.sin((i / steps) * Math.PI) * amp;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const dotU = b === "in" ? t * 0.5 : b === "out" ? 0.5 + t * 0.5 : 0.5;
  const dotX = dotU * w;
  const dotY = baseY - Math.sin(dotU * Math.PI) * amp;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-[22rem] md:h-64 md:w-[26rem]" aria-hidden>
      <line x1={0} x2={w} y1={baseY} y2={baseY} stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
      <path d={`M ${points.join(" L ")}`} fill="none" stroke={SOFT} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
      <circle cx={dotX} cy={dotY} r={11} fill={ACCENT} />
    </svg>
  );
}

// ─── Orb ──────────────────────────────────────────────────────
function Orb({ phase = "", progress = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase);
  const t = clamp01(stepProgress);
  // Eased breath: mjuk in/ut istället för linjär. Neutral mittpunkt 0.72
  // gör att icke-andnings-steg ("Stanna", "Stilla") kan stå still utan att
  // skapa ett synligt hopp mellan steg.
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const NEUTRAL = 0.72;
  let scale: number;
  if (b === "in") scale = lerp(NEUTRAL, 1, ease);
  else if (b === "out") scale = lerp(NEUTRAL, 0.4, ease);
  else if (b === "hold") scale = 1;
  else if (b === "rest") scale = 0.45;
  else scale = NEUTRAL; // stilla, ingen egen puls
  // Bakgrundsringen andas långsamt över hela övningen — fristående från steg.
  const ringOpacity = 0.32 + 0.12 * Math.sin(clamp01(progress) * Math.PI * 2);
  const R = 110;
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={ringOpacity} />
      <circle cx={0} cy={0} r={R * scale} fill={ACCENT} />
    </svg>
  );
}

// ─── Meter ────────────────────────────────────────────────────
function Meter({
  progress = 0,
  stepIndex = 0,
  stepCount = 1,
  stepProgress = 0,
  direction = "down",
}: Props & { direction?: "down" | "up" }) {
  const stepFraction =
    stepCount > 0 ? (stepIndex + clamp01(stepProgress)) / stepCount : clamp01(progress);
  const p = clamp01(stepFraction);
  const filled = direction === "down" ? 1 - p : p;
  const W = 100;
  const H = 260;
  const fillH = filled * H;
  return (
    <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} className="h-72 w-32" aria-hidden>
      <rect x={0} y={0} width={W} height={H} rx={12} ry={12} fill={SOFT} fillOpacity={0.4} />
      <rect x={0} y={H - fillH} width={W} height={fillH} rx={12} ry={12} fill={ACCENT} />
    </svg>
  );
}

// ─── Dots ─────────────────────────────────────────────────────
function Dots({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const total = Math.max(1, stepCount);
  const active = stepIndex + clamp01(stepProgress);
  const R = 20;
  const gap = 14;
  const perRow = Math.min(total, 6);
  const rows = Math.ceil(total / perRow);
  const W = perRow * (R * 2) + (perRow - 1) * gap;
  const H = rows * (R * 2) + (rows - 1) * gap;
  const cells = Array.from({ length: total }, (_, i) => i);
  return (
    <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} className="h-56 w-auto" style={{ maxWidth: "22rem" }} aria-hidden>
      {cells.map((i) => {
        const r = Math.floor(i / perRow);
        const c = i % perRow;
        const cx = c * (R * 2 + gap) + R;
        const cy = r * (R * 2 + gap) + R;
        const lit = i < Math.floor(active);
        const partial = i === Math.floor(active) ? active - Math.floor(active) : 0;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={R} fill={SOFT} fillOpacity={0.45} />
            {(lit || partial > 0) && (
              <circle cx={cx} cy={cy} r={R - 3} fill={ACCENT} fillOpacity={lit ? 1 : partial} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Drift ────────────────────────────────────────────────────
function Drift({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const W = 320;
  const H = 160;
  const baseY = H / 2;
  const t = clamp01(stepProgress);
  const x = lerp(20, W - 20, t);
  const past = Array.from({ length: Math.min(stepIndex, 4) }, (_, i) => i);
  void stepCount;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-[22rem]" aria-hidden>
      <line x1={0} x2={W} y1={baseY} y2={baseY} stroke={SOFT} strokeOpacity={0.7} strokeWidth={3} />
      {past.map((i) => (
        <circle
          key={i}
          cx={lerp(20, W - 20, ((stepIndex - i - 1) % 4) / 4 + 0.85) % (W - 40) + 20}
          cy={baseY}
          r={7}
          fill={ACCENT}
          fillOpacity={0.25}
        />
      ))}
      <circle cx={x} cy={baseY} r={14} fill={ACCENT} />
    </svg>
  );
}

// ─── TrafficDots ──────────────────────────────────────────────
// Mappas mot stegets text:
//   "Rött: stanna helt"           → röd lyser, helt stilla
//   "Gult: vad känns under?"      → gul lyser, mjuk "lyssna"-puls inåt
//   "Gult: vad är du rädd för?"   → gul lyser, samma lyssna-puls
//   "Grönt: välj handling"        → grön lyser, växer sakta utåt (rörelse)
function TrafficDots({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const p = phase.toLowerCase();
  const i = /röd|stanna|stopp/.test(p) ? 0
    : /gul|märk|under|rädd|vad känns/.test(p) ? 1
    : /grön|välj|svara|gå|nästa/.test(p) ? 2
    : stepIndex % 3;
  const colors = ["#ef4444", "#fbbf24", "#34d399"];
  const R = 34;
  const gap = 16;
  const W = R * 2 + 44;
  const H = 3 * (R * 2) + 2 * gap + 44;

  // Mjuk puls 0..1..0 över hela steget (cosinus)
  const pulse = 0.5 - Math.cos(clamp01(stepProgress) * Math.PI * 2) / 2;

  // Skala per aktiv lampa: röd stilla, gul lyssnar (krymper svagt), grön rörelse (växer)
  const scaleFor = (k: number) => {
    if (k !== i) return 1;
    if (k === 0) return 1; // stanna helt
    if (k === 1) return 1 - pulse * 0.06; // lyssna inåt
    return 1 + pulse * 0.08; // grönt — fram
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-32" aria-hidden>
      <rect x={6} y={6} width={W - 12} height={H - 12} rx={14} ry={14} fill={SOFT} fillOpacity={0.45} />
      {[0, 1, 2].map((k) => {
        const cy = 22 + R + k * (R * 2 + gap);
        const isActive = k === i;
        return (
          <circle
            key={k}
            cx={W / 2}
            cy={cy}
            r={R * scaleFor(k)}
            fill={colors[k]}
            fillOpacity={isActive ? 1 : 0.22}
          />
        );
      })}
    </svg>
  );
}

// ─── Ring — tre koncentriska cirklar pulserar utåt ───────────
function Ring({ stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  const R = 110;
  const rings = [0, 1, 2].map((i) => {
    const local = clamp01(t * 3 - i);
    const scale = 0.35 + 0.65 * local;
    const opacity = local > 0 ? 0.3 + 0.55 * (1 - Math.abs(local - 0.5) * 2) : 0.18;
    return { r: R * scale, opacity };
  });
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={0.35} />
      {rings.map((r, i) => (
        <circle key={i} cx={0} cy={0} r={r.r} fill="none" stroke={ACCENT} strokeOpacity={r.opacity} strokeWidth={4} />
      ))}
      <circle cx={0} cy={0} r={10} fill={ACCENT} />
    </svg>
  );
}

// ─── Petals — 6 kilar runt centrum ───────────────────────────
function Petals({ stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const n = 6;
  const active = (stepIndex / Math.max(1, stepCount)) * n + clamp01(stepProgress);
  const R = 105;
  const inner = 30;
  const wedge = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n;
    const a1 = a0 + (Math.PI * 2) / n;
    const x0 = Math.cos(a0) * inner;
    const y0 = Math.sin(a0) * inner;
    const x1 = Math.cos(a0) * R;
    const y1 = Math.sin(a0) * R;
    const x2 = Math.cos(a1) * R;
    const y2 = Math.sin(a1) * R;
    const x3 = Math.cos(a1) * inner;
    const y3 = Math.sin(a1) * inner;
    return `M ${x0} ${y0} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 0 0 ${x0} ${y0} Z`;
  };
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const lit = i < Math.floor(active);
        const partial = i === Math.floor(active) ? active - Math.floor(active) : 0;
        const fill = lit || partial > 0 ? ACCENT : SOFT;
        const op = lit ? 1 : partial > 0 ? 0.4 + 0.6 * partial : 0.4;
        return <path key={i} d={wedge(i)} fill={fill} fillOpacity={op} />;
      })}
      <circle cx={0} cy={0} r={inner - 4} fill={ACCENT} />
    </svg>
  );
}

// ─── Stack — rundade kvadrater "läggs ner" en per steg ───────
function Stack({ stepIndex = 0, stepCount = 1 }: Props) {
  const total = Math.max(1, Math.min(stepCount, 5));
  const dropped = Math.min(stepIndex, total);
  const W = 220;
  const H = 260;
  const boxW = 150;
  const boxH = 36;
  const gap = 10;
  const targetX = (W - boxW - 24) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-64 w-56" aria-hidden>
      {/* mål-låda */}
      <rect
        x={targetX}
        y={H - boxH - 18}
        width={boxW + 24}
        height={boxH + 18}
        rx={10}
        fill={SOFT}
        fillOpacity={0.45}
      />
      {Array.from({ length: total }, (_, i) => {
        const isDropped = i < dropped;
        const stackY = 20 + i * (boxH + gap);
        const dropY = H - boxH - 12 - (total - 1 - i) * 3;
        const y = isDropped ? dropY : stackY;
        const fill = isDropped ? SOFT : ACCENT;
        const op = isDropped ? 0.7 : 1;
        return (
          <rect
            key={i}
            x={(W - boxW) / 2}
            y={y}
            width={boxW}
            height={boxH}
            rx={10}
            fill={fill}
            fillOpacity={op}
            style={{ transition: "y 700ms ease, opacity 700ms ease, fill 700ms ease" }}
          />
        );
      })}
    </svg>
  );
}

// ─── Horizon — horisontlinje sjunker över hela övningen ──────
function Horizon({ progress = 0 }: Props) {
  const W = 320;
  const H = 200;
  const y = lerp(H * 0.35, H * 0.82, clamp01(progress));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-[22rem]" aria-hidden>
      <rect x={0} y={0} width={W} height={y} fill={SOFT} fillOpacity={0.45} />
      <rect x={0} y={y} width={W} height={H - y} fill={ACCENT} fillOpacity={0.95} />
      <circle cx={W * 0.78} cy={Math.max(24, y - 42)} r={22} fill={ACCENT} />
    </svg>
  );
}

// ─── Weight — cirkel sjunker längs vertikal linje ────────────
function Weight({ progress = 0, stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const stepFraction = stepCount > 0 ? (stepIndex + clamp01(stepProgress)) / stepCount : clamp01(progress);
  const W = 120;
  const H = 280;
  const top = 24;
  const bottom = H - 32;
  const y = lerp(top, bottom, clamp01(stepFraction));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-32" aria-hidden>
      <line x1={W / 2} x2={W / 2} y1={top} y2={bottom} stroke={SOFT} strokeOpacity={0.7} strokeWidth={3} />
      <rect x={14} y={bottom + 2} width={W - 28} height={10} rx={5} fill={SOFT} fillOpacity={0.6} />
      <circle cx={W / 2} cy={y} r={22} fill={ACCENT} />
    </svg>
  );
}

// ─── Gather — punkter glider in mot mitten ───────────────────
function Gather({ stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  const n = 8;
  const R = 110;
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={0.35} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r = lerp(R, 14, t);
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={9} fill={ACCENT} />;
      })}
      <circle cx={0} cy={0} r={8 + 18 * t} fill={ACCENT} fillOpacity={0.5 + 0.5 * t} />
    </svg>
  );
}

// ─── Tilt — rundad kvadrat vaggar fram och tillbaka ──────────
function Tilt({ stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  const angle = Math.sin(t * Math.PI * 2) * 9;
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <line x1={-110} x2={110} y1={92} y2={92} stroke={SOFT} strokeOpacity={0.7} strokeWidth={3} />
      <g transform={`rotate(${angle})`}>
        <rect x={-74} y={-74} width={148} height={148} rx={26} fill={ACCENT} />
      </g>
    </svg>
  );
}

// ─── Polygon — sexhörning roterar och pulserar ───────────────
function Polygon({ stepProgress = 0, stepIndex = 0 }: Props) {
  const t = clamp01(stepProgress);
  const sides = 6;
  const R = 100 + Math.sin(t * Math.PI) * 12;
  const rot = stepIndex * 14 + t * 36;
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(a) * R).toFixed(2)},${(Math.sin(a) * R).toFixed(2)}`;
  }).join(" ");
  const ptsOuter = Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const r2 = R * 1.18;
    return `${(Math.cos(a) * r2).toFixed(2)},${(Math.sin(a) * r2).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="-140 -140 280 280" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <g transform={`rotate(${-rot * 0.6})`}>
        <polygon points={ptsOuter} fill={SOFT} fillOpacity={0.4} />
      </g>
      <g transform={`rotate(${rot})`}>
        <polygon points={pts} fill={ACCENT} />
      </g>
    </svg>
  );
}

// ─── Router ───────────────────────────────────────────────────
export function AnimationFor(props: { kind: AnimationKind } & Props) {
  const { kind, ...rest } = props;
  switch (kind) {
    case "box": return <Box {...rest} />;
    case "bow": return <Bow {...rest} />;
    case "orb": return <Orb {...rest} />;
    case "meter-down": return <Meter {...rest} direction="down" />;
    case "meter-up": return <Meter {...rest} direction="up" />;
    case "dots": return <Dots {...rest} />;
    case "drift": return <Drift {...rest} />;
    case "traffic-dots": return <TrafficDots {...rest} />;
    case "ring": return <Ring {...rest} />;
    case "petals": return <Petals {...rest} />;
    case "stack": return <Stack {...rest} />;
    case "horizon": return <Horizon {...rest} />;
    case "weight": return <Weight {...rest} />;
    case "gather": return <Gather {...rest} />;
    case "tilt": return <Tilt {...rest} />;
    case "polygon": return <Polygon {...rest} />;
    default: return <Orb {...rest} />;
  }
}
