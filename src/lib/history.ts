import { useEffect, useState } from "react";
import type { Category, RatingMetric } from "./exercises";
import { supabase } from "@/integrations/supabase/client";

export interface HistoryEntry {
  id: string;
  exerciseId: string;
  title: string;
  category: Category;
  minutes: number;
  metric: RatingMetric;
  ratingBefore?: number;
  ratingAfter?: number;
  reflection?: string;
  completedAt: number;
}

const KEY = "andrum.history.v1";

function readLocal(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

function writeLocal(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("andrum:history"));
}

type Row = {
  id: string;
  exercise_id: string;
  title: string;
  category: string;
  minutes: number;
  metric: string;
  rating_before: number | null;
  rating_after: number | null;
  reflection: string | null;
  completed_at: string;
};

function rowToEntry(r: Row): HistoryEntry {
  return {
    id: r.id,
    exerciseId: r.exercise_id,
    title: r.title,
    category: r.category as Category,
    minutes: Number(r.minutes),
    metric: r.metric as RatingMetric,
    ratingBefore: r.rating_before ?? undefined,
    ratingAfter: r.rating_after ?? undefined,
    reflection: r.reflection ?? undefined,
    completedAt: new Date(r.completed_at).getTime(),
  };
}

async function syncLocalToCloud(userId: string) {
  const local = readLocal();
  if (!local.length) return;
  const rows = local.map((e) => ({
    user_id: userId,
    exercise_id: e.exerciseId,
    title: e.title,
    category: e.category,
    minutes: e.minutes,
    metric: e.metric,
    rating_before: e.ratingBefore ?? null,
    rating_after: e.ratingAfter ?? null,
    reflection: e.reflection ?? null,
    completed_at: new Date(e.completedAt).toISOString(),
  }));
  const { error } = await supabase.from("sessions").insert(rows);
  if (!error) {
    localStorage.removeItem(KEY);
  }
}

export async function addEntry(entry: HistoryEntry) {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { error } = await supabase.from("sessions").insert({
      user_id: session.user.id,
      exercise_id: entry.exerciseId,
      title: entry.title,
      category: entry.category,
      minutes: entry.minutes,
      metric: entry.metric,
      rating_before: entry.ratingBefore ?? null,
      rating_after: entry.ratingAfter ?? null,
      reflection: entry.reflection ?? null,
      completed_at: new Date(entry.completedAt).toISOString(),
    });
    if (error) {
      // Fallback: spara lokalt så datat inte tappas
      const list = readLocal();
      list.unshift(entry);
      writeLocal(list.slice(0, 500));
      return;
    }
    window.dispatchEvent(new Event("andrum:history"));
    return;
  }
  const list = readLocal();
  list.unshift(entry);
  writeLocal(list.slice(0, 500));
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadGuest = () => {
      if (!cancelled) setEntries(readLocal());
    };

    const loadCloud = async (userId: string) => {
      await syncLocalToCloud(userId);
      const { data } = await supabase
        .from("sessions")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(500);
      if (!cancelled) setEntries((data as Row[] | null)?.map(rowToEntry) ?? []);
    };

    const setup = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadCloud(session.user.id);
        channel = supabase
          .channel("sessions-sync")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "sessions", filter: `user_id=eq.${session.user.id}` },
            () => loadCloud(session.user.id),
          )
          .subscribe();
      } else {
        loadGuest();
      }
    };
    setup();

    const onLocal = () => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) loadCloud(data.session.user.id);
        else loadGuest();
      });
    };
    window.addEventListener("andrum:history", onLocal);
    window.addEventListener("storage", onLocal);

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
      if (s?.user) {
        loadCloud(s.user.id).then(() => {
          channel = supabase
            .channel("sessions-sync")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "sessions", filter: `user_id=eq.${s.user.id}` },
              () => loadCloud(s.user.id),
            )
            .subscribe();
        });
      } else {
        loadGuest();
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("andrum:history", onLocal);
      window.removeEventListener("storage", onLocal);
      sub.subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return entries;
}
