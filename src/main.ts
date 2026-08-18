import { buildSite } from "./buildSite.js";
import { demoLesson } from "./demoLesson.js";
import { generateLesson } from "./generateLesson.js";
import { readHistory, writeHistory } from "./history.js";
import { renderCards } from "./renderCards.js";
import { londonDate } from "./time.js";

async function main(): Promise<void> {
  const isDemo = process.argv.includes("--demo");
  const { isoDate, category } = londonDate();
  const history = await readHistory();
  const recentHistory = history.slice(-14);

  console.log(`[JFSD] ${isDemo ? "Demo" : "Daily"} generation for ${isoDate} — ${category}`);

  const lesson = isDemo
    ? demoLesson(isoDate, category)
    : await generateLesson({ date: isoDate, category, recentHistory });

  console.log(`[JFSD] Topic: ${lesson.topic}`);
  const cards = await renderCards(lesson);
  await buildSite(lesson, cards);

  if (!isDemo) {
    await writeHistory(history, lesson);
  }

  console.log("[JFSD] Generated:");
  for (const card of cards) console.log(`  docs/cards/${card.file}`);
  console.log("  docs/index.html");
}

main().catch((error) => {
  console.error("[JFSD] Generation failed:", error);
  process.exitCode = 1;
});
