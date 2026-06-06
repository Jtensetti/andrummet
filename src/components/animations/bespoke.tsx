/**
 * Bespoke övnings-animationer.
 * En komponent per pilot-övning. Allt drivs av en kontinuerlig
 * t = (stepIndex + stepProgress) / stepCount, så loopen flyter
 * mellan stegen utan abrupt reset.
 *
 * Bara platta SVG-fyllningar, ingen gradient/skugga/blur.
 *   var(--anim-accent) = aktiv form
 *   var(--anim-soft)   = sekundär/bakgrund
 *   currentColor       = neutralt streck
 */

import { useEffect, useRef, useState, type ReactElement } from "react";

const ACCENT = "var(--anim-accent, currentColor)";
const SOFT = "var(--anim-soft, currentColor)";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
const easeInOut = (u: number) => 0.5 - Math.cos(Math.PI * clamp01(u)) / 2;

export type BespokeProps = {
  stepIndex?: number;
  stepCount?: number;
  stepProgress?: number;
  phase?: string;
};

/** Kontinuerlig progress 0..1 över hela övningen. */
function totalT(p: BespokeProps) {
  const sc = Math.max(1, p.stepCount ?? 1);
  return clamp01(((p.stepIndex ?? 0) + clamp01(p.stepProgress ?? 0)) / sc);
}

/** En liten "andetag"-puls — kontinuerlig sinus oberoende av steg. */
function useBreathPulse(periodMs = 5000) {
  const [v, setV] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  useEffect(() => {
    const loop = (now: number) => {
      if (start.current === null) start.current = now;
      const t = ((now - start.current) % periodMs) / periodMs;
      setV(0.5 - Math.cos(t * Math.PI * 2) / 2);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [periodMs]);
  return v; // 0..1..0
}

/** Monotont stigande tid i sekunder sedan komponentens mount. */
function useTimeSec() {
  const [t, setT] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  useEffect(() => {
    const loop = (now: number) => {
      if (start.current === null) start.current = now;
      setT((now - start.current) / 1000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);
  return t;
}

// ─── 1. Stäng 47 mentala flikar ──────────────────────────────
// 6 steg, mappade exakt mot scriptet:
//  0 "Vad tar plats?"          → 9 brickor svävar/jittrar uppe (rörigt)
//  1 "Välj tre tyst"           → 3 brickor lyfter fram, resten dimmas
//  2 "Lägg den första i lådan" → bricka 1 glider ner i lådan
//  3 "Den andra"               → bricka 2 glider ner
//  4 "Den tredje"              → bricka 3 glider ner
//  5 "Andas ut längre än in"   → bara lådan, lugn andnings-puls
function CloseTabs(p: BespokeProps) {
  const W = 260;
  const H = 280;
  const boxW = 180;
  const boxH = 40;
  const boxX = (W - boxW) / 2;
  const boxY = H - boxH - 18;

  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5200);

  // 9 brickor, 3 av dem (index 1, 4, 7) är de utvalda
  const total = 9;
  const chosen = [1, 4, 7];
  const cols = 3;
  const tabW = 56;
  const tabH = 18;
  const colGap = 12;
  const rowGap = 14;
  const gridW = cols * tabW + (cols - 1) * colGap;
  const gridX = (W - gridW) / 2;
  const gridY = 26;

  // Deterministisk jitter per bricka
  const jitter = (i: number, k: number) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v); // 0..1
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-64" aria-hidden>
      {/* Lådan — alltid synlig, pulserar mjukt i steg 5 */}
      <rect
        x={boxX - 6}
        y={boxY - 4}
        width={boxW + 12}
        height={boxH + 14}
        rx={12}
        fill={SOFT}
        fillOpacity={0.4 + (stepIdx >= 5 ? breathe * 0.2 : 0)}
      />
      {/* Lådans öppningslinje */}
      <line
        x1={boxX - 4}
        x2={boxX + boxW + 4}
        y1={boxY + 2}
        y2={boxY + 2}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
      />

      {Array.from({ length: total }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const baseX = gridX + col * (tabW + colGap);
        const baseY = gridY + row * (tabH + rowGap);
        const isChosen = chosen.includes(i);
        const chosenOrder = chosen.indexOf(i); // 0,1,2 → drop-steg 2,3,4

        // Jitter (rörigt) i steg 0, klingar av efteråt
        const jitterAmount = stepIdx === 0 ? 1 : stepIdx === 1 ? 0.3 : 0;
        const jx = (jitter(i, 1) - 0.5) * 8 * jitterAmount * (0.5 + breathe);
        const jy = (jitter(i, 2) - 0.5) * 6 * jitterAmount * (0.5 + breathe);

        // Steg 1: utvalda lyfter fram (lite uppåt + opacitet upp), andra dimmas
        let liftY = 0;
        let dim = 1;
        if (stepIdx >= 1) {
          if (isChosen) {
            liftY = stepIdx === 1 ? -4 * easeInOut(sp) : -4;
          } else {
            const fade = stepIdx === 1 ? easeInOut(sp) : 1;
            dim = lerp(1, 0.25, fade);
          }
        }

        // Drop: vilket steg släpps just denna bricka i lådan?
        let fall = 0;
        if (isChosen) {
          const dropStep = 2 + chosenOrder; // 2, 3, 4
          if (stepIdx > dropStep) fall = 1;
          else if (stepIdx === dropStep) fall = easeInOut(sp);
        }

        // Steg 5: alla brickor borta (utvalda i lådan, andra fadat helt)
        if (stepIdx >= 5 && !isChosen) dim = 0;

        // Mål för en fallande bricka: in i lådan, lite sidoförskjutning per ordning
        const restX = boxX + 12 + chosenOrder * ((boxW - 24 - tabW) / 2);
        const restY = boxY + (boxH - tabH) / 2;

        const x = lerp(baseX + jx, restX, fall);
        const y = lerp(baseY + jy + liftY, restY, fall);

        const fill = isChosen ? ACCENT : SOFT;
        const op = lerp(0.85, 0, 1 - dim) * (fall > 0.95 ? 0.9 : 1);

        if (op < 0.02) return null;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={tabW}
            height={tabH}
            rx={5}
            fill={fill}
            fillOpacity={isChosen ? lerp(0.95, 0.7, fall) : op}
          />
        );
      })}

      {/* Andnings-prick i lådan i steg 5 */}
      {stepIdx >= 5 && (
        <circle
          cx={W / 2}
          cy={boxY + boxH / 2 + 14}
          r={4 + breathe * 6}
          fill={ACCENT}
          fillOpacity={0.6 + breathe * 0.3}
        />
      )}
    </svg>
  );
}

