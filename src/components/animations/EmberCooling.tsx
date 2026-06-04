import { useEffect, useRef, useState } from "react";

/**
 * EmberCooling
 * ------------
 * Flammor som långsamt sjunker till glödande kol — för "Svalna innan svar".
 *
 * Props:
 *  - stepIndex: aktuellt steg (0..stepCount-1)
 *  - stepProgress: 0..1 inom aktuellt steg
 *  - stepCount: totala antal steg (för att räkna fram global "svalning")
 *
 * Inga externa libs. Vi använder requestAnimationFrame för flimmer & partiklar,
 * och drar flammhöjd / glöd från (stepIndex + stepProgress) / stepCount.
 */

const W = 600;
const H = 400;

const FLAMES = [
  // baseX, baseW, baseH, freq, phase
  { x: 300, w: 110, h: 220, f: 2.7, p: 0.0 },
  { x: 230, w: 75, h: 165, f: 3.1, p: 1.2 },
  { x: 370, w: 80, h: 175, f: 2.9, p: 0.6 },
  { x: 270, w: 55, h: 130, f: 3.6, p: 2.1 },
  { x: 340, w: 55, h: 135, f: 3.3, p: 2.7 },
];

const EMBERS = [
  // x, baseY, drift, freq, phase, size
  { x: 240, dx: 8, f: 0.6, p: 0.0, r: 2.4 },
  { x: 290, dx: -6, f: 0.8, p: 1.1, r: 3.0 },
  { x: 320, dx: 5, f: 0.5, p: 0.4, r: 2.0 },
  { x: 360, dx: -8, f: 0.7, p: 2.0, r: 2.6 },
  { x: 270, dx: 7, f: 0.9, p: 1.7, r: 1.8 },
  { x: 340, dx: -4, f: 0.65, p: 0.9, r: 2.2 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export function EmberCooling({
  stepIndex,
  stepProgress,
  stepCount,
}: {
  stepIndex: number;
  stepProgress: number;
  stepCount: number;
}) {
  const [t, setT] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Global "svalning": 0 i början, 1 i slutet
  const cool = Math.min(1, (stepIndex + stepProgress) / Math.max(1, stepCount));
  // Flammhöjd faller från 1.0 → 0.18
  const flameScale = lerp(1, 0.18, cool);
  // Glöd-intensitet ökar lite (kolen syns mer när lågorna sjunker)
  const glow = lerp(0.7, 1, cool);
  // Flimmerstyrka — högt i början, lugnt mot slutet
  const flicker = lerp(0.22, 0.06, cool);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Flammor som sjunker till glöd"
      >
        <defs>
          <radialGradient id="ember-glow" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#ff7a2a" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#c2300d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3a0a04" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ember-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe6a8" stopOpacity="1" />
            <stop offset="50%" stopColor="#ff8a30" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7a1a05" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffe39a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#ff8a2a" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#d62a07" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7a1505" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="smoke-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="flame-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Mark / mörk bas */}
        <ellipse cx={W / 2} cy={H - 30} rx={230} ry={26} fill="#1a0703" opacity={0.55} />

        {/* Stor halo av glöd som växer när det svalnar */}
        <ellipse
          cx={W / 2}
          cy={H - 70}
          rx={210 * (0.85 + 0.25 * glow)}
          ry={70 * (0.85 + 0.25 * glow)}
          fill="url(#ember-glow)"
          opacity={0.55 + 0.35 * glow}
          filter="url(#soft-blur)"
        />

        {/* Smoke wisp — kommer fram mot slutet */}
        {cool > 0.4 && (
          <g opacity={Math.min(1, (cool - 0.4) * 1.6)}>
            {[0, 1, 2].map((i) => {
              const wob = Math.sin(t * 0.4 + i) * 18;
              const rise = ((t * 8 + i * 60) % 240);
              return (
                <ellipse
                  key={i}
                  cx={W / 2 + wob + (i - 1) * 25}
                  cy={H - 110 - rise}
                  rx={45 + rise * 0.18}
                  ry={28 + rise * 0.12}
                  fill="url(#smoke-grad)"
                  filter="url(#soft-blur)"
                />
              );
            })}
          </g>
        )}

        {/* Flammor */}
        <g filter="url(#flame-blur)">
          {FLAMES.map((fl, i) => {
            const wob = Math.sin(t * fl.f + fl.p) * 6;
            const heightWob = 1 + Math.sin(t * fl.f * 1.3 + fl.p) * flicker;
            const h = fl.h * flameScale * heightWob;
            const w = fl.w * (0.85 + 0.15 * heightWob);
            const baseY = H - 70;
            const tipY = baseY - h;
            const cpLx = fl.x - w / 2 + wob;
            const cpRx = fl.x + w / 2 + wob;
            const midY = baseY - h * 0.55;
            const d = `
              M ${fl.x - w / 2} ${baseY}
              C ${cpLx - 10} ${midY}, ${fl.x - w / 6 + wob} ${tipY + 20}, ${fl.x + wob} ${tipY}
              C ${fl.x + w / 6 + wob} ${tipY + 20}, ${cpRx + 10} ${midY}, ${fl.x + w / 2} ${baseY}
              Z
            `;
            return (
              <path
                key={i}
                d={d}
                fill="url(#flame-grad)"
                opacity={0.55 + 0.4 * (1 - cool * 0.7)}
              />
            );
          })}
        </g>

        {/* Kol — flera glödhögar */}
        <g>
          {[
            { x: 250, y: H - 60, r: 22 },
            { x: 290, y: H - 55, r: 26 },
            { x: 330, y: H - 60, r: 24 },
            { x: 365, y: H - 55, r: 20 },
            { x: 215, y: H - 55, r: 18 },
          ].map((c, i) => {
            const pulse = 0.85 + 0.15 * Math.sin(t * 1.4 + i);
            return (
              <ellipse
                key={i}
                cx={c.x}
                cy={c.y}
                rx={c.r}
                ry={c.r * 0.55}
                fill="url(#ember-core)"
                opacity={(0.55 + 0.45 * glow) * pulse}
              />
            );
          })}
        </g>

        {/* Stigande gnistor / embers */}
        <g>
          {EMBERS.map((e, i) => {
            const cycle = 2 + i * 0.3;
            const phase = (t / cycle + e.p) % 1;
            const y = H - 80 - phase * (120 + flameScale * 80);
            const x = e.x + Math.sin(t * e.f + e.p) * 12 + e.dx * phase;
            const op = Math.sin(phase * Math.PI) * (0.5 + 0.5 * glow);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={e.r}
                fill="#ffd078"
                opacity={op}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
