interface Props {
  /** 0=panna, 1=käke, 2=hals/axlar, 3=bröst, 4=mage, 5=höft/ben, 6=fötter */
  zoneIndex: number;
  /** 0→1 inom aktuell zon */
  zoneProgress: number;
}

/**
 * Kroppsskanning — en stiliserad SVG-silhuett där aktuell zon lyser och
 * pulserar mjukt med övningens klocka. Tidigare zoner lämnar en svag
 * antydan så man ser kartan över var uppmärksamheten varit.
 */
export function BodyScan({ zoneIndex, zoneProgress }: Props) {
  const w = 200;
  const h = 360;
  const t = Math.max(0, Math.min(1, zoneProgress));

  // Mjuk fade-in (0→0.1), stabil puls (0.1→0.9), fade-out (0.9→1)
  const envelope =
    t < 0.1
      ? t / 0.1
      : t > 0.9
        ? (1 - t) / 0.1
        : 1;
  const pulse = 0.7 + 0.3 * Math.sin((t * 6) * Math.PI); // 3 cykler över steget
  const activeAlpha = envelope * (0.55 + 0.35 * pulse);

  const zoneAlpha = (i: number) => {
    if (i === zoneIndex) return activeAlpha;
    if (i < zoneIndex) return 0.14; // antydd "varit här"
    return 0;
  };

  // Zon-definitioner: cx, cy, rx, ry (ellipser som följer kroppen).
  // Koordinater i samma viewBox som silhuetten.
  const ZONES = [
    { cx: 100, cy: 38, rx: 26, ry: 14 }, // 0 pannan
    { cx: 100, cy: 64, rx: 22, ry: 10 }, // 1 käken
    { cx: 100, cy: 96, rx: 58, ry: 18 }, // 2 hals & axlar
    { cx: 100, cy: 138, rx: 46, ry: 26 }, // 3 bröstkorg
    { cx: 100, cy: 188, rx: 38, ry: 22 }, // 4 mage
    { cx: 100, cy: 246, rx: 50, ry: 30 }, // 5 höfter & ben (lår)
    { cx: 100, cy: 338, rx: 50, ry: 14 }, // 6 fötter
  ];

  return (
    <div className="grid place-items-center">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[22rem] w-44 md:h-[26rem] md:w-52"
        aria-hidden
      >
        <defs>
          <radialGradient id="bs-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <clipPath id="bs-body">
            <BodySilhouette />
          </clipPath>
        </defs>

        {/* fylld silhuett, väldigt mjuk */}
        <g opacity={0.08}>
          <BodySilhouette fill="currentColor" />
        </g>

        {/* zoner lyser inifrån — klippta mot silhuetten så glöden inte spiller ut */}
        <g clipPath="url(#bs-body)">
          {ZONES.map((z, i) => {
            const a = zoneAlpha(i);
            if (a <= 0.001) return null;
            return (
              <ellipse
                key={i}
                cx={z.cx}
                cy={z.cy}
                rx={z.rx}
                ry={z.ry}
                fill="url(#bs-glow)"
                opacity={a}
              />
            );
          })}
        </g>

        {/* kontur ovanpå */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeLinejoin="round"
        >
          <BodySilhouette />
        </g>
      </svg>
    </div>
  );
}

/**
 * Mjuk människo-silhuett framifrån. Ett enda path: huvud, hals, axlar,
 * bål, armar längs sidorna, ben, fötter. Symmetrisk runt x=100.
 */
function BodySilhouette(props: { fill?: string }) {
  const d = [
    // huvud
    "M 100 8",
    "C 84 8 72 20 72 38",
    "C 72 52 80 62 88 66",
    // hals
    "L 88 80",
    // axel vänster
    "C 70 84 56 92 46 104",
    // arm vänster (yttre)
    "C 38 116 32 140 30 168",
    "C 28 196 32 218 36 232",
    // armens insida tillbaka mot bål
    "C 42 232 48 222 50 208",
    "C 52 192 54 168 56 150",
    // sida av bål ner mot höft
    "C 58 140 60 130 62 122",
    "L 62 200",
    // höft
    "C 62 214 58 224 56 236",
    // ben vänster yttre
    "C 54 256 52 290 54 326",
    // fot vänster
    "C 54 336 60 348 70 348",
    "L 90 348",
    "C 96 348 98 342 98 332",
    // ben vänster inre upp mot ljumske
    "C 98 300 96 270 96 244",
    "C 96 232 98 222 100 218",
    // spegelvänt höger sida (samma form)
    "C 102 222 104 232 104 244",
    "C 104 270 102 300 102 332",
    "C 102 342 104 348 110 348",
    "L 130 348",
    "C 140 348 146 336 146 326",
    "C 148 290 146 256 144 236",
    "C 142 224 138 214 138 200",
    "L 138 122",
    "C 140 130 142 140 144 150",
    "C 146 168 148 192 150 208",
    "C 152 222 158 232 164 232",
    "C 168 218 172 196 170 168",
    "C 168 140 162 116 154 104",
    "C 144 92 130 84 112 80",
    "L 112 66",
    "C 120 62 128 52 128 38",
    "C 128 20 116 8 100 8",
    "Z",
  ].join(" ");
  return <path d={d} fill={props.fill ?? "none"} />;
}