// ─── 2. Ångesten får inte köra bilen ────────────────────────
// Förstaperson: vy ut genom framrutan. Vägen rör sig MOT användaren
// i centralperspektiv. Ratten sitter i botten, händer på 10 och 2.
// Föraren håller kursen.
//  0 "Du sitter vid ratten"      → ratt + händer + lugn väg
//  1 "Känn ratten"               → händerna på ratten
//  2 "Vägen är öppen"            → vägen fortsätter framåt
//  3 "Du kör ändå"               → vägen fortsätter framåt
//  4 "Vart vill du köra?"        → vägskylt/pil dyker upp på horisonten
//  5 "En liten handling"         → en liten ljuspunkt längre fram på vägen
function NotDriving(p: BespokeProps) {
  const W = 320;
  const H = 240;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const pulse = useBreathPulse(4200);
  const time = useTimeSec();

  // Vy: horisont i mitten, dashboard nedtill
  const horizonY = H * 0.42;
  const dashTop = H - 56;

  // Vägens kanter konvergerar mot horisonten (vanishing point)
  const vpX = W / 2;
  const roadLeftNear = W * 0.05;
  const roadRightNear = W * 0.95;

  // Hastighet: lugn från start, ökar något efter steg 0
  const speed = stepIdx === 0 ? 0.18 : 0.28;
  const tNorm = (time * speed) % 1;

  // 6 stripes som glider från horisont mot tittaren. Varje stripe har
  // en fas u i [0..1) där u=0 är vid horisonten, u=1 är vid betraktaren.
  const N = 6;
  const stripes = Array.from({ length: N }, (_, i) => {
    const u = (tNorm + i / N) % 1;
    const persp = u * u; // accelererar mot tittaren = känsla av fart
    const y = lerp(horizonY, dashTop, persp);
    const w = lerp(2, 14, persp);
    const h = lerp(3, 18, persp);
    const op = lerp(0.25, 0.7, persp);
    return { y, w, h, op, key: i };
  });

  // Riktnings-pil i steg 4+
  const arrowOp = stepIdx === 4 ? easeInOut(sp) : stepIdx > 4 ? 1 : 0;

  // Liten handling — ljuspunkt på vägen i steg 5
  const emberOp = stepIdx === 5 ? easeInOut(sp) : 0;
  const emberPersp = 0.55; // halvvägs mellan horisont och tittaren
  const emberY = lerp(horizonY, dashTop, emberPersp);

  // Ratt — sitter halvt under dashboard, vi ser övre bågen
  const wheelCx = W * 0.42;
  const wheelCy = H + 24;
  const wheelR = 92;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-[20rem]" aria-hidden>
      {/* Himmel — mjukt soft fält ovan horisonten */}
      <rect x={0} y={0} width={W} height={horizonY} fill={SOFT} fillOpacity={0.25} />
      {/* Horisontlinje */}
      <line x1={0} x2={W} y1={horizonY} y2={horizonY} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5} />

      {/* Vägens fyllning — triangel mellan horisont och dashboard */}
      <path
        d={`M ${vpX} ${horizonY} L ${roadLeftNear} ${dashTop} L ${roadRightNear} ${dashTop} Z`}
        fill={SOFT}
        fillOpacity={0.18}
      />
      {/* Vägkanter */}
      <line x1={vpX} x2={roadLeftNear} y1={horizonY} y2={dashTop} stroke={SOFT} strokeOpacity={0.55} strokeWidth={2} />
      <line x1={vpX} x2={roadRightNear} y1={horizonY} y2={dashTop} stroke={SOFT} strokeOpacity={0.55} strokeWidth={2} />

      {/* Mittlinjer som rör sig mot tittaren */}
      {stripes.map((s) => (
        <rect
          key={s.key}
          x={vpX - s.w / 2}
          y={s.y - s.h / 2}
          width={s.w}
          height={s.h}
          rx={s.w / 2}
          fill={SOFT}
          fillOpacity={s.op}
        />
      ))}

      {/* Vägskylt/pil på horisonten */}
      {arrowOp > 0.02 && (
        <g opacity={arrowOp} stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={vpX} x2={vpX} y1={horizonY - 18} y2={horizonY - 4} />
          <polyline points={`${vpX - 6},${horizonY - 12} ${vpX},${horizonY - 18} ${vpX + 6},${horizonY - 12}`} />
        </g>
      )}

      {/* Liten ljuspunkt längre fram på vägen */}
      {emberOp > 0.02 && (
        <circle
          cx={vpX}
          cy={emberY}
          r={4 + pulse * 1.5}
          fill={ACCENT}
          fillOpacity={0.9 * emberOp}
        />
      )}

      {/* Dashboard */}
      <rect x={0} y={dashTop} width={W} height={H - dashTop} fill={SOFT} fillOpacity={0.7} />
      <line x1={0} x2={W} y1={dashTop} y2={dashTop} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />

      {/* Ratten — stor båge i botten, händer på 10 och 2 */}
      <circle
        cx={wheelCx}
        cy={wheelCy}
        r={wheelR}
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.7}
        strokeWidth={4}
      />
      {/* Inre stadga */}
      <circle
        cx={wheelCx}
        cy={wheelCy}
        r={wheelR - 14}
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      {/* Händer — 10 och 2 (vinklar mätt från positiv x-axel uppåt) */}
      {[
        { ang: Math.PI * 1.25 }, // 10
        { ang: Math.PI * 1.75 }, // 2
      ].map((h, i) => {
        const hx = wheelCx + Math.cos(h.ang) * (wheelR - 2);
        const hy = wheelCy + Math.sin(h.ang) * (wheelR - 2);
        return (
          <circle
            key={i}
            cx={hx}
            cy={hy}
            r={9}
            fill={ACCENT}
            fillOpacity={0.95}
          />
        );
      })}
    </svg>
  );
}

