/**
 * Mindful animations.
 *
 * Principer:
 *  1. Klockan styr. Allt visuellt drivs av stepProgress (0..1) och stepIndex
 *     direkt via style/SVG-attribut. Inga framer-motion `animate`-mål med egen
 *     transition som krockar med övningens tempo.
 *  2. Inget teleporterar mellan steg. Slutet på steg N = början på steg N+1.
 *  3. Bilden visar vad texten säger just nu. Andas in → växer.
 *     Andas ut → minskar. Tre saker du ser → tre prickar tänds en i taget.
 *
 * Många AnimationKind-värden från äldre versioner mappas hit till en av tio
 * tydliga primitiver. Hellre färre, lugnare bilder än fyrtio halvfungerande.
 */

export type AnimationKind =
  // primitiver
  | "breath-orb"
  | "box-path"
  | "body-figure"
  | "drifter"
  | "vertical-meter"
  | "anchor-drop"
  | "stoplight"
  | "letter-drop"
  | "soft-heart"
  | "opening-hand"
  // alias som routern mappar vidare
  | "box-breath"
  | "breath-wave"
  | "breath-blob"
  | "belly-hand"
  | "spiral"
  | "orbit"
  | "pulse"
  | "pendulum"
  | "sleep-waves"
  | "body-scan"
  | "warm-beam"
  | "jaw-release"
  | "shoulder-drop"
  | "footprints"
  | "stretch-up"
  | "warm-hand"
  | "passing-traffic"
  | "drifting-clouds"
  | "drifting-leaves"
  | "passing-thoughts"
  | "sand-clock"
  | "candle"
  | "ember"
  | "battery-fill"
  | "volume-slider"
  | "horizon"
  | "morning-sun"
  | "anchor"
  | "lifting-stone"
  | "pebbles"
  | "traffic-light"
  | "path-fork"
  | "mailbox"
  | "note-to-self"
  | "closing-tabs"
  | "inbox-priority"
  | "dropping-bags"
  | "closing-laptop"
  | "typing-cursor"
  | "compassion-heart"
  | "inner-voice"
  | "unknotting"
  | "deflate"
  | "release-balloon"
  | "measuring-tape"
  | "focus-lens"
  | "constellation"
  | "walking-path"
  | "first-step"
  | "doorway"
  | "steering-wheel"
  | "anchor-drop-alias"
  | "sorting-shelf";

