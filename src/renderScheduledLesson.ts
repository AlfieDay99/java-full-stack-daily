import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildSite } from "./buildSite.js";
import { readHistory, writeHistory } from "./history.js";
import { renderCards } from "./renderCards.js";
import { londonDate } from "./time.js";
import type { CodeLanguage, DailyLesson, WeekdayCategory } from "./types.js";

const INPUT_PATH = path.resolve(process.env.JFSD_LESSON_PATH ?? "data/daily-lesson.json");

const CATEGORIES: WeekdayCategory[] = [
  "Monday — Fundamentals",
  "Tuesday — Core Working Knowledge",
  "Wednesday — Professional Engineering",
  "Thursday — Engineering Judgement",
  "Friday — Interview Challenge",
  "Saturday — Practical Engineering",
  "Sunday — Weekly Consolidation"
];

const CODE_LANGUAGES: CodeLanguage[] = ["java", "typescript", "sql", "http", "bash", "text"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(parent: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = parent[key];
  if (!isRecord(value)) throw new Error(`Expected ${key} to be an object.`);
  return value;
}

function requireString(parent: Record<string, unknown>, key: string, label = key): string {
  const value = parent[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`Expected ${label} to be a non-empty string.`);
  return value;
}

function requireStringArray(
  parent: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
  label = key
): string[] {
  const value = parent[key];
  if (!Array.isArray(value) || value.length < min) {
    throw new Error(`Expected ${label} to contain at least ${min} item${min === 1 ? "" : "s"}.`);
  }
  if (!value.every((item) => typeof item === "string" && item.trim())) {
    throw new Error(`Expected every item in ${label} to be a non-empty string.`);
  }

  if (value.length > max) {
    console.warn(`[JFSD] ${label} contains ${value.length} items; using the first ${max}.`);
    const trimmed = value.slice(0, max) as string[];
    parent[key] = trimmed;
    return trimmed;
  }

  return value as string[];
}

function parseLesson(value: unknown): DailyLesson {
  if (!isRecord(value)) throw new Error("Scheduled lesson JSON must contain one lesson object.");

  requireString(value, "date");
  requireString(value, "topic");
  requireString(value, "tomorrowTopic");
  const category = requireString(value, "category");
  if (!CATEGORIES.includes(category as WeekdayCategory)) throw new Error(`Unknown lesson category: ${category}`);

  const hook = requireRecord(value, "hook");
  for (const key of ["headline", "hook", "heroToken", "visualCaption", "microExample"]) {
    requireString(hook, key, `hook.${key}`);
  }

  const mentalModel = requireRecord(value, "mentalModel");
  for (const key of ["title", "coreIdea", "primaryLabel", "secondaryLabel", "keyOutcome", "mentalShortcut"]) {
    requireString(mentalModel, key, `mentalModel.${key}`);
  }
  requireStringArray(mentalModel, "primaryFlow", 2, 6, "mentalModel.primaryFlow");
  requireStringArray(mentalModel, "secondaryFlow", 2, 6, "mentalModel.secondaryFlow");

  const code = requireRecord(value, "code");
  for (const key of ["title", "intro", "code", "highlightReason", "takeaway", "professionalNote"]) {
    requireString(code, key, `code.${key}`);
  }
  const language = requireString(code, "language", "code.language");
  if (!CODE_LANGUAGES.includes(language as CodeLanguage)) throw new Error(`Unsupported code language: ${language}`);
  const highlightLine = code.highlightLine;
  if (typeof highlightLine !== "number" || !Number.isInteger(highlightLine)) {
    throw new Error("code.highlightLine must be an integer.");
  }
  const lineCount = (code.code as string).split("\n").length;
  if (highlightLine < 1 || highlightLine > lineCount) {
    throw new Error(`code.highlightLine ${highlightLine} is outside the ${lineCount}-line code block.`);
  }

  const production = requireRecord(value, "production");
  for (const key of ["title", "scenario", "professionalApproach", "debugClue"]) {
    requireString(production, key, `production.${key}`);
  }
  requireStringArray(production, "problems", 1, 2, "production.problems");
  requireStringArray(production, "flow", 3, 6, "production.flow");

  const interview = requireRecord(value, "interview");
  for (const key of ["question", "answer", "tomorrow", "interviewerTesting"]) {
    requireString(interview, key, `interview.${key}`);
  }
  requireStringArray(interview, "remember", 3, 3, "interview.remember");

  return value as unknown as DailyLesson;
}

async function main(): Promise<void> {
  const raw = await readFile(INPUT_PATH, "utf8");
  const lesson = parseLesson(JSON.parse(raw) as unknown);
  const { isoDate, category } = londonDate();

  if (lesson.date !== isoDate) {
    throw new Error(`Scheduled lesson date is ${lesson.date}; expected today's Europe/London date ${isoDate}.`);
  }
  if (lesson.category !== category) {
    throw new Error(`Scheduled lesson category is ${lesson.category}; expected ${category}.`);
  }

  // Keep the two tomorrow fields consistent even if the scheduled task drifts.
  lesson.interview.tomorrow = lesson.tomorrowTopic;

  console.log(`[JFSD] Rendering scheduled ChatGPT lesson for ${lesson.date} — ${lesson.category}`);
  console.log(`[JFSD] Topic: ${lesson.topic}`);

  const cards = await renderCards(lesson);
  await buildSite(lesson, cards);

  const history = await readHistory();
  await writeHistory(history, lesson);

  console.log("[JFSD] Generated from data/daily-lesson.json:");
  for (const card of cards) console.log(`  docs/cards/${card.file}`);
  console.log("  docs/index.html");
}

main().catch((error) => {
  console.error("[JFSD] Scheduled render failed:", error);
  process.exitCode = 1;
});
