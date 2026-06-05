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
// 3 brickor uppe. Per steg 3,4,5 glider en ner i lådan.
function CloseTabs(p: BespokeProps) {
  const W = 240;
  const H = 280;
  const boxW = 160;
  const boxH = 32;
  const gap = 10;
  const total = 3;
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  // Drop-steg är index 2,3,4 (0-baserat) i original-övningen (6 steg totalt).
  const dropStartStep = 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-60" aria-hidden>
      {/* Lådan */}
      <rect
        x={(W - boxW - 20) / 2}
        y={H - boxH - 26}
        width={boxW + 20}
        height={boxH + 22}
        rx={10}
        fill={SOFT}
        fillOpacity={0.45}
      />
      {Array.from({ length: total }, (_, i) => {
        // Hur långt den här brickan har "fallit": 0 = uppe, 1 = i lådan.
        const stepForThis = dropStartStep + i;
        let fall = 0;
        if (stepIdx > stepForThis) fall = 1;
        else if (stepIdx === stepForThis) fall = easeInOut(sp);
        const stackY = 22 + i * (boxH + gap);
        const restY = H - boxH - 16 - (total - 1 - i) * 4;
        const y = lerp(stackY, restY, fall);
        const op = lerp(1, 0.55, fall);
        return (
          <rect
            key={i}
            x={(W - boxW) / 2}
            y={y}
            width={boxW}
            height={boxH}
            rx={9}
            fill={fall > 0.95 ? SOFT : ACCENT}
            fillOpacity={op}
          />
        );
      })}
    </svg>
  );
}

// ─── 2. Ångesten får inte köra bilen ────────────────────────
// Stor cirkel = ratt. Stadig prick i mitten (du). Mindre prick (oron)
// rör sig från "vid ratten" → "passagerarsäte" → bältad bredvid.
function NotDriving(p: BespokeProps) {
  const W = 280;
  const H = 240;
  const pulse = useBreathPulse(4500);
  const t = totalT(p); // 0..1 över hela övningen
  // Position för "oron":
  // t=0:    nära ratten (cx, cy uppe)
  // t=0.3:  glider åt sidan
  // t>=0.5: sätter sig i passagerarsätet
  const wheelCx = W * 0.4;
  const wheelCy = H * 0.45;
  const passengerCx = W * 0.75;
  const passengerCy = H * 0.55;

  // jitter när oron är vid ratten, lugn när bältad
  const jitterAmp = lerp(10, 0, easeInOut(Math.min(1, t * 2.2)));
  const settle = easeInOut(Math.min(1, Math.max(0, (t - 0.15) / 0.4)));
  const px = lerp(wheelCx, passengerCx, settle) + Math.sin(pulse * Math.PI * 4) * jitterAmp;
  const py = lerp(wheelCy, passengerCy, settle) + Math.cos(pulse * Math.PI * 4) * jitterAmp * 0.6;

  // Vägen rullar (streckade linjer som glider)
  const roadOffset = (pulse * 40) % 40;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-[18rem]" aria-hidden>
      {/* Väg */}
      <line x1={0} x2={W} y1={H - 24} y2={H - 24} stroke={SOFT} strokeOpacity={0.6} strokeWidth={3} />
      <g stroke={SOFT} strokeOpacity={0.45} strokeWidth={3} strokeDasharray="14 14">
        <line x1={-roadOffset} x2={W - roadOffset} y1={H - 12} y2={H - 12} />
      </g>
      {/* Ratt */}
      <circle cx={wheelCx} cy={wheelCy} r={56} fill="none" stroke={ACCENT} strokeOpacity={0.45} strokeWidth={4} />
      <circle cx={wheelCx} cy={wheelCy} r={6} fill={ACCENT} fillOpacity={0.6} />
      {/* Du — stadig prick i mitten av ratten */}
      <circle cx={wheelCx} cy={wheelCy} r={18} fill={ACCENT} />
      {/* Passagerarsäte (mjuk rektangel) — syns mer när oron sätter sig */}
      <rect
        x={passengerCx - 28}
        y={passengerCy - 28}
        width={56}
        height={56}
        rx={14}
        fill={SOFT}
        fillOpacity={0.35 + 0.35 * settle}
      />
      {/* Bälte: streck mellan oron och sätet när bältad */}
      {settle > 0.6 && (
        <line
          x1={passengerCx - 28}
          x2={passengerCx + 28}
          y1={passengerCy - 8}
          y2={passengerCy + 8}
          stroke={ACCENT}
          strokeOpacity={0.5}
          strokeWidth={3}
        />
      )}
      {/* Oron */}
      <circle cx={px} cy={py} r={12} fill={ACCENT} fillOpacity={0.85} />
    </svg>
  );
}