type Props = {
  phase?: string;
  progress?: number;       // hela övningens progress 0..1
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number;   // 0..1 inom aktuellt steg
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
// 1. BreathOrb — mjuk cirkel. Växer på in, krymper på ut.
// ─────────────────────────────────────────────────────────────
function BreathOrb({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase) ?? (stepIndex % 2 === 0 ? "in" : "out");
  const t = clamp01(stepProgress);
  // 0.35 → 1.0 skala
  const scale =
    b === "in"   ? lerp(0.35, 1, t) :
    b === "out"  ? lerp(1, 0.35, t) :
    b === "hold" ? 1 :
                   0.45; // rest / okänt
  const ringScale = scale * 1.18;
  return (
    <div className="relative grid place-items-center" style={{ width: 260, height: 260 }}>
      <div
        className="absolute rounded-full border border-white/30"
        style={{
          width: 220, height: 220,
          transform: `scale(${ringScale})`,
          transition: "transform 250ms linear",
        }}
      />
      <div
        className="absolute rounded-full bg-white/70 shadow-[0_0_60px_18px_rgba(255,255,255,0.35)]"
        style={{
          width: 200, height: 200,
          transform: `scale(${scale})`,
          transition: "transform 250ms linear",
        }}
      />
      <span className="relative text-xs font-bold uppercase tracking-widest text-white/80">
        {b === "in" ? "in" : b === "out" ? "ut" : b === "hold" ? "håll" : "vila"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. BoxPath — prick glider en sida per andningsfas. Inga hörn-hopp.
// ─────────────────────────────────────────────────────────────
function BoxPath({ phase = "", stepIndex = 0, stepProgress = 0 }: Props) {
  const b = breathOf(phase);
  // in=0 (topp), håll=1 (höger), ut=2 (botten), vila=3 (vänster)
  const sideFromPhase = b === "in" ? 0 : b === "hold" ? 1 : b === "out" ? 2 : b === "rest" ? 3 : null;
  const side = (sideFromPhase ?? stepIndex) % 4;
  const t = clamp01(stepProgress);
  const S = 220;
  // sidor: 0 vänster→höger längs topp, 1 topp→botten höger, 2 höger→vänster längs botten, 3 botten→topp vänster
  const points: Array<[number, number]> = [
    [0, 0],     // start topp-vänster
    [S, 0],
    [S, S],
    [0, S],
  ];
  const from = points[side];
  const to = points[(side + 1) % 4];
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  const labels = ["in", "håll", "ut", "vila"];
  return (
    <div className="relative" style={{ width: S + 40, height: S + 40 }}>
      <div className="absolute rounded-3xl border-[5px] border-white/30" style={{ inset: 20, width: S, height: S }} />
      <div
        className="absolute h-10 w-10 rounded-full bg-white shadow-[0_0_40px_14px_rgba(255,255,255,0.45)]"
        style={{
          left: 20 + x - 20, top: 20 + y - 20,
          transition: "left 200ms linear, top 200ms linear",
        }}
      />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-white/80">
        {labels[side]}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. BodyFigure — silhuett med pulserande zon + etikett.
// ─────────────────────────────────────────────────────────────
const BODY_ZONES: Array<{ key: string; y: number; label: string; matchers: RegExp[] }> = [
  { key: "head",     y:  40, label: "pannan",       matchers: [/pann|hjäss|huvud/] },
  { key: "jaw",      y:  72, label: "käken",        matchers: [/käk|mun|tung/] },
  { key: "shoulder", y: 100, label: "axlarna",      matchers: [/axl|hals|nack/] },
  { key: "chest",    y: 130, label: "bröstkorgen",  matchers: [/bröst/] },
  { key: "belly",    y: 165, label: "magen",        matchers: [/mag/] },
  { key: "hips",     y: 200, label: "höfter / ben", matchers: [/höft|ben/] },
  { key: "feet",     y: 260, label: "fötterna",     matchers: [/fot|fötter|tå|häl|golv/] },
];

function zoneFor(phase: string, stepIndex: number, stepCount: number) {
  const p = (phase ?? "").toLowerCase();
  for (const z of BODY_ZONES) if (z.matchers.some((re) => re.test(p))) return z;
  // fallback: glid genom kroppen jämnt
  const idx = Math.min(BODY_ZONES.length - 1, Math.floor((stepIndex / Math.max(1, stepCount)) * BODY_ZONES.length));
  return BODY_ZONES[idx];
}

function BodyFigure({ phase = "", stepIndex = 0, stepCount = 1, stepProgress = 0 }: Props) {
  const zone = zoneFor(phase, stepIndex, stepCount);
  const pulse = 0.85 + 0.15 * Math.sin(stepProgress * Math.PI * 2);
  return (
    <div className="relative flex items-center gap-6" style={{ height: 320 }}>
      <svg viewBox="0 0 140 300" className="h-72 w-auto">
        <defs>
          <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="36" r="26" fill="url(#bodyG)" />
        <rect x="38" y="68" width="64" height="130" rx="28" fill="url(#bodyG)" />
        <rect x="46" y="198" width="20" height="92" rx="10" fill="url(#bodyG)" />
        <rect x="74" y="198" width="20" height="92" rx="10" fill="url(#bodyG)" />
        {/* fokusring */}
        <circle
          cx="70"
          cy={zone.y}
          r={28 * pulse}
          fill="rgba(254,240,138,0.25)"
          stroke="rgba(254,240,138,0.9)"
          strokeWidth="2"
          style={{ transition: "cy 600ms ease, r 200ms linear" }}
        />
      </svg>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">fokus</span>
        <span className="text-lg font-extrabold text-white/95">{zone.label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Drifter — ETT objekt per steg glider lugnt höger→vänster.
// ─────────────────────────────────────────────────────────────
function Drifter({ stepIndex = 0, stepProgress = 0, kind = "cloud" as "cloud" | "leaf" | "car" | "thought" }: Props & { kind?: "cloud" | "leaf" | "car" | "thought" }) {
  const palette = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#fed7aa", "#ddd6fe"];
  const color = palette[stepIndex % palette.length];
  const t = clamp01(stepProgress);
  const x = lerp(100, -20, t); // 100% → -20%
  const y = 60 + (stepIndex * 23) % 80;
  return (
    <div className="relative w-[320px] overflow-hidden rounded-3xl bg-black/10" style={{ height: 220 }}>
      <div className="absolute inset-x-4 bottom-6 h-px bg-white/30" />
      <div
        className="absolute rounded-full opacity-90"
        style={{
          left: `${x}%`,
          top: y,
          width: 90,
          height: kind === "car" ? 38 : 52,
          background: color,
          borderRadius: kind === "leaf" ? "50% 12px 50% 12px" : 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          transition: "left 250ms linear",
        }}
      />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-white/70">
        passerar
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. VerticalMeter — fyll/töm. Drivs av hela övningens progress.
// ─────────────────────────────────────────────────────────────
function VerticalMeter({ progress = 0, phase = "", direction = "down" as "down" | "up", label }: Props & { direction?: "down" | "up"; label?: string }) {
  const p = clamp01(progress);
  const h = direction === "down" ? 1 - p : p; // down = töms (sand, candle, ember)
  // phase-overrides för volume: dra ner ett snäpp
  const isLower = /sänk|ner|mjuk|släpp|svaln/.test(phase.toLowerCase());
  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative overflow-hidden rounded-3xl border border-white/30" style={{ width: 90, height: 240 }}>
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-200/90 to-amber-100/70"
          style={{ height: `${h * 100}%`, transition: "height 400ms linear" }}
        />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/75">
        {label ?? (isLower ? "sänker" : direction === "down" ? "rinner ut" : "fylls")}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. AnchorDrop — tyngd sjunker stadigt över hela övningen.
// ─────────────────────────────────────────────────────────────
function AnchorDrop({ progress = 0 }: Props) {
  const p = clamp01(progress);
  const y = lerp(20, 240, p);
  return (
    <div className="relative" style={{ width: 220, height: 300 }}>
      <div className="absolute inset-x-0 top-0 mx-auto h-px bg-white/40" style={{ width: 180 }} />
      <div className="absolute inset-x-0 bottom-0 mx-auto h-2 rounded-full bg-white/20" style={{ width: 200 }} />
      {/* lina */}
      <div
        className="absolute left-1/2 top-0 w-px bg-white/50"
        style={{ height: y, transition: "height 400ms linear" }}
      />
      {/* ankaret */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-2xl bg-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
        style={{
          top: y,
          width: 48, height: 48,
          transition: "top 400ms linear",
        }}
      />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-white/70">
        sjunker
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Stoplight — tre prickar, aktiv lyser, andra dimmas.
// ─────────────────────────────────────────────────────────────
function Stoplight({ phase = "", stepIndex = 0 }: Props) {
  const p = phase.toLowerCase();
  const i =
    /röd|stanna|stopp/.test(p) ? 0 :
    /gul|märk|vad känns|under|rädd/.test(p) ? 1 :
    /grön|välj|nästa|gå|svara/.test(p) ? 2 :
    stepIndex % 3;
  const colors = ["#ef4444", "#fbbf24", "#34d399"];
  const labels = ["stanna", "märk", "välj"];
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col gap-3 rounded-3xl bg-black/20 p-4">
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className="h-16 w-16 rounded-full"
            style={{
              background: colors[k],
              opacity: k === i ? 1 : 0.18,
              boxShadow: k === i ? `0 0 36px 8px ${colors[k]}` : "none",
              transition: "opacity 250ms linear, box-shadow 250ms linear",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-white/85">{labels[i]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. LetterDrop — kuvert glider ner i låda per steg.
// ─────────────────────────────────────────────────────────────
function LetterDrop({ stepIndex = 0, stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  const y = lerp(-10, 110, t);
  const fallen = stepIndex;
  return (
    <div className="relative" style={{ width: 240, height: 260 }}>
      {/* lådan */}
      <div className="absolute inset-x-6 bottom-4 rounded-2xl border-2 border-white/50 bg-black/15" style={{ height: 110 }}>
        <div className="absolute inset-x-6 top-3 h-1.5 rounded-full bg-white/40" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-white/80">
          sen / imorgon
        </span>
        {/* räknare */}
        <span className="absolute right-3 top-2 text-xs font-extrabold text-white/85">×{fallen}</span>
      </div>
      {/* fallande lapp */}
      <div
        className="absolute left-1/2 h-14 w-20 -translate-x-1/2 rounded-md bg-yellow-100 shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
        style={{ top: y, transition: "top 350ms linear" }}
      >
        <div className="mx-2 mt-2 h-1 rounded bg-black/20" />
        <div className="mx-2 mt-1 h-1 rounded bg-black/15 w-3/4" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. SoftHeart — mjukt pulserande hjärta.
// ─────────────────────────────────────────────────────────────
function SoftHeart({ stepProgress = 0, stepIndex = 0 }: Props) {
  const t = clamp01(stepProgress);
  // Två slag per steg
  const beat = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(t * Math.PI * 4));
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 240 }}>
      <svg viewBox="0 0 100 100" className="h-48 w-48" style={{ transform: `scale(${beat})`, transition: "transform 120ms linear" }}>
        <path
          d="M50 86 C 20 64, 8 44, 22 28 C 32 18, 44 22, 50 34 C 56 22, 68 18, 78 28 C 92 44, 80 64, 50 86 Z"
          fill="rgba(254,202,202,0.92)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
        />
      </svg>
      <span className="absolute bottom-0 text-[10px] font-bold uppercase tracking-widest text-white/80">
        slag {stepIndex + 1}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. OpeningHand — handflata öppnas/sluts kontinuerligt.
// ─────────────────────────────────────────────────────────────
function OpeningHand({ stepProgress = 0 }: Props) {
  const t = clamp01(stepProgress);
  // Fingrarnas spread: 0 = knuten, 1 = öppen
  const spread = t;
  return (
    <div className="relative grid place-items-center" style={{ width: 240, height: 240 }}>
      <svg viewBox="0 0 120 140" className="h-52 w-auto">
        {/* handflata */}
        <ellipse cx="60" cy="100" rx="32" ry="26" fill="rgba(254,215,170,0.85)" />
        {/* fingrar — vinklar öppnas mjukt */}
        {[-30, -12, 4, 22].map((base, i) => {
          const angle = base * (0.3 + 0.7 * spread);
          return (
            <rect
              key={i}
              x="56" y="32"
              width="8" height="56"
              rx="4"
              fill="rgba(254,215,170,0.9)"
              transform={`rotate(${angle} 60 90)`}
              style={{ transition: "transform 300ms linear" }}
            />
          );
        })}
        {/* tumme */}
        <rect
          x="56" y="70"
          width="8" height="40" rx="4"
          fill="rgba(254,215,170,0.9)"
          transform={`rotate(${-60 - 20 * spread} 60 100)`}
          style={{ transition: "transform 300ms linear" }}
        />
      </svg>
      <span className="absolute bottom-0 text-[10px] font-bold uppercase tracking-widest text-white/80">
        öppnar
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Router — mappar varje AnimationKind till en primitiv.
// ─────────────────────────────────────────────────────────────
export function AnimationFor(props: { kind: AnimationKind } & Props) {
  const { kind, ...rest } = props;
  switch (kind) {
    // andning
    case "breath-orb":
    case "breath-wave":
    case "breath-blob":
    case "belly-hand":
    case "spiral":
    case "orbit":
    case "pulse":
    case "pendulum":
    case "sleep-waves":
      return <BreathOrb {...rest} />;

    case "box-path":
    case "box-breath":
      return <BoxPath {...rest} />;

    // kropp
    case "body-figure":
    case "body-scan":
    case "warm-beam":
    case "jaw-release":
    case "shoulder-drop":
    case "footprints":
    case "stretch-up":
    case "warm-hand":
      return <BodyFigure {...rest} />;

    // tankar passerar
    case "drifter":
    case "passing-traffic":
      return <Drifter {...rest} kind="car" />;
    case "drifting-clouds":
      return <Drifter {...rest} kind="cloud" />;
    case "drifting-leaves":
      return <Drifter {...rest} kind="leaf" />;
    case "passing-thoughts":
      return <Drifter {...rest} kind="thought" />;

    // meter / tid
    case "vertical-meter":
    case "sand-clock":
    case "candle":
    case "ember":
      return <VerticalMeter {...rest} direction="down" label="rinner" />;
    case "battery-fill":
    case "morning-sun":
    case "horizon":
      return <VerticalMeter {...rest} direction="up" label="fylls" />;
    case "volume-slider":
      return <VerticalMeter {...rest} direction="down" label="volym ner" />;

    // tyngd / ankar
    case "anchor-drop":
    case "anchor":
    case "anchor-drop-alias":
    case "lifting-stone":
    case "pebbles":
      return <AnchorDrop {...rest} />;

    // val / signal
    case "stoplight":
    case "traffic-light":
    case "path-fork":
      return <Stoplight {...rest} />;

    // lägg undan / sortera
    case "letter-drop":
    case "mailbox":
    case "note-to-self":
    case "closing-tabs":
    case "inbox-priority":
    case "dropping-bags":
    case "sorting-shelf":
    case "closing-laptop":
    case "typing-cursor":
      return <LetterDrop {...rest} />;

    // hjärta / kompassion
    case "soft-heart":
    case "compassion-heart":
    case "inner-voice":
    case "unknotting":
    case "deflate":
    case "release-balloon":
    case "measuring-tape":
    case "constellation":
    case "focus-lens":
    case "walking-path":
    case "first-step":
    case "doorway":
    case "steering-wheel":
      return <SoftHeart {...rest} />;

    case "opening-hand":
      return <OpeningHand {...rest} />;

    default:
      return <BreathOrb {...rest} />;
  }
}
