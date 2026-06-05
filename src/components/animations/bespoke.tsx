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
// 6 steg:
//  0 "Du sitter vid ratten"      → du (stadig prick) i ratten, ingen oro syns
//  1 "Namnge känslan"            → oron dyker upp som jittrig prick vid ratten
//  2 "Ge den en plats"           → oron glider till passagerarsätet, bälte
//  3 "Den får skrika. Du kör."   → oron pulserar starkt, du stadig, vägen rullar
//  4 "Vart vill du köra?"        → riktnings-pil framåt, vägen rullar tydligare
//  5 "En liten handling"         → en liten markör går framåt på vägen
function NotDriving(p: BespokeProps) {
  const W = 300;
  const H = 220;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const pulse = useBreathPulse(4200);

  const wheelCx = W * 0.32;
  const wheelCy = H * 0.5;
  const passengerCx = W * 0.66;
  const passengerCy = H * 0.58;

  // Oron blir synlig i steg 1+
  const worryOpacity =
    stepIdx === 0 ? 0
    : stepIdx === 1 ? easeInOut(sp)
    : 1;

  // Förflyttning till passagerarsätet sker i steg 2
  const settle =
    stepIdx < 2 ? 0
    : stepIdx === 2 ? easeInOut(sp)
    : 1;

  // Bälte syns när orden landat
  const beltOpacity = stepIdx >= 2 ? (stepIdx === 2 ? easeInOut(sp) : 1) : 0;

  // Jitter-amplitud: liten i steg 1, stor i steg 3 (skriker), liten igen i 4-5
  const jitterAmp =
    stepIdx === 1 ? 6
    : stepIdx === 2 ? lerp(6, 3, easeInOut(sp))
    : stepIdx === 3 ? 9 + pulse * 4
    : 3;

  // Oron-position: vid ratten i 0-1, glider över i 2, sitter i 3-5
  const wx = lerp(wheelCx + 36, passengerCx, settle);
  const wy = lerp(wheelCy - 14, passengerCy, settle);
  const px = wx + Math.sin(pulse * Math.PI * 4) * jitterAmp;
  const py = wy + Math.cos(pulse * Math.PI * 4) * jitterAmp * 0.6;
  const worryR = stepIdx === 3 ? 11 + pulse * 4 : 10;

  // Vägen rullar — snabbare när vi börjar köra/vill köra
  const roadSpeed = stepIdx >= 3 ? 1 : 0.3;
  const roadOffset = (pulse * 40 * roadSpeed * 6) % 28;

  // Riktnings-pil i steg 4
  const arrowOp = stepIdx === 4 ? easeInOut(sp) : stepIdx > 4 ? 1 : 0;

  // Liten handling — markör går framåt i steg 5
  const stepMarkerX = stepIdx === 5 ? lerp(W * 0.5, W * 0.88, easeInOut(sp)) : 0;
  const stepMarkerOp = stepIdx === 5 ? 1 : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-[19rem]" aria-hidden>
      {/* Väg */}
      <line
        x1={0}
        x2={W}
        y1={H - 22}
        y2={H - 22}
        stroke={SOFT}
        strokeOpacity={0.55}
        strokeWidth={3}
      />
      <g stroke={SOFT} strokeOpacity={0.4} strokeWidth={3} strokeDasharray="14 14">
        <line x1={-roadOffset} x2={W - roadOffset} y1={H - 10} y2={H - 10} />
      </g>

      {/* Ratt */}
      <circle
        cx={wheelCx}
        cy={wheelCy}
        r={52}
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.4}
        strokeWidth={4}
      />
      <circle cx={wheelCx} cy={wheelCy} r={5} fill={ACCENT} fillOpacity={0.55} />
      {/* Du — stadig prick */}
      <circle cx={wheelCx} cy={wheelCy} r={16} fill={ACCENT} />

      {/* Passagerarsäte — växer fram när oron tar plats */}
      <rect
        x={passengerCx - 28}
        y={passengerCy - 28}
        width={56}
        height={56}
        rx={14}
        fill={SOFT}
        fillOpacity={0.25 + 0.4 * settle}
      />
      {/* Bälte */}
      <line
        x1={passengerCx - 28}
        x2={passengerCx + 28}
        y1={passengerCy - 6}
        y2={passengerCy + 10}
        stroke={ACCENT}
        strokeOpacity={0.55 * beltOpacity}
        strokeWidth={3}
      />

      {/* Oron */}
      {worryOpacity > 0.02 && (
        <circle cx={px} cy={py} r={worryR} fill={ACCENT} fillOpacity={0.85 * worryOpacity} />
      )}

      {/* Riktnings-pil */}
      {arrowOp > 0.02 && (
        <g
          stroke={ACCENT}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={arrowOp}
        >
          <line x1={W * 0.5} x2={W * 0.82} y1={H - 22} y2={H - 22} />
          <polyline points={`${W * 0.78},${H - 30} ${W * 0.86},${H - 22} ${W * 0.78},${H - 14}`} />
        </g>
      )}

      {/* Liten handling — markör på vägen */}
      {stepMarkerOp > 0 && (
        <circle cx={stepMarkerX} cy={H - 22} r={7} fill={ACCENT} />
      )}
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

