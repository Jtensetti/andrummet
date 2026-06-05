/**
 * Abstrakta animationsprimitiver.
 *
 * Bara: cirklar, rektanglar, linjer, prickar.
 * Inga gradienter. Inga skuggor. Inga "glow"-haloar. Inga blur.
 * En platt fyllning + en linje. Allt drivs av övningens klocka.
 *
 * Sex primitiver räcker för hela appen:
 *   - box         prick vandrar runt en kvadrat (andning i ruta)
 *   - bow         en båge som höjs och sänks (andning in/ut)
 *   - orb         cirkel växer/krymper (andning, närvaro)
 *   - meter-down  vertikal stapel som töms (volym, sand, ankare, värme nedåt)
 *   - meter-up    vertikal stapel som fylls
 *   - dots        n prickar tänds en i taget (5-4-3-2-1, "tre saker", sortera)
 *   - drift       en prick glider tvärs över en linje (löv, moln, tankar)
 *   - traffic-dots tre cirklar vertikalt med tre färger (trafikljus)
 */

export type AnimationKind =
  | "box"
  | "bow"
  | "orb"
  | "meter-down"
  | "meter-up"
  | "dots"
  | "drift"
  | "traffic-dots";

type Props = {
  phase?: string;
  progress?: number; // hela övningens progress 0..1
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number; // 0..1 inom aktuellt steg
};

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

// ─────────────────────────────────────────────────────────────
// Box — prick längs en kvadrat, en sida per fas/steg.
// ─────────────────────────────────────────────────────────────
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
    <svg
      viewBox={`-20 -20 ${S + 40} ${S + 40}`}
      className="h-64 w-64 md:h-72 md:w-72"
      aria-hidden
    >
      <rect
        x={0}
        y={0}
        width={S}
        height={S}
        rx={4}
        ry={4}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <circle cx={x} cy={y} r={10} fill="currentColor" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Bow — båge som höjs (in) eller sänks (ut). Prick på toppen.
