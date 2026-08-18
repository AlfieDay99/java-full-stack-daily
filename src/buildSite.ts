import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DailyLesson } from "./types.js";

export async function buildSite(
  lesson: DailyLesson,
  cards: Array<{ file: string; label: string }>
): Promise<void> {
  await mkdir(path.resolve("docs"), { recursive: true });

  const slides = cards
    .map(
      (card, index) => `
      <article class="slide" id="card-${index + 1}">
        <img src="cards/${card.file}" alt="JAVA FULL STACK DAILY — ${card.label}" />
        <div class="slide-caption"><strong>${String(index + 1).padStart(2, "0")}</strong><span>${card.label}</span></div>
      </article>`
    )
    .join("");

  const indexHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#171a1f" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="JFSD" />
<title>JAVA FULL STACK DAILY — ${escapeHtml(lesson.topic)}</title>
<style>
:root { --bg:#111318; --panel:#1b1f26; --text:#eef2f8; --muted:#9aa3b2; --blue:#0d6efd; }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; background:var(--bg); }
body { margin:0; min-height:100vh; background:radial-gradient(circle at 50% 0, rgba(13,110,253,.13), transparent 30%), var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; }
header { max-width:1120px; margin:0 auto; padding:28px 20px 18px; }
.eyebrow { color:#74aaff; font:700 12px ui-monospace,monospace; letter-spacing:.14em; text-transform:uppercase; }
h1 { margin:8px 0 4px; font-size:clamp(24px,5vw,40px); line-height:1.1; }
.meta { color:var(--muted); font-size:14px; display:flex; gap:10px; flex-wrap:wrap; }
.swipe { color:#8db7f7; font-size:13px; margin-top:12px; }
.deck { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:18px; padding:0 max(16px, calc((100vw - 520px)/2)) 36px; scrollbar-width:none; }
.deck::-webkit-scrollbar { display:none; }
.slide { scroll-snap-align:center; flex:0 0 min(90vw, 500px); margin:0; }
.slide img { width:100%; aspect-ratio:9/16; object-fit:cover; border-radius:20px; display:block; background:#1e1e1e; box-shadow:0 22px 70px rgba(0,0,0,.38); border:1px solid #2c333d; }
.slide-caption { display:flex; align-items:center; gap:10px; padding:12px 4px 0; color:var(--muted); font-size:13px; }
.slide-caption strong { color:#76aaff; font-family:ui-monospace,monospace; }
footer { color:#68717e; text-align:center; font:12px ui-monospace,monospace; padding:6px 16px 32px; }
</style>
</head>
<body>
<header>
  <div class="eyebrow">JavaFullStackDaily.java</div>
  <h1>${escapeHtml(lesson.topic)}</h1>
  <div class="meta"><span>${escapeHtml(lesson.date)}</span><span>•</span><span>${escapeHtml(lesson.category)}</span></div>
  <div class="swipe">Swipe through 5 cards →</div>
</header>
<main class="deck">${slides}</main>
<footer>public final class JavaFullStackDaily { }</footer>
</body>
</html>`;

  await writeFile(path.resolve("docs/index.html"), indexHtml, "utf8");
  await writeFile(path.resolve("docs/lesson.json"), `${JSON.stringify(lesson, null, 2)}\n`, "utf8");
  await writeFile(path.resolve("docs/.nojekyll"), "", "utf8");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