// ─── 5. Sov mjukare — kropp uppifrån ner, måne dalar ───────
// 8 steg (script): 0 sänk tempot, 1 panna, 2 käke, 3 axlar,
// 4 bröstkorg, 5 mage, 6 ben, 7 fötter.
// Visual: stiliserad liggande kropp som rundad vertikal pelare.
// För varje steg "mjuknar" motsvarande zon (mjukare färg, mjukare puls).
// Bakom: himmel + måne som dalar långsamt mot horisont över hela övningen.
function SoftSleep(p: BespokeProps) {
  const t = totalT(p);
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const pulse = useBreathPulse(6500);
  const W = 320;
  const H = 260;

  // Himmel + horisont + måne — dalar långsamt över hela övningen
  const horizonY = lerp(H * 0.18, H * 0.42, easeInOut(t));
  const moonX = W * 0.78;
  const moonY = lerp(H * 0.08, horizonY - 2, easeInOut(t));
  const moonR = 18 + pulse * 1.5;

  // Kroppspelare — vertikal, börjar under horisonten
  const bodyX = W * 0.18;
  const bodyW = W * 0.22;
  const bodyTop = H * 0.18;
  const bodyBot = H * 0.94;
  const bodyH = bodyBot - bodyTop;

  // 7 zoner uppifrån ner: panna, käke, axlar, bröst, mage, ben, fötter
  // Steg 0 har ingen aktiv zon (bara "sänk tempot"). Steg 1..7 = zon 0..6.
  const zones = 7;
  const zoneH = bodyH / zones;

  // Hur "mjuk" en zon är (0 spänd, 1 släppt)
  const softness = (z: number) => {
    const targetStep = z + 1; // zon 0 släpps i steg 1
    if (stepIdx > targetStep) return 1;
    if (stepIdx === targetStep) return easeInOut(sp);
    return 0;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-64 w-[22rem]" aria-hidden>
      {/* Himmel */}
      <rect x={0} y={0} width={W} height={horizonY} fill={SOFT} fillOpacity={0.35} />
      {/* Mark */}
      <rect x={0} y={horizonY} width={W} height={H - horizonY} fill={SOFT} fillOpacity={0.55} />
      {/* Måne */}
      <circle cx={moonX} cy={moonY} r={moonR} fill={ACCENT} fillOpacity={0.9} />
      {/* Horisontlinje */}
      <line x1={0} x2={W} y1={horizonY} y2={horizonY} stroke="currentColor" strokeOpacity={0.22} strokeWidth={2} />

      {/* Kropp — outline */}
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyW}
        height={bodyH}
        rx={bodyW / 2}
        fill={SOFT}
        fillOpacity={0.35}
      />

      {/* Zoner — fyller på uppifrån när de "släpps" */}
      {Array.from({ length: zones }, (_, z) => {
        const s = softness(z);
        if (s < 0.02) return null;
        const y = bodyTop + z * zoneH;
        // Aktiv zon (just nu släpps) får en mjuk andnings-puls
        const isActive = stepIdx === z + 1;
        const op = lerp(0.25, 0.85, s) + (isActive ? pulse * 0.12 : 0);
        return (
          <rect
            key={z}
            x={bodyX}
            y={y}
            width={bodyW}
            height={zoneH + 0.5}
            rx={bodyW / 2}
            fill={ACCENT}
            fillOpacity={op}
          />
        );
      })}

      {/* Steg 0 — "sänk tempot": mjuk markering över hela kroppen */}
      {stepIdx === 0 && (
        <rect
          x={bodyX - 4}
          y={bodyTop - 4}
          width={bodyW + 8}
          height={bodyH + 8}
          rx={(bodyW + 8) / 2}
          fill="none"
          stroke={ACCENT}
          strokeOpacity={0.3 + pulse * 0.2}
          strokeWidth={2}
        />
      )}

      {/* Markör för aktuell zon — liten prick utanför pelaren */}
      {stepIdx >= 1 && stepIdx <= zones && (
        <circle
          cx={bodyX + bodyW + 14}
          cy={bodyTop + (stepIdx - 0.5) * zoneH}
          r={5 + pulse * 1.5}
          fill={ACCENT}
        />
      )}
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

// ─── 7. Vad behöver jag just nu — droppen sjunker genom lager
// 5 steg, mappade mot scriptet:
//  0 "Vad dyker upp först?"             → många tankar-prickar svävar i topp-lagret
//  1 "Är det ett behov — eller ett borde?" → två fält ("borde" vänster, "behov" höger), droppen glider mot höger
//  2 "Vad skulle faktiskt hjälpa?"      → droppen växer till en mjuk cirkel (behovet namnges)
//  3 "Gör det litet"                    → cirkeln krymper till en liten kärna
//  4 "Kan du ge dig det?"               → en skål växer fram nederst, kärnan landar i den och pulserar
function NeedDrop(p: BespokeProps) {
  const W = 240;
  const H = 300;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const breathe = useBreathPulse(5400);

  // Lager-y-koordinater (topp → botten)
  const yTop = 40;       // tankarna
  const ySort = 110;     // borde/behov
  const yName = 170;     // behovet namnges
  const ySmall = 215;    // gjord liten
  const yBowl = 258;     // skål

  // Bakgrundslager — mjuka horisontella band
  const lanes = [yTop, ySort, yName, ySmall, yBowl];

  // Droppens y-position glider mjukt mellan lager-mittpunkterna
  const fromY = lanes[Math.min(stepIdx, lanes.length - 1)];
  const toY = lanes[Math.min(stepIdx + 1, lanes.length - 1)];
  const dotY = lerp(fromY, toY, easeInOut(sp) * 0.9); // glider mot nästa lager mot slutet

  // Droppens x-position — i steg 1 glider den från mitten mot höger (behov)
  const driftX =
    stepIdx === 0 ? 0
    : stepIdx === 1 ? lerp(0, 40, easeInOut(sp))
    : 40;
  const jitter = stepIdx === 0 ? Math.sin(breathe * Math.PI * 2) * 4 : 0;
  const dotX = W / 2 + driftX + jitter;

  // Droppens storlek per steg
  const dotR =
    stepIdx === 0 ? 6
    : stepIdx === 1 ? 7
    : stepIdx === 2 ? lerp(7, 22, easeInOut(sp))
    : stepIdx === 3 ? lerp(22, 8, easeInOut(sp))
    : 8 + breathe * 2;

  // Sat-tankar runt droppen i steg 0 (rörigt)
  const noise = 9;

  // Borde / Behov fält i steg 1+
  const sortOp =
    stepIdx === 0 ? 0
    : stepIdx === 1 ? easeInOut(sp)
    : 1;

  // Skål — växer fram i steg 4
  const bowlOp = stepIdx === 4 ? easeInOut(sp) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-60" aria-hidden>
      {/* Mjuka bakgrundsband — markerar aktivt lager */}
      {lanes.map((y, i) => (
        <rect
          key={i}
          x={20}
          y={y - 18}
          width={W - 40}
          height={36}
          rx={18}
          fill={SOFT}
          fillOpacity={i === stepIdx ? 0.45 : 0.18}
        />
      ))}

      {/* Borde / Behov etiketter (rektanglar) i steg 1+ */}
      {sortOp > 0.02 && (
        <g opacity={sortOp}>
          <rect x={W / 2 - 78} y={ySort - 14} width={64} height={28} rx={8} fill={SOFT} fillOpacity={0.5} />
          <rect x={W / 2 + 14} y={ySort - 14} width={64} height={28} rx={8} fill={ACCENT} fillOpacity={0.55} />
        </g>
      )}

      {/* Tanke-prickar i steg 0 */}
      {stepIdx === 0 &&
        Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const r = 24 + (i % 3) * 6;
          const wob = Math.sin(breathe * Math.PI * 2 + i) * noise;
          return (
            <circle
              key={i}
              cx={W / 2 + Math.cos(a) * r + wob}
              cy={yTop + Math.sin(a) * r * 0.6 + wob * 0.6}
              r={3.5}
              fill={SOFT}
              fillOpacity={0.55}
            />
          );
        })}

      {/* Skål nederst */}
      {bowlOp > 0.02 && (
        <path
          d={`M ${W / 2 - 56} ${yBowl + 4} Q ${W / 2} ${yBowl + 44}, ${W / 2 + 56} ${yBowl + 4}`}
          fill="none"
          stroke={ACCENT}
          strokeOpacity={0.85 * bowlOp}
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}

      {/* Droppen */}
      <circle cx={dotX} cy={dotY} r={dotR} fill={ACCENT} fillOpacity={0.95} />
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

// ─── 10. Mellan två möten — tidslinje med block ────────────
function MeetingsTimeline(p: BespokeProps) {
  const t = totalT(p);
  const W = 320;
  const H = 140;
  const baseY = H / 2;
  const blocks = 4;
  // luft växer mellan blocken
  const air = lerp(4, 28, easeInOut(t));
  const blockW = (W - 40 - air * (blocks - 1)) / blocks;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-[22rem]" aria-hidden>
      <line x1={20} x2={W - 20} y1={baseY + 28} y2={baseY + 28} stroke={SOFT} strokeOpacity={0.6} strokeWidth={3} />
      {Array.from({ length: blocks }, (_, i) => {
        const x = 20 + i * (blockW + air);
        // mittblocket = "denna paus" — markeras
        const isNow = i === 1;
        const op = isNow ? lerp(0.85, 0.4, t) : 0.85;
        return (
          <rect
            key={i}
            x={x}
            y={baseY - 24}
            width={blockW}
            height={44}
            rx={10}
            fill={ACCENT}
            fillOpacity={op}
          />
        );
      })}
      {/* Andetags-prick mellan block 1 och 2 */}
      <circle
        cx={20 + blockW + air / 2}
        cy={baseY - 2}
        r={lerp(4, 14, easeInOut(t))}
        fill={ACCENT}
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
};

export function hasBespoke(id: string | undefined): boolean {
  return !!id && id in BESPOKE;
}

export function BespokeFor(props: { exerciseId: string } & BespokeProps) {
  const { exerciseId, ...rest } = props;
  const Cmp = BESPOKE[exerciseId];
  return Cmp ? <Cmp {...rest} /> : null;
}