// ─── 3. Reset — sänk tempot ─────────────────────────────────
// 6 steg, mappade mot kroppsdelar + medvetenhet:
//  0 "Släpp axlarna"            → övre stapel (axlar) sjunker
//  1 "Mjuka käken"              → mellan-stapel (käke) sjunker
//  2 "Andas ut genom munnen"    → nedre stapel (andetag) sjunker
//  3 "Lägg märke till kroppen"  → medvetenhets-band sveper neråt över staplarna
//  4 "Lägg märke till tankarna" → bandet sveper uppåt mot huvudet
//  5 "Kom tillbaka hit"         → bandet landar i mitten och pulserar lugnt
function ResetBars(p: BespokeProps) {
  const W = 260;
  const H = 280;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5000);

  // Tre staplar: axlar (topp), käke (mitt), andetag (botten)
  const bars = 3;
  const barW = 48;
  const gap = 20;
  const groupW = bars * barW + (bars - 1) * gap;
  const startX = (W - groupW) / 2;
  const baselineY = H - 28;
  const fullH = 200;
  const minH = 36;

  // Hur mycket varje stapel har "sjunkit" (0..1)
  const drop = (i: number) => {
    if (stepIdx > i) return 1;
    if (stepIdx === i) return easeInOut(sp);
    return 0;
  };

  // Medvetenhets-bandets vertikala position (0 = topp, 1 = botten)
  // 3 = sveper topp→botten, 4 = botten→topp, 5 = mitten + puls
  let bandY: number | null = null;
  let bandOp = 0;
  if (stepIdx === 3) {
    bandY = lerp(40, baselineY - 20, easeInOut(sp));
    bandOp = 1;
  } else if (stepIdx === 4) {
    bandY = lerp(baselineY - 20, 40, easeInOut(sp));
    bandOp = 1;
  } else if (stepIdx >= 5) {
    bandY = (40 + baselineY - 20) / 2 + Math.sin(breathe * Math.PI * 2) * 6;
    bandOp = 0.85;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-64" aria-hidden>
      {/* Marklinje */}
      <line
        x1={20}
        x2={W - 20}
        y1={baselineY}
        y2={baselineY}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={2}
      />

      {Array.from({ length: bars }, (_, i) => {
        const d = drop(i);
        const h = lerp(fullH, minH, d);
        const x = startX + i * (barW + gap);
        const y = baselineY - h;
        return (
          <g key={i}>
            {/* "Spöke" som visar ursprunglig höjd */}
            <rect
              x={x}
              y={baselineY - fullH}
              width={barW}
              height={fullH}
              rx={12}
              fill={SOFT}
              fillOpacity={0.22}
            />
            {/* Faktisk stapel */}
            <rect x={x} y={y} width={barW} height={h} rx={12} fill={ACCENT} />
          </g>
        );
      })}

      {/* Medvetenhets-band */}
      {bandY !== null && (
        <g opacity={bandOp}>
          <line
            x1={startX - 14}
            x2={startX + groupW + 14}
            y1={bandY}
            y2={bandY}
            stroke={ACCENT}
            strokeOpacity={0.5}
            strokeWidth={2}
          />
          <circle
            cx={W / 2}
            cy={bandY}
            r={stepIdx >= 5 ? 10 + breathe * 4 : 8}
            fill={ACCENT}
          />
        </g>
      )}
    </svg>
  );
}

// ─── 4. Fokuslinsen — sprid → välj → mitten → kanter → andas
// 5 steg (script):
//  0 "Lägg märke till spritheten"   → ~14 prickar utspridda, jittriga, inget centrum
//  1 "Välj ett ord eller en uppgift" → en utvald prick fram-poppas, andra dimmas
//  2 "Låt det vara mitten"           → den utvalda glider till centrum, blir lins
//  3 "Resten i kanten"               → övriga glider ut till ringkant och stannar svaga
//  4 "Andas in mot mitten"           → kant-prickarna andas in/ut mot mitten, linsen pulserar
function FocusLens(p: BespokeProps) {
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5200);
  const R = 110;
  const n = 14;
  const chosenIdx = 3;

  // Deterministisk "spridd" startposition per prick
  const seedPos = (i: number) => {
    const a = (i / n) * Math.PI * 2 + (Math.sin(i * 12.9898) % 1) * 1.2;
    const noise = Math.abs((Math.sin(i * 78.233) * 43758.5453) % 1);
    const rr = R * (0.42 + 0.5 * noise);
    return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, a };
  };

  const jitterAmp =
    stepIdx === 0 ? 7
    : stepIdx === 1 ? lerp(7, 2, easeInOut(sp))
    : 1.5;

  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={0.3} />
      <circle
        cx={0}
        cy={0}
        r={R}
        fill="none"
        stroke="currentColor"
        strokeOpacity={stepIdx >= 3 ? 0.35 : 0.12}
        strokeWidth={2}
      />

      {Array.from({ length: n }, (_, i) => {
        const base = seedPos(i);
        const isChosen = i === chosenIdx;
        const jx = Math.sin(breathe * Math.PI * 2 + i) * jitterAmp;
        const jy = Math.cos(breathe * Math.PI * 2 + i * 1.3) * jitterAmp;
        const edgeX = Math.cos(base.a) * (R - 6);
        const edgeY = Math.sin(base.a) * (R - 6);

        if (isChosen) {
          const toCenter =
            stepIdx < 2 ? 0
            : stepIdx === 2 ? easeInOut(sp)
            : 1;
          const grow = stepIdx >= 1 ? (stepIdx === 1 ? easeInOut(sp) : 1) : 0;
          const lens = stepIdx >= 2 ? (stepIdx === 2 ? easeInOut(sp) : 1) : 0;
          const cx = lerp(base.x + jx * 0.3, 0, toCenter);
          const cy = lerp(base.y + jy * 0.3, 0, toCenter);
          let r = lerp(6, 10, grow);
          r = lerp(r, 22 + breathe * 4, lens);
          return <circle key={i} cx={cx} cy={cy} r={r} fill={ACCENT} fillOpacity={1} />;
        }

        const toEdge =
          stepIdx < 3 ? 0
          : stepIdx === 3 ? easeInOut(sp)
          : 1;
        const breath = stepIdx >= 4 ? Math.sin(breathe * Math.PI * 2) * 10 : 0;
        const ax = Math.cos(base.a) * breath;
        const ay = Math.sin(base.a) * breath;
        const cx = lerp(base.x + jx, edgeX - ax, toEdge);
        const cy = lerp(base.y + jy, edgeY - ay, toEdge);
        const dim =
          stepIdx === 0 ? 0
          : stepIdx === 1 ? easeInOut(sp)
          : 1;
        return <circle key={i} cx={cx} cy={cy} r={6} fill={SOFT} fillOpacity={lerp(0.75, 0.3, dim)} />;
      })}
    </svg>
  );
}

