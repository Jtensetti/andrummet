import { createFileRoute } from "@tanstack/react-router";
import { useHistory } from "@/lib/history";

export const Route = createFileRoute("/reflektion")({
  head: () => ({
    meta: [{ title: "Reflektioner – Andrum" }],
  }),
  component: Page,
});

function Page() {
  const history = useHistory();
  const withRef = history.filter((h) => h.reflection);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6 md:px-10 md:pt-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Reflektioner</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Korta tankar du lämnat efter övningar.
      </p>

      {withRef.length === 0 ? (
        <div className="mt-10 rounded-3xl border bg-card p-8 text-center">
          <p className="text-lg font-bold">Inget skrivet än.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Du har inte skrivit något än. Fullt rimligt. Alla tankar behöver inte bli dokument.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {withRef.map((h) => (
            <li key={h.id} className="rounded-2xl border bg-card p-4">
              <p className="text-sm font-bold">{h.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(h.completedAt).toLocaleDateString("sv-SE", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-2 text-sm">{h.reflection}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
