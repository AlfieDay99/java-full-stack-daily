import OpenAI from "openai";
import { LESSON_SCHEMA } from "./schema.js";
import { buildPrompt, buildReviewPrompt } from "./prompt.js";
import type { DailyLesson, HistoryEntry, WeekdayCategory } from "./types.js";

function assertLesson(value: unknown): asserts value is DailyLesson {
  if (!value || typeof value !== "object") throw new Error("Lesson is not an object.");
  const lesson = value as Record<string, unknown>;
  for (const key of ["date", "topic", "tomorrowTopic", "category", "hook", "mentalModel", "code", "production", "interview"]) {
    if (!(key in lesson)) throw new Error(`Lesson is missing required field: ${key}`);
  }

  const mentalModel = lesson.mentalModel as {
    primaryFlow?: unknown;
    secondaryFlow?: unknown;
    mentalShortcut?: unknown;
  };
  if (!Array.isArray(mentalModel.primaryFlow) || !Array.isArray(mentalModel.secondaryFlow)) {
    throw new Error("Invalid mental-model flows returned by model.");
  }
  if (mentalModel.primaryFlow.length < 2 || mentalModel.primaryFlow.length > 6) {
    throw new Error("Primary mental-model flow must contain 2–6 steps.");
  }
  if (mentalModel.secondaryFlow.length < 2 || mentalModel.secondaryFlow.length > 6) {
    throw new Error("Secondary mental-model flow must contain 2–6 steps.");
  }
  if (typeof mentalModel.mentalShortcut !== "string" || !mentalModel.mentalShortcut.trim()) {
    throw new Error("Lesson is missing a topic-specific mentalShortcut.");
  }

  const code = lesson.code as { code?: unknown; highlightLine?: unknown };
  if (typeof code.code !== "string" || typeof code.highlightLine !== "number") {
    throw new Error("Invalid code card returned by model.");
  }
  const lineCount = code.code.split("\n").length;
  if (code.highlightLine < 1 || code.highlightLine > lineCount) {
    throw new Error(`highlightLine ${code.highlightLine} is outside code block (${lineCount} lines).`);
  }

  const production = lesson.production as { problems?: unknown; flow?: unknown };
  if (!Array.isArray(production.problems) || production.problems.length < 1 || production.problems.length > 2) {
    throw new Error("Production card must contain 1–2 problems.");
  }
  if (!Array.isArray(production.flow) || production.flow.length < 3 || production.flow.length > 6) {
    throw new Error("Production card must contain a 3–6 step runtime flow.");
  }

  const interview = lesson.interview as { remember?: unknown };
  if (!Array.isArray(interview.remember) || interview.remember.length !== 3) {
    throw new Error("Interview card must contain exactly three remember points.");
  }
}

async function requestStructuredLesson(args: {
  client: OpenAI;
  model: string;
  system: string;
  user: string;
  schemaName: string;
}): Promise<DailyLesson> {
  const completion = await args.client.chat.completions.create({
    model: args.model,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: args.schemaName,
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
  return parsed;
}

function normaliseLesson(
  lesson: DailyLesson,
  args: { date: string; category: WeekdayCategory }
): DailyLesson {
  // The application owns today's date/category; do not let either model pass drift override them.
  lesson.date = args.date;
  lesson.category = args.category;
  lesson.interview.tomorrow = lesson.tomorrowTopic;

  // Keep renderer assumptions deterministic even if a future schema/model is more permissive.
  lesson.mentalModel.primaryFlow = lesson.mentalModel.primaryFlow.slice(0, 6);
  lesson.mentalModel.secondaryFlow = lesson.mentalModel.secondaryFlow.slice(0, 6);
  lesson.production.problems = lesson.production.problems.slice(0, 2);
  lesson.production.flow = lesson.production.flow.slice(0, 6);
  lesson.interview.remember = lesson.interview.remember.slice(0, 3);

  return lesson;
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
  // Correctness matters more than cost for the final pass. OPENAI_REVIEW_MODEL can override this.
  const reviewModel = process.env.OPENAI_REVIEW_MODEL || "gpt-5.6";
  const client = new OpenAI({ apiKey });

  const draft = normaliseLesson(
    await requestStructuredLesson({
      client,
      model,
      schemaName: "java_full_stack_daily_draft",
      system:
        "You are a precise senior Java Full Stack mentor and curriculum editor. Accuracy is more important than brevity or punchiness. Return structured lesson data only.",
      user: buildPrompt(args)
    }),
    args
  );

  // A second independent pass is mandatory: unreviewed model content is never published.
  const reviewed = normaliseLesson(
    await requestStructuredLesson({
      client,
      model: reviewModel,
      schemaName: "java_full_stack_daily_reviewed_lesson",
      system:
        "You are a meticulous senior Java Full Stack technical reviewer. Correct misleading claims, framework/specification confusion, unsafe absolutes and code mistakes. Return the full corrected structured lesson only.",
      user: buildReviewPrompt({ date: args.date, category: args.category, draft })
    }),
    args
  );

  // Re-validate the final reviewed content after normalisation. If review fails, fail the workflow
  // rather than silently publishing the unreviewed draft.
  assertLesson(reviewed);
  return reviewed;
}