// ─── 5. Sov mjukare — en natt passerar ─────────────────────
// 8 steg (script): 0 sänk tempot, 1 panna, 2 käke, 3 axlar,
// 4 bröstkorg, 5 mage, 6 ben, 7 fötter.
// Visual: halvmåne stiger från vänster horisont, går i en mjuk båge
// över himlen och sjunker ner vid höger horisont. Himlen skiftar
// från skymning → djupblå natt → tidig gryning. Stjärnor tonar in
// kring månens högsta punkt. Driver av övningens totala progress.
function SoftSleep(p: BespokeProps) {
  const t = totalT(p);
  const pulse = useBreathPulse(6500);
  const W = 320;
  const H = 220;

  const horizonY = H * 0.62;

  // Månens bana: vänster horisont (t=0) → topp (t=0.5) → höger horisont (t=1)
  const moonX = lerp(W * 0.06, W * 0.94, t);
  const arc = Math.sin(Math.PI * t); // 0..1..0
  const moonCy = horizonY - arc * (horizonY - 28);
  const moonR = 18 + pulse * 1.2;

  // Nattens djup: 0 vid kanter, 1 vid mitten
  const night = arc;

  // Stjärnor — fasta positioner, opacity följer night
  const stars = [
    { x: 0.12, y: 0.18, r: 1.4 },
    { x: 0.22, y: 0.08, r: 1.1 },
    { x: 0.34, y: 0.22, r: 1.6 },
    { x: 0.42, y: 0.12, r: 1.2 },
    { x: 0.55, y: 0.06, r: 1.4 },
    { x: 0.62, y: 0.24, r: 1.1 },
    { x: 0.70, y: 0.16, r: 1.5 },
    { x: 0.82, y: 0.10, r: 1.3 },
    { x: 0.88, y: 0.26, r: 1.1 },
    { x: 0.95, y: 0.14, r: 1.4 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-[20rem]" aria-hidden>
      {/* Himmel — ljus bas */}
      <rect x={0} y={0} width={W} height={horizonY} fill={SOFT} fillOpacity={0.35} />
      {/* Mörk overlay för natt — toppas vid t=0.5 */}
      <rect
        x={0}
        y={0}
        width={W}
        height={horizonY}
        fill="currentColor"
        fillOpacity={night * 0.28}
      />

      {/* Stjärnor */}
      {stars.map((s, i) => {
        // Subtil twinkle med olika fas
        const tw = 0.6 + 0.4 * (0.5 + Math.sin(pulse * Math.PI * 2 + i) / 2);
        return (
          <circle
            key={i}
            cx={s.x * W}
            cy={s.y * horizonY}
            r={s.r}
            fill={ACCENT}
            fillOpacity={night * tw * 0.9}
          />
        );
      })}

      {/* Mark */}
      <rect x={0} y={horizonY} width={W} height={H - horizonY} fill={SOFT} fillOpacity={0.6} />
      {/* Horisontlinje */}
      <line x1={0} x2={W} y1={horizonY} y2={horizonY} stroke="currentColor" strokeOpacity={0.22} strokeWidth={1.5} />

      {/* Halvmåne — en cirkel + en överlappande mark-färgad cirkel för "halv" */}
      <g>
        <circle cx={moonX} cy={moonCy} r={moonR} fill={ACCENT} fillOpacity={0.92} />
        {/* Mjuk skugga som gör månen halv — förskjuten åt rörelseriktningen */}
        <circle
          cx={moonX + (t < 0.5 ? -moonR * 0.35 : moonR * 0.35)}
          cy={moonCy - moonR * 0.15}
          r={moonR * 0.95}
          fill={SOFT}
          fillOpacity={0.55}
        />
      </g>
    </svg>
  );
}

// ─── 6. Kroppsskanning — strålkastare vandrar, zoner lyser upp
// 7 steg (script): panna, käke, hals/axlar, bröstkorg, mage,
// höfter/ben, fötter. Inget "släpps" — bara märks. Visualt:
// band glider mjukt till zonens mitt och stannar tills nästa steg
// börjar, då glider det vidare. Zoner som redan skannats förblir
// markerade i bakgrunden.
function BodyScan(p: BespokeProps) {
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const sc = Math.max(1, p.stepCount ?? 7);
  const breathe = useBreathPulse(5200);

  const W = 160;
  const H = 300;
  const padTop = 18;
  const padBot = 18;
  const innerH = H - padTop - padBot;
  const zoneH = innerH / sc;
  const bodyX = 36;
  const bodyW = W - 72;

  // Bandet glider mjukt mellan zoner. Vi mappar:
  //   bandCenter (i zon-index) = stepIdx + ease(sp) under övergång,
  //   men HOLDAR i zonens mitt under merparten av steget och
  //   glider mot nästa zons mitt nära slutet (de sista 25%).
  // Det ger "ankommen → vila → glida vidare" istället för konstant rörelse.
  const holdEnd = 0.75;
  let bandPos: number;
  if (sp < holdEnd) {
    bandPos = stepIdx + 0.5;
  } else {
    const u = (sp - holdEnd) / (1 - holdEnd);
    bandPos = lerp(stepIdx + 0.5, stepIdx + 1.5, easeInOut(u));
  }
  const bandY = padTop + bandPos * zoneH - zoneH / 2;
  const bandH = zoneH * 0.95;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-40" aria-hidden>
      {/* Kropp — outline */}
      <rect
        x={bodyX}
        y={padTop}
        width={bodyW}
        height={innerH}
        rx={bodyW / 2}
        fill={SOFT}
        fillOpacity={0.35}
      />


      {/* Zon-skiljelinjer */}
      {Array.from({ length: sc + 1 }, (_, i) => {
        const y = padTop + i * zoneH;
        return (
          <line
            key={`line-${i}`}
            x1={bodyX - 8}
            x2={bodyX}
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={2}
          />
        );
      })}

      {/* Aktivt skannings-band — glider mjukt mellan zonernas mitt */}
      <rect
        x={bodyX - 6}
        y={bandY}
        width={bodyW + 12}
        height={bandH}
        rx={bandH / 2}
        fill={ACCENT}
        fillOpacity={0.9}
      />
      {/* Andnings-prick på bandet */}
      <circle
        cx={W / 2}
        cy={bandY + bandH / 2}
        r={4 + breathe * 3}
        fill={SOFT}
        fillOpacity={0.8}
      />
    </svg>
  );
}