// ─────────────────────────────────────────────────────────────
function Bow({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase) ?? (stepIndex % 2 === 0 ? "in" : "out");
  const w = 280;
  const h = 180;
  const baseY = h * 0.78;
  const maxAmp = h * 0.55;
  const t = clamp01(stepProgress);
  const ease = (u: number) => 0.5 - Math.cos(Math.PI * u) / 2;
  const amp =
    b === "in"
      ? maxAmp * ease(t)
      : b === "out"
        ? maxAmp * (1 - ease(t))
        : b === "hold"
          ? maxAmp
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
        d={`M ${points.join(" L ")}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={dotX} cy={dotY} r={9} fill="currentColor" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Orb — cirkel växer på "in" och krymper på "ut".
// Utan fas-info: pulserar mjukt med stepProgress.
// ─────────────────────────────────────────────────────────────
function Orb({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase);
  const t = clamp01(stepProgress);
  let scale: number;
  if (b === "in") scale = lerp(0.4, 1, t);
  else if (b === "out") scale = lerp(1, 0.4, t);
  else if (b === "hold") scale = 1;
  else if (b === "rest") scale = 0.45;
  else {
    // ingen fas — mjuk närvaro: vandrar 0.6 → 1 → 0.6 över steget
    scale = 0.6 + 0.4 * Math.sin(t * Math.PI);
    void stepIndex;
  }
  const R = 110;
  return (
    <svg
      viewBox="-130 -130 260 260"
      className="h-64 w-64 md:h-72 md:w-72"
      aria-hidden
    >
      <circle
        cx={0}
        cy={0}
        r={R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <circle cx={0} cy={0} r={R * scale} fill="currentColor" fillOpacity={0.85} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Meter — vertikal stapel. direction="down" töms, "up" fylls.
// ─────────────────────────────────────────────────────────────
function Meter({
  progress = 0,
  stepIndex = 0,
  stepCount = 1,
  stepProgress = 0,
  direction = "down",
}: Props & { direction?: "down" | "up" }) {
  // Föredra stegbaserat (snäpp per steg) om vi har stegen — annars övningens progress.
  const stepFraction =
    stepCount > 0
      ? (stepIndex + clamp01(stepProgress)) / stepCount
      : clamp01(progress);
  const p = clamp01(stepFraction);
  const filled = direction === "down" ? 1 - p : p;
  const W = 90;
  const H = 240;
  const fillH = filled * H;
  return (
    <svg
      viewBox={`-10 -10 ${W + 20} ${H + 20}`}
      className="h-64 w-32"
      aria-hidden
    >
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        rx={4}
        ry={4}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <rect
        x={0}
        y={H - fillH}
        width={W}
        height={fillH}
        fill="currentColor"
        fillOpacity={0.85}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Dots — n prickar i en rad. Tänds upp till stepIndex+stepProgress.
// stepCount avgör antal. Vid stepCount > 8 lägger vi i två rader.
// ─────────────────────────────────────────────────────────────
function Dots({
  stepIndex = 0,
  stepCount = 1,
  stepProgress = 0,
}: Props) {
  const total = Math.max(1, stepCount);
  const active = stepIndex + clamp01(stepProgress);
  const R = 18;
  const gap = 14;
  const perRow = Math.min(total, 6);
  const rows = Math.ceil(total / perRow);
  const W = perRow * (R * 2) + (perRow - 1) * gap;
  const H = rows * (R * 2) + (rows - 1) * gap;
  const cells = Array.from({ length: total }, (_, i) => i);
  return (
    <svg
      viewBox={`-10 -10 ${W + 20} ${H + 20}`}
      className="h-56 w-auto"
      style={{ maxWidth: "22rem" }}
      aria-hidden
    >
      {cells.map((i) => {
        const r = Math.floor(i / perRow);
        const c = i % perRow;
        const cx = c * (R * 2 + gap) + R;
        const cy = r * (R * 2 + gap) + R;
        const lit = i < Math.floor(active);
        const partial = i === Math.floor(active) ? active - Math.floor(active) : 0;
        const opacity = lit ? 1 : 0.2 + 0.8 * partial;
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={2}
            />
            <circle
              cx={cx}
              cy={cy}
              r={R - 4}
              fill="currentColor"
              fillOpacity={opacity}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Drift — en prick glider tvärs över en linje, en per steg.
// Tidigare steg lämnar svagare prickar längs linjen.
// ─────────────────────────────────────────────────────────────
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
      <line
        x1={0}
        x2={W}
        y1={baseY}
        y2={baseY}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={2}
      />
      {past.map((i) => (
        <circle
          key={i}
          cx={lerp(20, W - 20, ((stepIndex - i - 1) % 4) / 4 + 0.85) % (W - 40) + 20}
          cy={baseY}
          r={6}
          fill="currentColor"
          fillOpacity={0.15}
        />
      ))}
      <circle cx={x} cy={baseY} r={12} fill="currentColor" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// TrafficDots — tre cirklar vertikalt, en aktiv åt gången.
// ─────────────────────────────────────────────────────────────
function TrafficDots({ phase = "", stepIndex = 0 }: Props) {
  const p = phase.toLowerCase();
  const i = /röd|stanna|stopp/.test(p)
    ? 0
    : /gul|märk|under|rädd|vad känns/.test(p)
      ? 1
      : /grön|välj|svara|gå|nästa/.test(p)
        ? 2
        : stepIndex % 3;
  const colors = ["#ef4444", "#fbbf24", "#34d399"];
  const R = 32;
  const gap = 14;
  const W = R * 2 + 40;
  const H = 3 * (R * 2) + 2 * gap + 40;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-32" aria-hidden>
      <rect
        x={6}
        y={6}
        width={W - 12}
        height={H - 12}
        rx={10}
        ry={10}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={2}
      />
      {[0, 1, 2].map((k) => {
        const cy = 20 + R + k * (R * 2 + gap);
        return (
          <circle
            key={k}
            cx={W / 2}
            cy={cy}
            r={R}
            fill={colors[k]}
            fillOpacity={k === i ? 1 : 0.18}
          />
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Router — varje AnimationKind till en primitiv.
// ─────────────────────────────────────────────────────────────
export function AnimationFor(props: { kind: AnimationKind } & Props) {
  const { kind, ...rest } = props;
  switch (kind) {
    case "box":
      return <Box {...rest} />;
    case "bow":
      return <Bow {...rest} />;
    case "orb":
      return <Orb {...rest} />;
    case "meter-down":
      return <Meter {...rest} direction="down" />;
    case "meter-up":
      return <Meter {...rest} direction="up" />;
    case "dots":
      return <Dots {...rest} />;
    case "drift":
      return <Drift {...rest} />;
    case "traffic-dots":
      return <TrafficDots {...rest} />;
    default:
      return <Orb {...rest} />;
  }
}
