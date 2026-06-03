import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Kunde inte logga in med Google. Försök igen.");
      setBusy(false);
    }
  };

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setInfo("Konto skapat. Kolla din mejl för att bekräfta — sen är du inne.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link to="/" className="mb-8 text-sm font-semibold text-muted-foreground">← Tillbaka</Link>
      <div className="mb-8">
        <div className="mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-[var(--stress)] to-[var(--compassion)]" />
        <h1 className="text-3xl font-extrabold tracking-tight">
          {mode === "sign-in" ? "Välkommen tillbaka" : "Skapa konto"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Logga in så följer din historik med dig mellan telefonen, plattan och datorn.
        </p>
      </div>

      <button
        onClick={onGoogle}
        disabled={busy}
        className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-bold shadow-sm transition hover:bg-accent disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 7.1 29.3 5 24 5c-7.5 0-14 4.3-17.7 9.7z"/>
          <path fill="#4CAF50" d="M24 43c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 34 26.8 35 24 35c-5.3 0-9.7-3.5-11.3-8.3l-6.5 5C9.8 38.6 16.4 43 24 43z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l6.2 5.2C41.4 35.6 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
        </svg>
        Fortsätt med Google
      </button>

      <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        eller med mejl
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onEmail} className="mt-4 space-y-3">
        <input
          type="email"
          required
          placeholder="din@mejl.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--stress)]"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--stress)]"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && <p className="text-sm text-emerald-600">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-foreground px-4 py-3 text-sm font-bold text-background transition active:scale-[0.98] disabled:opacity-50"
        >
          {mode === "sign-in" ? "Logga in" : "Skapa konto"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          setError(null);
          setInfo(null);
        }}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "sign-in" ? "Inget konto än? Skapa ett här." : "Har du redan konto? Logga in."}
      </button>
    </div>
  );
}