// ─── 7. Vad behöver jag just nu — lyssna nedåt ─────────────
// Lugn central cirkel = du. Vertikal axel: huvud uppe, mage nere.
//  0 "Vad dyker upp först?"             → tankar-prickar bubblar upp ur huvudet
//  1 "Behov eller borde?"               → fält delas: borde (uppe, fyrkant) / behov (nere, runda)
//  2 "Vad skulle faktiskt hjälpa?"      → en rund behov-prick lyser upp och sjunker mot magen
//  3 "Gör det litet"                    → kärnan krymper till liten tydlig punkt
//  4 "Kan du ge dig det?"               → två händer (bågar) sluter sig om kärnan, andas
function NeedDrop(p: BespokeProps) {
  const W = 260;
  const H = 320;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5400);

  const cx = W / 2;
  const headY = H * 0.22;
  const bellyY = H * 0.72;
  const youCy = H * 0.5;
  const youR = 46;

  // Steg 2: en behov-prick lyser upp och sjunker från behov-fältet till magen
  const dropY = stepIdx >= 2 ? lerp(youCy + 6, bellyY, easeInOut(stepIdx === 2 ? sp : 1)) : youCy;
  const dropR =
    stepIdx === 2 ? lerp(5, 9, easeInOut(sp))
    : stepIdx === 3 ? lerp(9, 5, easeInOut(sp))
    : stepIdx >= 4 ? 5 + breathe * 1.4
    : 0;

  // Borde/Behov-fältens opacity
  const sortOp =
    stepIdx === 0 ? 0
    : stepIdx === 1 ? easeInOut(sp)
    : stepIdx === 2 ? lerp(1, 0.25, easeInOut(sp))
    : 0.2;

  // Steg 4: händer som sluter sig om kärnan, andas med pulsen
  const handsOp = stepIdx === 4 ? easeInOut(sp) : 0;
  const handGap = stepIdx === 4 ? lerp(50, 24, easeInOut(sp)) + breathe * 2 : 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-[17rem]" aria-hidden>
      {/* Vertikal axel — diskret */}
      <line
        x1={cx}
        x2={cx}
        y1={headY - 22}
        y2={bellyY + 22}
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeWidth={1.5}
      />

      {/* Borde-fält (uppe) — fyrkantiga små prickar */}
      {sortOp > 0.02 && (
        <g opacity={sortOp}>
          <rect
            x={20}
            y={headY - 26}
            width={W - 40}
            height={48}
            rx={10}
            fill={SOFT}
            fillOpacity={0.32}
          />
          {Array.from({ length: 4 }, (_, i) => (
            <rect
              key={i}
              x={cx - 38 + i * 22}
              y={headY - 6}
              width={10}
              height={10}
              fill={SOFT}
              fillOpacity={0.85}
            />
          ))}
        </g>
      )}

      {/* Behov-fält (nere) — runda prickar */}
      {sortOp > 0.02 && (
        <g opacity={sortOp}>
          <rect
            x={20}
            y={bellyY - 22}
            width={W - 40}
            height={48}
            rx={10}
            fill={ACCENT}
            fillOpacity={0.18}
          />
          {Array.from({ length: 4 }, (_, i) => (
            <circle
              key={i}
              cx={cx - 33 + i * 22}
              cy={bellyY + 6}
              r={5}
              fill={ACCENT}
              fillOpacity={0.7}
            />
          ))}
        </g>
      )}

      {/* "Du" — lugn central cirkel */}
      <circle
        cx={cx}
        cy={youCy}
        r={youR}
        fill={SOFT}
        fillOpacity={0.5}
      />
      <circle
        cx={cx}
        cy={youCy}
        r={youR}
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.4}
        strokeWidth={2}
      />

      {/* Steg 0: tankar-prickar bubblar upp ur huvudet */}
      {stepIdx === 0 &&
        Array.from({ length: 8 }, (_, i) => {
          const phase = (breathe + i / 8) % 1;
          const a = (i / 8) * Math.PI * 2;
          const rise = phase; // 0 nedanför → 1 högre upp
          const x = cx + Math.cos(a) * (16 + rise * 28);
          const y = headY - rise * 36;
          const op = (1 - Math.abs(rise - 0.5) * 2) * 0.85;
          return (
            <circle key={i} cx={x} cy={y} r={3 + (1 - rise) * 1.5} fill={SOFT} fillOpacity={op} />
          );
        })}

      {/* Behov-droppen som sjunker (steg 2+) */}
      {dropR > 0.1 && (
        <circle cx={cx} cy={dropY} r={dropR} fill={ACCENT} fillOpacity={0.95} />
      )}

      {/* Steg 4: två händer (bågar) sluter sig om kärnan */}
      {handsOp > 0.02 && (
        <g opacity={handsOp} stroke={ACCENT} strokeWidth={3} fill="none" strokeLinecap="round">
          {/* Vänster hand — båge öppen åt höger */}
          <path
            d={`M ${cx - handGap} ${bellyY - 14} Q ${cx - handGap - 18} ${bellyY}, ${cx - handGap} ${bellyY + 14}`}
            strokeOpacity={0.85}
          />
          {/* Höger hand — båge öppen åt vänster */}
          <path
            d={`M ${cx + handGap} ${bellyY - 14} Q ${cx + handGap + 18} ${bellyY}, ${cx + handGap} ${bellyY + 14}`}
            strokeOpacity={0.85}
          />
        </g>
      )}
    </svg>
  );
}

// ─── 8. Tre vänliga meningar — meningar landar i bröstet ───
// 5 steg:
//  0 "Tänk på dig som en vän"   → "du"-cirkel + spegelbild av "vän" bredvid, mjuk linje emellan
//  1 "Säg en vänlig mening"     → mening 1 (rundad stapel) glider från sidan in i bröstet
//  2 "En till"                  → mening 2 glider in och staplas
//  3 "Och en sista"             → mening 3 glider in och staplas
//  4 "Låt det landa"            → alla tre meningarna pulserar tillsammans med andetag
function KindSentences(p: BespokeProps) {
  const W = 280;
  const H = 240;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5200);

  const youCx = W * 0.5;
  const youCy = H * 0.55;
  const youR = 62;

  // Vänlig "spegel" — en mindre cirkel som dyker upp i steg 0 och dröjer kvar svagt
  const friendCx = W * 0.82;
  const friendR = 28;
  const friendOp =
    stepIdx === 0 ? easeInOut(sp) * 0.7
    : 0.4;

  // Tre meningar — staplade i hjärtat (mitten av "du"-cirkeln)
  const slotH = 14;
  const slotW = 78;
  const slotGap = 6;
  const stackTop = youCy - ((3 * slotH + 2 * slotGap) / 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-72" aria-hidden>
      {/* "Vän"-spegel */}
      <circle cx={friendCx} cy={youCy - 18} r={friendR} fill={SOFT} fillOpacity={friendOp} />
      {/* Mjuk linje mellan vän och du — endast tydlig i steg 0 */}
      {stepIdx === 0 && (
        <line
          x1={youCx + youR + 6}
          x2={friendCx - friendR - 6}
          y1={youCy - 18}
          y2={youCy - 18}
          stroke={ACCENT}
          strokeOpacity={0.3 + easeInOut(sp) * 0.3}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}

      {/* "Du" — yttre cirkel */}
      <circle cx={youCx} cy={youCy} r={youR} fill={SOFT} fillOpacity={0.4} />
      {/* Hjärt-zon — pulserar lite i steg 4 */}
      <circle
        cx={youCx}
        cy={youCy}
        r={42 + (stepIdx >= 4 ? breathe * 3 : 0)}
        fill={SOFT}
        fillOpacity={0.55}
      />

      {/* Tre meningar */}
      {[0, 1, 2].map((i) => {
        // Mening i landar i steg i+1 (1, 2, 3)
        const arriveStep = i + 1;
        let visible = 0;
        let slideT = 0;
        if (stepIdx > arriveStep) {
          visible = 1;
          slideT = 1;
        } else if (stepIdx === arriveStep) {
          visible = easeInOut(sp);
          slideT = easeInOut(sp);
        }
        if (visible < 0.02) return null;

        const targetY = stackTop + i * (slotH + slotGap);
        // Kommer in från höger sida (där vännen står)
        const startX = friendCx;
        const targetX = youCx - slotW / 2;
        const x = lerp(startX, targetX, slideT);
        const y = lerp(youCy - slotH / 2, targetY, slideT);

        // I steg 4 pulserar alla tre med samma andetag
        const pulseOp = stepIdx >= 4 ? 0.85 + breathe * 0.15 : 0.9;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={slotW}
            height={slotH}
            rx={slotH / 2}
            fill={ACCENT}
            fillOpacity={pulseOp * visible}
          />
        );
      })}
    </svg>
  );
}

