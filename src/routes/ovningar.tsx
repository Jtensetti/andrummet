import { createFileRoute } from "@tanstack/react-router";
import { EXERCISES, CATEGORY_LABELS, type Category } from "@/lib/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useState } from "react";

export const Route = createFileRoute("/ovningar")({
  head: () => ({
    meta: [
      { title: "Övningar – Andrum" },
      { name: "description", content: "Bläddra bland korta andnings-, fokus- och mindfulnessövningar." },
    ],
  }),
  component: Page,
});

function Page() {
  const [cat, setCat] = useState<Category | "all">("all");
  const list = cat === "all" ? EXERCISES : EXERCISES.filter((e) => e.category === cat);
  const cats: (Category | "all")[] = ["all", "calm", "stress", "anxiety", "focus", "sleep", "compassion", "recovery"];

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 md:px-10 md:pt-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Övningar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Välj en. Du behöver inte göra alla idag.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              cat === c
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {c === "all" ? "Alla" : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((ex) => (
          <ExerciseCard key={ex.id} ex={ex} />
        ))}
      </div>
    </div>
  );
}
