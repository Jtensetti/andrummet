import { Link } from "@tanstack/react-router";
import type { Exercise } from "@/lib/exercises";
import { Clock } from "lucide-react";

const themeBg: Record<string, string> = {
  calm: "bg-[var(--calm)] text-[var(--calm-ink)]",
  stress: "bg-[var(--stress)] text-[var(--stress-ink)]",
  sleep: "bg-[var(--sleep)] text-[var(--sleep-ink)]",
  anxiety: "bg-[var(--anxiety)] text-[var(--anxiety-ink)]",
  focus: "bg-[var(--focus)] text-[var(--focus-ink)]",
  compassion: "bg-[var(--compassion)] text-[var(--compassion-ink)]",
  recovery: "bg-[var(--recovery)] text-[var(--recovery-ink)]",
};

export function ExerciseCard({ ex, size = "md" }: { ex: Exercise; size?: "sm" | "md" | "lg" }) {
  const pad = size === "lg" ? "p-7" : size === "sm" ? "p-4" : "p-5";
  const titleCls =
    size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link
      to="/ovning/$id"
      params={{ id: ex.id }}
      className={`group relative block overflow-hidden rounded-3xl ${themeBg[ex.category]} ${pad} shadow-sm transition active:scale-[0.98] hover:shadow-lg`}
    >
      <Decor category={ex.category} />
      <div className="relative">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          {ex.categoryLabel}
        </div>
        <h3 className={`font-extrabold leading-tight ${titleCls}`}>{ex.title}</h3>
        <p className="mt-2 max-w-xs text-sm opacity-90">{ex.short}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-80">
          <Clock className="h-4 w-4" />
          {ex.minutes} min
        </div>
      </div>
    </Link>
  );
}

function Decor({ category }: { category: string }) {
  // Mjuka geometriska former i bakgrunden — varierar per tema
  const map: Record<string, JSX.Element> = {
    calm: (
      <>
        <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -bottom-10 -right-2 h-24 w-24 rounded-3xl bg-yellow-300/40 rotate-12" />
      </>
    ),
    stress: (
      <>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-300/50" />
        <div className="absolute -bottom-8 left-1/3 h-24 w-24 rounded-3xl bg-yellow-200/60 rotate-12" />
      </>
    ),
    sleep: (
      <>
        <div className="absolute right-6 top-6 h-14 w-14 rounded-full bg-yellow-100/80" />
        <div className="absolute -bottom-16 -left-10 h-40 w-72 rounded-[100%] bg-white/10" />
      </>
    ),
    anxiety: (
      <>
        <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/20" />
        <div className="absolute right-10 top-4 h-16 w-16 rounded-3xl bg-orange-300/60" />
      </>
    ),
    focus: (
      <>
        <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-yellow-300/70" />
        <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-3xl bg-blue-400/30" />
      </>
    ),
    compassion: (
      <>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-200/70" />
        <div className="absolute -bottom-8 left-1/2 h-24 w-24 rounded-full bg-white/40" />
      </>
    ),
    recovery: (
      <>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/40" />
        <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-3xl bg-emerald-300/40 rotate-12" />
      </>
    ),
  };
  return <>{map[category]}</>;
}