// ─── 9. Svalna innan svar — eld blir glöd ──────────────────
// 5 steg:
//  0 "Stanna här"             → 5 vassa lågor flackrar tall + jittrigt
//  1 "Andas ut längre"        → lågorna sjunker i takt med andetaget (ut = lägre)
//  2 "Var sitter elden?"      → mittlågan markeras (vart brinner det?)
//  3 "Flammor blir glöd"      → lågorna sjunker ner till rundade glödhögar
//  4 "Svara från glöden"      → en lugn glödcirkel pulserar i mitten
function FlamesToEmber(p: BespokeProps) {
  const W = 280;
  const H = 240;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5400);

  const baseY = H - 36;
  const flames = 5;
  const spacing = 38;
  const startX = (W - (flames - 1) * spacing) / 2;

  // Hur "släckta" lågorna är (0 vild eld, 1 glöd)
  const cool =
    stepIdx <= 1 ? 0
    : stepIdx === 2 ? 0.15
    : stepIdx === 3 ? easeInOut(sp)
    : 1;

  // Andnings-modulering: i steg 1 styr breath-pulsen höjden tydligt
  const breathMod = stepIdx === 1 ? 1 : stepIdx === 0 ? 0.4 : 0;

  // Jitter — vilt i 0, dämpas
  const jitterAmp = stepIdx === 0 ? 5 : stepIdx === 1 ? 2 : 0;

  // Höjd-bas per låga (mittlåga högst)
  const baseHeights = [70, 100, 130, 100, 70];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-72" aria-hidden>
      {/* Mark */}
      <line
        x1={20}
        x2={W - 20}
        y1={baseY}
        y2={baseY}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={2}
      />

      {stepIdx < 4 &&
        Array.from({ length: flames }, (_, i) => {
          const x = startX + i * spacing;
          // Lågans nuvarande höjd
          const breath = (1 - breathe) * breathMod * 18; // ut = mindre höjd
          const baseH = baseHeights[i] - breath;
          const h = lerp(baseH, 14, cool); // sjunker mot ember
          const halfW = lerp(13, 22, cool); // bredare när glöd
          const jx = Math.sin(breathe * Math.PI * 4 + i) * jitterAmp;

          // Markera mittlågan i steg 2
          const highlight = stepIdx === 2 && i === 2 ? 1 : 0;
          const op = lerp(0.9, 0.7, cool) + highlight * 0.1;

          // Form: triangulär låga som rundas mer ju kallare
          // Använd path: M (x-half, baseY) Q (x, baseY-h*1.1) (x+half, baseY)
          const ctrlY = baseY - h * lerp(1.15, 1.0, cool);
          const path = `M ${x - halfW + jx} ${baseY} Q ${x + jx} ${ctrlY} ${x + halfW + jx} ${baseY} Z`;

          return (
            <g key={i}>
              {/* Glöd-mark under lågan när vi kyler ner */}
              {cool > 0.3 && (
                <ellipse
                  cx={x}
                  cy={baseY + 2}
                  rx={halfW + 4}
                  ry={4 + cool * 3}
                  fill={ACCENT}
                  fillOpacity={0.4 * cool}
                />
              )}
              <path d={path} fill={ACCENT} fillOpacity={op} />
              {highlight > 0 && (
                <circle
                  cx={x + jx}
                  cy={baseY - h * 0.5}
                  r={5 + breathe * 2}
                  fill="currentColor"
                  fillOpacity={0.6}
                />
              )}
            </g>
          );
        })}

      {/* Steg 4: en lugn glöd i mitten */}
      {stepIdx >= 4 && (
        <g>
          <ellipse
            cx={W / 2}
            cy={baseY + 2}
            rx={70}
            ry={8}
            fill={ACCENT}
            fillOpacity={0.5}
          />
          <circle
            cx={W / 2}
            cy={baseY - 18}
            r={18 + breathe * 4}
            fill={ACCENT}
            fillOpacity={0.85}
          />
          <circle
            cx={W / 2}
            cy={baseY - 18}
            r={28 + breathe * 6}
            fill="none"
            stroke={ACCENT}
            strokeOpacity={0.35}
            strokeWidth={2}
          />
        </g>
      )}
    </svg>
  );
}

