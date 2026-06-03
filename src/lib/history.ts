import { useEffect, useState } from "react";
import type { Category, RatingMetric } from "./exercises";

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

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("andrum:history"));
}

export function addEntry(entry: HistoryEntry) {
  const list = read();
  list.unshift(entry);
  write(list.slice(0, 500));
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    setEntries(read());
    const onChange = () => setEntries(read());
    window.addEventListener("andrum:history", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("andrum:history", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return entries;
}
