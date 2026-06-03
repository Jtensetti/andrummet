import { useEffect, useRef } from "react";
import {
  DotLottieReact,
  type DotLottie,
} from "@lottiefiles/dotlottie-react";

export type LottieMode = "loop" | "once-per-step" | "clock-driven";

export interface LottieSpec {
  /** URL till .lottie eller .json — gärna lagrad via lovable-assets */
  src: string;
  mode?: LottieMode;
  /** Skapare + licens, visas på credits-sidan */
  credit?: { author: string; sourceUrl?: string; license?: string };
}

interface Props {
  spec: LottieSpec;
  /** Övningens stegklocka (0→1 inom aktuellt steg) */
  stepProgress: number;
  /** Index för aktuellt steg */
  stepIndex: number;
}

/**
 * Tunn wrapper kring dotLottieReact.
 *
 * - mode="loop"          → autoplay + loop, klockoberoende.
 * - mode="once-per-step" → spelar en gång från start vid varje stegbyte.
 * - mode="clock-driven"  → frame = stepProgress * totalFrames (övningens klocka driver).
 */
export function LottiePlayer({ spec, stepProgress, stepIndex }: Props) {
  const mode: LottieMode = spec.mode ?? "loop";
  const ref = useRef<DotLottie | null>(null);
  const totalFramesRef = useRef<number>(0);

  // Återstart vid stegbyte för once-per-step.
  useEffect(() => {
    if (mode !== "once-per-step") return;
    const dl = ref.current;
    if (!dl) return;
    try {
      dl.setFrame(0);
      dl.play();
    } catch {
      // ignore — händer om filen inte hunnit laddas
    }
  }, [stepIndex, mode]);

  // Driv frame manuellt utifrån övningens klocka.
  useEffect(() => {
    if (mode !== "clock-driven") return;
    const dl = ref.current;
    const total = totalFramesRef.current;
    if (!dl || !total) return;
    const frame = Math.max(0, Math.min(total - 1, stepProgress * (total - 1)));
    try {
      dl.setFrame(frame);
    } catch {
      // ignore
    }
  }, [stepProgress, mode]);

  return (
    <div className="grid h-56 w-56 place-items-center md:h-64 md:w-64">
      <DotLottieReact
        src={spec.src}
        autoplay={mode === "loop" || mode === "once-per-step"}
        loop={mode === "loop"}
        dotLottieRefCallback={(dl) => {
          ref.current = dl;
          if (!dl) return;
          dl.addEventListener("load", () => {
            totalFramesRef.current = dl.totalFrames ?? 0;
            if (mode === "clock-driven") {
              dl.pause();
              dl.setFrame(0);
            }
          });
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