// ─── 10. Mellan två möten — pausen mellan två rum ──────────
// Två rum (förra/nästa möte) på var sin sida. Mellan dem står du.
//  0 "Stå upp om du kan"           → figuren reser sig från sittande
//  1 "Släpp axlarna"               → axel-linjen sjunker mjukt
//  2 "Tre långa utandningar"       → tre ringar bloomar ut från figuren i tur och ordning
//  3 "Vad behöver nästa möte?"     → blicken/strålen riktas mot höger rum, som lyser upp
function MeetingsTimeline(p: BespokeProps) {
  const W = 320;
  const H = 220;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5200);

  const floorY = H - 26;

  // Två rum (öppna kuber sedda från sidan)
  const leftRoom = { x: 14, y: floorY - 86, w: 78, h: 86 };
  const rightRoom = { x: W - 14 - 78, y: floorY - 86, w: 78, h: 86 };

  // Vänster rum (förra mötet) är alltid dämpat
  const leftOp = 0.4;

  // Höger rum lyser upp gradvis i steg 3
  const rightFocus = stepIdx === 3 ? easeInOut(sp) : 0;
  const rightOp = 0.4 + rightFocus * 0.5;

  // Figur — reser sig i steg 0
  const stand = stepIdx === 0 ? easeInOut(sp) : stepIdx > 0 ? 1 : 0;
  const figX = W / 2;
  const headR = 10;
  const headY = lerp(floorY - 46, floorY - 96, stand);
  const bodyTopY = headY + headR;
  const bodyBotY = floorY - 4;

  // Axlar — droppar i steg 1
  const shoulderDrop = stepIdx === 1 ? easeInOut(sp) : stepIdx > 1 ? 1 : 0;
  const shoulderY = lerp(bodyTopY + 1, bodyTopY + 12, shoulderDrop);
  const shoulderHalfW = lerp(13, 18, shoulderDrop);

  // Tre andetag — varje får sin tredjedel av sp i steg 2
  const exhales = stepIdx === 2
    ? [0, 1, 2].map((i) => clamp01(sp * 3 - i))
    : stepIdx > 2 ? [1, 1, 1] : [0, 0, 0];

  // Huvudet lutar något åt höger i steg 3 (orienterar mot nästa möte)
  const tilt = stepIdx === 3 ? easeInOut(sp) * 4 : stepIdx > 3 ? 4 : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-[20rem]" aria-hidden>
      {/* Golv-linje */}
      <line x1={0} x2={W} y1={floorY} y2={floorY} stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />

      {/* Förra mötet (vänster) — dämpat rum */}
      <g opacity={leftOp}>
        <rect
          x={leftRoom.x}
          y={leftRoom.y}
          width={leftRoom.w}
          height={leftRoom.h}
          rx={6}
          fill="none"
          stroke={SOFT}
          strokeWidth={2}
        />
        {/* Stolar */}
        <rect x={leftRoom.x + 14} y={leftRoom.y + leftRoom.h - 22} width={14} height={14} rx={2} fill={SOFT} fillOpacity={0.6} />
        <rect x={leftRoom.x + 50} y={leftRoom.y + leftRoom.h - 22} width={14} height={14} rx={2} fill={SOFT} fillOpacity={0.6} />
      </g>

      {/* Nästa möte (höger) — lyser upp i steg 3 */}
      <g>
        <rect
          x={rightRoom.x}
          y={rightRoom.y}
          width={rightRoom.w}
          height={rightRoom.h}
          rx={6}
          fill={ACCENT}
          fillOpacity={rightFocus * 0.15}
          stroke={ACCENT}
          strokeOpacity={rightOp}
          strokeWidth={2 + rightFocus * 1}
        />
        <rect x={rightRoom.x + 14} y={rightRoom.y + rightRoom.h - 22} width={14} height={14} rx={2} fill={ACCENT} fillOpacity={0.3 + rightFocus * 0.5} />
        <rect x={rightRoom.x + 50} y={rightRoom.y + rightRoom.h - 22} width={14} height={14} rx={2} fill={ACCENT} fillOpacity={0.3 + rightFocus * 0.5} />
      </g>

      {/* Stråle från figur till nästa möte (steg 3) */}
      {rightFocus > 0.02 && (
        <line
          x1={figX + 14}
          x2={rightRoom.x - 4}
          y1={headY}
          y2={rightRoom.y + rightRoom.h / 2}
          stroke={ACCENT}
          strokeOpacity={rightFocus * 0.55}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}

      {/* Andetags-ringar — tre stycken, bloomar utåt nedanför axlarna */}
      {exhales.map((u, i) => {
        if (u <= 0) return null;
        const r = lerp(8, 44 + i * 8, u);
        // Opacitet toppar mitt i utandningen och tonar ut
        const op = u < 0.5 ? u * 2 : (1 - u) * 1.4;
        return (
          <circle
            key={i}
            cx={figX}
            cy={shoulderY + 18}
            r={r}
            fill="none"
            stroke={ACCENT}
            strokeOpacity={Math.max(0, op) * 0.7}
            strokeWidth={2}
          />
        );
      })}

      {/* Figuren — huvud, axel-streck, kropp, ben */}
      <g>
        {/* Kropp */}
        <line
          x1={figX}
          x2={figX}
          y1={bodyTopY + 2}
          y2={bodyBotY - 22}
          stroke={ACCENT}
          strokeOpacity={0.85}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Ben */}
        <line x1={figX} x2={figX - 7} y1={bodyBotY - 22} y2={bodyBotY} stroke={ACCENT} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
        <line x1={figX} x2={figX + 7} y1={bodyBotY - 22} y2={bodyBotY} stroke={ACCENT} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
        {/* Axlar */}
        <line
          x1={figX - shoulderHalfW}
          x2={figX + shoulderHalfW}
          y1={shoulderY}
          y2={shoulderY}
          stroke={ACCENT}
          strokeOpacity={0.85}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Huvud — andas lätt med pulsen */}
        <circle
          cx={figX + tilt}
          cy={headY}
          r={headR + breathe * 0.6}
          fill={ACCENT}
          fillOpacity={0.95}
        />
      </g>
    </svg>
  );
}

