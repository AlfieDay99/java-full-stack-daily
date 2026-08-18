import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DailyLesson, HistoryEntry } from "./types.js";

const HISTORY_PATH = path.resolve("data/history.json");

export async function readHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await readFile(HISTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeHistory(history: HistoryEntry[], lesson: DailyLesson): Promise<void> {
  const withoutToday = history.filter((entry) => entry.date !== lesson.date);
  withoutToday.push({ date: lesson.date, topic: lesson.topic, category: lesson.category });
  const trimmed = withoutToday.slice(-60);
  await writeFile(HISTORY_PATH, `${JSON.stringify(trimmed, null, 2)}\n`, "utf8");
}
