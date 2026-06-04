export type Sense = "see" | "hear" | "feel" | "smell" | "taste";

interface Props {
  /** Antal saker i steget (5, 4, 3, 2, 1) */
  total: number;
  /** 0…total-1 — vilken sak vi jobbar på */
  activeIndex: number;
  /** 0→1 inom aktuell sak */
  itemProgress: number;
  sense: Sense;
}

/**
 * 5-4-3-2-1 grounding. En cirkel med en sinnes-ikon i mitten och `total`
 * prickar runt om. Prickar 0..activeIndex-1 är "klara", `activeIndex`
 * pulserar/växer med itemProgress, resten är släckta.
 */
export function Grounding54321({ total, activeIndex, itemProgress, sense }: Props) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 88;

  // Prickar runt cirkeln, första uppe (12-positionen).
  const dots = Array.from({ length: total }, (_, i) => {
    const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  // Mjuk puls för aktiv prick: växer 0.6 → 1.0 över itemProgress.
  const activeScale = 0.7 + 0.3 * Math.sin(itemProgress * Math.PI);

  return (
    <div className="grid place-items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-64 w-64 md:h-72 md:w-72"
        aria-hidden
      >
        <defs>
          <radialGradient id="g54-bg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* mjuk fond */}
        <circle cx={cx} cy={cy} r={r + 22} fill="url(#g54-bg)" />

        {/* cirkel-bana */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={1.5}
        />

        {/* sinnes-ikon i mitten */}
        <g transform={`translate(${cx}, ${cy})`} stroke="currentColor" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <SenseGlyph sense={sense} />
        </g>

        {/* prickar */}
        {dots.map((p, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          const baseR = 9;
          const rad = active ? baseR + 4 * activeScale : baseR;
          const opacity = done ? 0.85 : active ? 1 : 0.25;
          return (
            <g key={i}>
              {active && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={baseR + 14 * activeScale}
                  fill="currentColor"
                  opacity={0.18}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={rad}
                fill="currentColor"
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SenseGlyph({ sense }: { sense: Sense }) {
  switch (sense) {
    case "see":
      // Öga
      return (
        <>
          <path d="M -28 0 Q 0 -20 28 0 Q 0 20 -28 0 Z" />
          <circle cx={0} cy={0} r={7} fill="currentColor" />
        </>
      );
    case "hear":
      // Öra (förenklad spiral)
      return (
        <>
          <path d="M -14 -18 Q -22 0 -14 18 Q -2 24 6 14 Q 14 4 6 -4 Q -2 -10 -6 -2" />
          <circle cx={-2} cy={2} r={3} fill="currentColor" />
        </>
      );
    case "feel":
      // Hand (handflata)
      return (
        <>
          <path d="M -14 14 L -14 -8 Q -14 -14 -8 -14 L -8 0 L -8 -20 Q -8 -26 -2 -26 L -2 0 L -2 -22 Q -2 -28 4 -28 L 4 0 L 4 -20 Q 4 -26 10 -26 L 10 4 Q 10 18 -2 22 Q -14 22 -14 14 Z" />
        </>
      );
    case "smell":
      // Näsa
      return (
        <>
          <path d="M 0 -22 Q -10 -6 -14 8 Q -14 16 -6 16 L 6 16 Q 14 16 14 8 Q 10 -6 0 -22 Z" />
          <path d="M -8 8 Q -4 12 0 8" />
          <path d="M 0 8 Q 4 12 8 8" />
        </>
      );
    case "taste":
      // Mun
      return (
        <>
          <path d="M -22 0 Q 0 -14 22 0 Q 0 14 -22 0 Z" />
          <path d="M -10 -4 Q 0 -2 10 -4" />
        </>
      );
  }
}
