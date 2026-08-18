import type { WeekdayCategory } from "./types.js";

const CATEGORY_BY_WEEKDAY: Record<string, WeekdayCategory> = {
  Monday: "Monday — Fundamentals",
  Tuesday: "Tuesday — Core Working Knowledge",
  Wednesday: "Wednesday — Professional Engineering",
  Thursday: "Thursday — Engineering Judgement",
  Friday: "Friday — Interview Challenge",
  Saturday: "Saturday — Practical Engineering",
  Sunday: "Sunday — Weekly Consolidation"
};

export function londonDate(now = new Date()): { isoDate: string; weekday: string; category: WeekdayCategory } {
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long"
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((item) => item.type === type)?.value ?? "";

  const weekday = part("weekday");
  const isoDate = `${part("year")}-${part("month")}-${part("day")}`;
  const category = CATEGORY_BY_WEEKDAY[weekday];

  if (!category) {
    throw new Error(`Unable to determine weekday category for: ${weekday}`);
  }

  return { isoDate, weekday, category };
}