// ─── 3. Reset — tre staplar tappar höjd ─────────────────────
// Axlar, käke, andetag. Varje stapel sjunker när dess steg passeras.
function ResetBars(p: BespokeProps) {
  const labels = 3; // axlar, käke, andning (de tre första stegen sänker)
  const stepIdx = p.stepIndex ?? 0;
  const sp = clamp01(p.stepProgress ?? 0);
  const W = 240;
  const H = 260;
  const barW = 56;
  const gap = 22;
  const totalW = labels * barW + (labels - 1) * gap;
  const startX = (W - totalW) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-64 w-60" aria-hidden>
      <line x1={20} x2={W - 20} y1={H - 24} y2={H - 24} stroke={SOFT} strokeOpacity={0.6} strokeWidth={3} />
      {Array.from({ length: labels }, (_, i) => {
        let drop = 0;
        if (stepIdx > i) drop = 1;
        else if (stepIdx === i) drop = easeInOut(sp);
        const fullH = H - 50;
        const minH = 24;
        const h = lerp(fullH, minH, drop);
        const x = startX + i * (barW + gap);
        const y = H - 24 - h;
        return (
          <g key={i}>
            <rect x={x} y={24} width={barW} height={fullH} rx={12} fill={SOFT} fillOpacity={0.3} />
            <rect x={x} y={y} width={barW} height={h} rx={12} fill={ACCENT} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── 4. Fokuslinsen — många prickar drar in mot centrum ────
function FocusLens(p: BespokeProps) {
  const t = totalT(p);
  const pulse = useBreathPulse(4500);
  const n = 14;
  const R = 110;
  const gather = easeInOut(t); // 0 spritt, 1 samlat
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={0.3} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + pulse * 0.4;
        // Egen jitter-radie så de inte ligger på en cirkel hela tiden
        const noise = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const noise2 = Math.abs(noise);
        const rOuter = R * (0.7 + 0.3 * noise2);
        const r = lerp(rOuter, 6, gather);
        const op = lerp(0.55, 1, gather);
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={6} fill={ACCENT} fillOpacity={op} />;
      })}
      {/* Linsen själv — växer fram */}
      <circle cx={0} cy={0} r={lerp(0, 24, gather)} fill={ACCENT} />
    </svg>
  );
}

// ─── 5. Sov mjukare — horisont sjunker, måne dalar ─────────
function SoftSleep(p: BespokeProps) {
  const t = totalT(p);
  const pulse = useBreathPulse(6500);
  const W = 320;
  const H = 220;
  const horizonY = lerp(H * 0.32, H * 0.82, easeInOut(t));
  const moonX = W * 0.72;
  const moonY = lerp(H * 0.18, horizonY + 14, easeInOut(t));
  const moonR = 22 + pulse * 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-[22rem]" aria-hidden>
      {/* himmel */}
      <rect x={0} y={0} width={W} height={horizonY} fill={SOFT} fillOpacity={0.35} />
      {/* land */}
      <rect x={0} y={horizonY} width={W} height={H - horizonY} fill={ACCENT} fillOpacity={0.85} />
      {/* måne — klipps av horisonten naturligt eftersom den ligger bakom land-rektangeln när den sjunker */}
      <circle cx={moonX} cy={moonY} r={moonR} fill={ACCENT} />
      {/* horisontlinje */}
      <line x1={0} x2={W} y1={horizonY} y2={horizonY} stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
    </svg>
  );
}

// ─── 6. Kroppsskanning — band vandrar uppifrån ner ─────────
function BodyScan(p: BespokeProps) {
  const t = totalT(p);
  const W = 140;
  const H = 280;
  const padTop = 18;
  const padBot = 18;
  const innerH = H - padTop - padBot;
  const bandH = 36;
  const bandY = lerp(padTop, padTop + innerH - bandH, easeInOut(t));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-36" aria-hidden>
      {/* Kropp som en rundad pelare */}
      <rect x={28} y={padTop} width={W - 56} height={innerH} rx={42} fill={SOFT} fillOpacity={0.4} />
      {/* Aktivt band */}
      <rect x={20} y={bandY} width={W - 40} height={bandH} rx={18} fill={ACCENT} />
      {/* Markörer för segmentstart */}
      {Array.from({ length: (p.stepCount ?? 7) + 1 }, (_, i) => {
        const sc = Math.max(1, p.stepCount ?? 7);
        const y = padTop + (i / sc) * innerH;
        return <line key={i} x1={14} x2={20} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.45} strokeWidth={2} />;
      })}
    </svg>
  );
}

