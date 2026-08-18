import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DailyLesson } from "./types.js";
import { renderAllCards } from "./render/templates.js";

const OUTPUT_DIR = path.resolve("docs/cards");
const DEBUG_DIR = path.resolve(".render-debug");

export async function renderCards(lesson: DailyLesson): Promise<Array<{ file: string; label: string }>> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(DEBUG_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const cards = renderAllCards(lesson);

  try {
    for (const card of cards) {
      const debugPath = path.join(DEBUG_DIR, card.file.replace(/\.png$/, ".html"));
      await writeFile(debugPath, card.html, "utf8");
      await page.setContent(card.html, { waitUntil: "load" });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.screenshot({
        path: path.join(OUTPUT_DIR, card.file),
        type: "png",
        fullPage: false
      });
    }
  } finally {
    await browser.close();
  }

  return cards.map(({ file, label }) => ({ file, label }));
}