// ─── 11. Löv i bäcken (ACT-defusion) ─────────────────────────
// Tankar är inte order. Lägg dem på ett löv och låt bäcken bära dem.
// Animationen byter inte med stegen — bara texten ovanför gör det.
// Lövens hastighet är konstant: man kan titta, inte stoppa.
function LeavesOnStream(_p: BespokeProps) {
  const W = 280;
  const H = 280;
  const t = useTimeSec();
  const breathe = useBreathPulse(6400);

  // Två böljande strandlinjer — uppe och nere.
  // Båda svajar långsamt med samma andningspuls så bilden "andas".
  const bank = (yBase: number, sign: number) => {
    const pts: string[] = [];
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const wob =
        Math.sin(i * 0.55 + t * 0.6) * 3 +
        Math.sin(i * 1.2 - t * 0.3) * 1.5 +
        breathe * 2 * sign;
      pts.push(`${x.toFixed(1)},${(yBase + wob).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Sex löv som driver från vänster till höger i olika takt och y-läge.
  // Varje löv har egen periodtid, så de aldrig hamnar i takt med varandra.
  const leaves = [
    { period: 14, y: 70, size: 14, tilt: -18, offset: 0.0 },
    { period: 11, y: 110, size: 11, tilt: 22, offset: 0.4 },
    { period: 17, y: 145, size: 16, tilt: -8, offset: 0.7 },
    { period: 13, y: 180, size: 12, tilt: 14, offset: 0.2 },
    { period: 19, y: 210, size: 15, tilt: -24, offset: 0.55 },
    { period: 15, y: 90, size: 10, tilt: 30, offset: 0.85 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-72" aria-hidden>
      {/* Bäckens vatten — platt fyllning mellan stränderna */}
      <polygon
        points={`0,40 ${W},40 ${W},${H - 40} 0,${H - 40}`}
        fill={SOFT}
        fillOpacity={0.28}
      />

      {/* Strömlinjer — antyder rörelse utan att stjäla blicken.
          Fade vid kanterna gör att återkomsten aldrig syns som ett hopp. */}
      {[80, 130, 170, 220].map((y, i) => {
        const span = W + 60;
        const shift = ((t * 18 + i * 40) % span) - 30;
        // Mjuk in-/utfade vid bildens kanter (de sista ~24 px).
        const edge = Math.min(shift + 30, W - shift, 24) / 24;
        const fade = Math.max(0, Math.min(1, edge));
        return (
          <line
            key={`s-${i}`}
            x1={shift}
            x2={shift + 28}
            y1={y}
            y2={y + 1}
            stroke="currentColor"
            strokeOpacity={0.18 * fade}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Strandlinjer */}
      <polyline
        points={bank(38, 1)}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <polyline
        points={bank(H - 38, -1)}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={2}
      />

      {/* Löv — fade vid kanterna så att loopen inte syns som en pop. */}
      {leaves.map((l, i) => {
        const u = (t / l.period + l.offset) % 1;
        const x = -30 + u * (W + 60);
        const bob = Math.sin(t * 1.4 + i) * 2.5;
        const rot = l.tilt + Math.sin(t * 0.8 + i) * 6;
        const edge = Math.min(x + 30, W - x, 36) / 36;
        const fade = Math.max(0, Math.min(1, edge));
        return (
          <g
            key={`leaf-${i}`}
            transform={`translate(${x.toFixed(1)} ${(l.y + bob).toFixed(1)}) rotate(${rot.toFixed(1)})`}
            opacity={fade}
          >
            <ellipse
              cx={0}
              cy={0}
              rx={l.size}
              ry={l.size * 0.45}
              fill={ACCENT}
              fillOpacity={0.92}
            />
            <line
              x1={-l.size}
              x2={l.size}
              y1={0}
              y2={0}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Märk tanken ───────────────────────────────────────────
// Aktiv defusion: en diffus "tanke" (mjuk blob) kristalliseras till
// en namngiven geometrisk form och driver bort. Loopen fortsätter
// oberoende av steg — tankar kommer, tankar märks, tankar släpps.
function NameTheThought(_: BespokeProps) {
  const t = useTimeSec();
  const breathe = useBreathPulse(5400);
  const W = 320;
  const H = 280;
  const cx = W / 2;
  const cy = H / 2 + 6;

  const LABELS = ["planering", "oro", "minne", "kritik", "fantasi", "borde"];
  const SHAPES = ["circle", "square", "triangle", "hexagon"] as const;

  const cycle = 6.5;
  const idx = Math.floor(t / cycle);
  const phase = (t % cycle) / cycle; // 0..1
  const label = LABELS[idx % LABELS.length];
  const shape = SHAPES[idx % SHAPES.length];

  // Faser inom en cykel:
  //   0.00–0.70  diffus blob (full)
  //   0.70–0.85  blobben kristalliseras, etiketten tonar in
  //   0.85–1.00  namngivet objekt driver ut + ny blob tonar in
  const fuzzMix =
    phase < 0.7 ? 1 : phase < 0.85 ? 1 - (phase - 0.7) / 0.15 : 0;
  const crystIn = phase < 0.7 ? 0 : phase < 0.85 ? (phase - 0.7) / 0.15 : 1;
  const exitU = phase < 0.85 ? 0 : (phase - 0.85) / 0.15;
  const exitFade = 1 - exitU;
  const exitX = exitU * 90;
  const newBlobOp = exitU;

  // Diffus blob — vågig path som rör sig långsamt.
  const N = 26;
  const baseR = 48 + breathe * 4;
  const blobPts: string[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob =
      Math.sin(a * 3 + t * 1.1) * 7 + Math.sin(a * 5 - t * 0.7) * 3.5;
    const r = baseR + wob;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    blobPts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  blobPts.push("Z");
  const blobPath = blobPts.join(" ");

  // Ambient — ord som driver förbi i bakgrunden ("nästa tanke är på väg").
  const ambient = [
    { period: 11, y: 56, offset: 0.0, text: "planering" },
    { period: 13, y: 92, offset: 0.42, text: "oro" },
    { period: 17, y: 232, offset: 0.65, text: "minne" },
    { period: 12, y: 258, offset: 0.18, text: "kritik" },
    { period: 15, y: 38, offset: 0.78, text: "fantasi" },
    { period: 14, y: 268, offset: 0.5, text: "borde" },
  ];

  // Kristalliserad form
  const r = 28;
  const shapeX = cx + exitX;
  const shapeEl = (() => {
    if (shape === "circle")
      return <circle cx={shapeX} cy={cy} r={r} fill={ACCENT} fillOpacity={0.92} />;
    if (shape === "square")
      return (
        <rect
          x={shapeX - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          rx={6}
          fill={ACCENT}
          fillOpacity={0.92}
        />
      );
    if (shape === "triangle") {
      const h = r * Math.sqrt(3);
      return (
        <polygon
          points={`${shapeX},${cy - r} ${shapeX + h * 0.5},${cy + r * 0.55} ${shapeX - h * 0.5},${cy + r * 0.55}`}
          fill={ACCENT}
          fillOpacity={0.92}
        />
      );
    }
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      pts.push(`${shapeX + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
    }
    return <polygon points={pts.join(" ")} fill={ACCENT} fillOpacity={0.92} />;
  })();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-72" aria-hidden>
      {/* Ambient: nya tankar på väg in */}
      {ambient.map((a, i) => {
        const span = W + 140;
        const u = (t / a.period + a.offset) % 1;
        const x = -70 + u * span;
        const edge = Math.min(x + 70, W - x, 50) / 50;
        const fade = Math.max(0, Math.min(1, edge));
        return (
          <text
            key={`amb-${i}`}
            x={x}
            y={a.y}
            fontSize="12"
            fontStyle="italic"
            fill="currentColor"
            opacity={0.32 * fade}
          >
            {a.text}
          </text>
        );
      })}

      {/* Diffus blob — "en tanke utan kant" */}
      <path d={blobPath} fill={SOFT} fillOpacity={0.55 * fuzzMix} />
      <path
        d={blobPath}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.18 * fuzzMix}
        strokeWidth={1}
      />

      {/* Kristalliserad, namngiven tanke */}
      <g opacity={crystIn * exitFade}>
        {shapeEl}
        <text
          x={shapeX}
          y={cy + r + 20}
          textAnchor="middle"
          fontSize="13"
          fontWeight={700}
          fill="currentColor"
          opacity={0.9}
        >
          {label}
        </text>
      </g>

      {/* Den nästa blobben anar sig — fade in under exit */}
      <circle
        cx={cx}
        cy={cy}
        r={22 + breathe * 4}
        fill={SOFT}
        fillOpacity={0.45 * newBlobOp}
      />
    </svg>
  );
}

// ─── Router ────────────────────────────────────────────────
const BESPOKE: Record<string, (p: BespokeProps) => ReactElement> = {
  "stang-47-flikar": CloseTabs,
  "angesten-far-inte-kora": NotDriving,
  reset: ResetBars,
  fokuslinsen: FocusLens,
  "sov-mjukare": SoftSleep,
  "kroppsskanning-huvud-till-fot": BodyScan,
  "vad-behover-jag-just-nu": NeedDrop,
  "tre-vanliga-meningar": KindSentences,
  "svalna-innan-svar": FlamesToEmber,
  "mellan-tva-moten": MeetingsTimeline,
  "lov-i-backen": LeavesOnStream,
  "mark-tanken": NameTheThought,
};

export function hasBespoke(id: string | undefined): boolean {
  return !!id && id in BESPOKE;
}

export function BespokeFor(props: { exerciseId: string } & BespokeProps) {
  const { exerciseId, ...rest } = props;
  const Cmp = BESPOKE[exerciseId];
  return Cmp ? <Cmp {...rest} /> : null;
}
