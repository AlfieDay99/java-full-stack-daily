import OpenAI from "openai";
import { LESSON_SCHEMA } from "./schema.js";
import { buildPrompt } from "./prompt.js";
import type { DailyLesson, HistoryEntry, WeekdayCategory } from "./types.js";

function assertLesson(value: unknown): asserts value is DailyLesson {
  if (!value || typeof value !== "object") throw new Error("Lesson is not an object.");
  const lesson = value as Record<string, unknown>;
  for (const key of ["date", "topic", "tomorrowTopic", "category", "hook", "mentalModel", "code", "production", "interview"]) {
    if (!(key in lesson)) throw new Error(`Lesson is missing required field: ${key}`);
  }

  const code = lesson.code as { code?: unknown; highlightLine?: unknown };
  if (typeof code.code !== "string" || typeof code.highlightLine !== "number") {
    throw new Error("Invalid code card returned by model.");
  }
  const lineCount = code.code.split("\n").length;
  if (code.highlightLine < 1 || code.highlightLine > lineCount) {
    throw new Error(`highlightLine ${code.highlightLine} is outside code block (${lineCount} lines).`);
  }
}

export async function generateLesson(args: {
  date: string;
  category: WeekdayCategory;
  recentHistory: HistoryEntry[];
}): Promise<DailyLesson> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Use npm run demo for a no-API preview.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-terra";
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a precise senior Java Full Stack mentor and technical editor. Return structured lesson data only."
      },
      {
        role: "user",
        content: buildPrompt(args)
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "java_full_stack_daily_lesson",
        strict: true,
        schema: LESSON_SCHEMA
      }
    }
  });

  const message = completion.choices[0]?.message;
  if (!message) throw new Error("OpenAI returned no message.");
  if (message.refusal) throw new Error(`OpenAI refused the lesson request: ${message.refusal}`);
  if (!message.content) throw new Error("OpenAI returned no structured lesson content.");

  const parsed: unknown = JSON.parse(message.content);
  assertLesson(parsed);

  // The application owns today's date/category; do not let model drift override them.
  parsed.date = args.date;
  parsed.category = args.category;
  parsed.interview.tomorrow = parsed.tomorrowTopic;

  // Keep renderer assumptions deterministic.
  parsed.mentalModel.primaryFlow = parsed.mentalModel.primaryFlow.slice(0, 6);
  parsed.mentalModel.secondaryFlow = parsed.mentalModel.secondaryFlow.slice(0, 6);
  parsed.production.problems = parsed.production.problems.slice(0, 2);
  parsed.production.flow = parsed.production.flow.slice(0, 6);
  parsed.interview.remember = parsed.interview.remember.slice(0, 3);

  return parsed;
}