// ─── 7. Vad behöver jag just nu — ringar ritas, en per steg ─
function DrawingRings(p: BespokeProps) {
  const stepIdx = p.stepIndex ?? 0;
  const sc = Math.max(1, p.stepCount ?? 1);
  const sp = clamp01(p.stepProgress ?? 0);
  const R = 110;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="-130 -130 260 260" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={R} fill={SOFT} fillOpacity={0.3} />
      {Array.from({ length: sc }, (_, i) => {
        const ringR = R * (0.35 + 0.6 * ((i + 1) / sc));
        const ringC = 2 * Math.PI * ringR;
        let drawn = 0;
        if (i < stepIdx) drawn = 1;
        else if (i === stepIdx) drawn = easeInOut(sp);
        const dash = `${ringC * drawn} ${ringC}`;
        return (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={ringR}
            fill="none"
            stroke={ACCENT}
            strokeOpacity={0.85}
            strokeWidth={3}
            strokeDasharray={dash}
            transform="rotate(-90)"
          />
        );
      })}
      {void C}
      <circle cx={0} cy={0} r={10} fill={ACCENT} />
    </svg>
  );
}

// ─── 8. Tre vänliga meningar — två cirklar närmar sig ──────
function TwoCircles(p: BespokeProps) {
  const t = totalT(p);
  const approach = easeInOut(t); // 0 långt isär, 1 helt överlappande
  const R = 70;
  const sep = lerp(110, 18, approach);
  const opOverlap = lerp(0.5, 1, approach);
  return (
    <svg viewBox="-150 -110 300 220" className="h-56 w-72" aria-hidden>
      <circle cx={-sep} cy={0} r={R} fill={ACCENT} fillOpacity={0.7} />
      <circle cx={sep} cy={0} r={R} fill={ACCENT} fillOpacity={0.7} />
      {/* överlapp markeras med en mörkare cirkel i mitten när nära */}
      {approach > 0.4 && (
        <circle cx={0} cy={0} r={lerp(8, R, (approach - 0.4) / 0.6)} fill={ACCENT} fillOpacity={opOverlap} />
      )}
    </svg>
  );
}

// ─── 9. Svalna innan svar — vass triangel rundas ───────────
function CoolingTriangle(p: BespokeProps) {
  const t = totalT(p);
  const round = easeInOut(t); // 0 vass, 1 nästan rund
  const size = lerp(110, 70, round); // krymper också
  // Vi tecknar en triangel där hörnen byts ut mot bågar med växande radie.
  // För enkelhet: morfa polygon från triangel (3 hörn) mot regelbunden polygon med 12 hörn.
  const sides = Math.round(lerp(3, 12, round));
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(a) * size).toFixed(2)},${(Math.sin(a) * size).toFixed(2)}`;
  }).join(" ");
  const op = lerp(1, 0.55, round); // brinner starkt, dämpas till glöd
  return (
    <svg viewBox="-140 -140 280 280" className="h-64 w-64 md:h-72 md:w-72" aria-hidden>
      <circle cx={0} cy={0} r={120} fill={SOFT} fillOpacity={0.3} />
      <polygon points={pts} fill={ACCENT} fillOpacity={op} />
      {/* Glöd-centrum syns när nästan rund */}
      {round > 0.6 && <circle cx={0} cy={0} r={lerp(0, 24, (round - 0.6) / 0.4)} fill={ACCENT} />}
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
const BESPOKE: Record<string, (p: BespokeProps) => React.ReactElement> = {
  "stang-47-flikar": CloseTabs,
  "angesten-far-inte-kora": NotDriving,
  reset: ResetBars,
  fokuslinsen: FocusLens,
  "sov-mjukare": SoftSleep,
  "kroppsskanning-huvud-till-fot": BodyScan,
  "vad-behover-jag-just-nu": DrawingRings,
  "tre-vanliga-meningar": TwoCircles,
  "svalna-innan-svar": CoolingTriangle,
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
