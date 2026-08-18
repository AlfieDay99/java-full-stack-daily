import type { CodeLanguage, DailyLesson } from "../types.js";
import { CARD_CSS } from "./styles.js";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function lineNumbers(count = 30): string {
  return Array.from({ length: count }, (_, index) => `<span>${index + 1}</span>`).join("");
}

export function flow(steps: string[]): string {
  return `<div class="flow">${steps
    .map(
      (step, index) =>
        `${index ? '<div class="flow-arrow">→</div>' : ""}<div class="flow-step">${escapeHtml(step)}</div>`
    )
    .join("")}</div>`;
}

const KEYWORDS: Record<CodeLanguage, Set<string>> = {
  java: new Set(["public", "private", "protected", "class", "interface", "record", "final", "static", "void", "return", "new", "if", "else", "for", "while", "try", "catch", "throw", "throws", "extends", "implements", "var", "boolean", "int", "long", "double", "true", "false", "null"]),
  typescript: new Set(["const", "let", "var", "function", "return", "export", "import", "from", "type", "interface", "class", "extends", "implements", "async", "await", "new", "if", "else", "true", "false", "null", "undefined"]),
  sql: new Set(["SELECT", "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "INSERT", "INTO", "UPDATE", "DELETE", "VALUES", "CREATE", "INDEX", "EXPLAIN", "ANALYZE", "AND", "OR", "NOT", "NULL", "AS"]),
  http: new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]),
  bash: new Set(["if", "then", "fi", "for", "do", "done", "case", "esac", "function", "export"]),
  text: new Set()
};

function highlightLine(language: CodeLanguage, line: string): string {
  if (language === "text") return escapeHtml(line || " ");

  const tokens = line.match(/(@[A-Za-z_$][\w$]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$|--.*$|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b|\s+|.)/g) ?? [];
  let commentMode = false;

  return tokens
    .map((token) => {
      if (commentMode) return `<span class="hljs-comment">${escapeHtml(token)}</span>`;
      if (token.startsWith("//") || (language === "sql" && token.startsWith("--"))) {
        commentMode = true;
        return `<span class="hljs-comment">${escapeHtml(token)}</span>`;
      }
      if (token.startsWith("@")) return `<span class="hljs-meta">${escapeHtml(token)}</span>`;
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
        return `<span class="hljs-string">${escapeHtml(token)}</span>`;
      }
      const normalised = language === "sql" || language === "http" ? token.toUpperCase() : token;
      if (KEYWORDS[language].has(normalised)) return `<span class="hljs-keyword">${escapeHtml(token)}</span>`;
      if (/^\d/.test(token)) return `<span class="hljs-number">${escapeHtml(token)}</span>`;
      if (/^[A-Z][A-Za-z0-9_$]*$/.test(token)) return `<span class="hljs-type">${escapeHtml(token)}</span>`;
      if (/^[A-Za-z_$][\w$]*$/.test(token) && token.endsWith("Service")) return `<span class="hljs-title">${escapeHtml(token)}</span>`;
      return escapeHtml(token);
    })
    .join("");
}

export function highlightedCode(language: CodeLanguage, code: string, highlightedLine: number): string {
  return code
    .split("\n")
    .map((line, index) => {
      const lineNo = index + 1;
      return `<div class="code-line${lineNo === highlightedLine ? " highlight" : ""}"><span class="ln">${lineNo}</span><span>${highlightLine(language, line || " ")}</span></div>`;
    })
    .join("");
}

export function shell(args: {
  lesson: DailyLesson;
  cardNumber: string;
  sectionLabel: string;
  content: string;
}): string {
  const topic = escapeHtml(args.lesson.topic);
  const date = escapeHtml(args.lesson.date);
  const fileName = "JavaFullStackDaily.java";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1080, initial-scale=1" />
<title>${topic} — Card ${args.cardNumber}</title>
<style>${CARD_CSS}</style>
</head>
<body>
<div class="ide">
  <header class="topbar">
    <div class="window-controls"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <div class="file-tab"><span class="java-chip">J</span>${fileName}</div>
    <div class="toolbar-spacer"></div>
    <div class="toolbar"><span class="tool-pill">▶</span><span class="tool-pill">⌕</span><span class="tool-pill">⋮</span></div>
  </header>

  <aside class="sidebar">
    <div class="side-icon active">{ }</div>
    <div class="side-icon">⌕</div>
    <div class="side-icon">Git</div>
    <div class="side-divider"></div>
    <div class="side-icon">DB</div>
    <div class="side-icon">API</div>
  </aside>

  <main class="editor">
    <div class="line-numbers">${lineNumbers()}</div>
    <section class="card">
      <div class="card-kicker">
        <div class="card-number">${args.cardNumber}</div>
        <div class="section-label">${escapeHtml(args.sectionLabel)}</div>
      </div>
      ${args.content}
      <div class="brand-signature">
        <span><span class="kw">public final class</span> <span class="class">JavaFullStackDaily</span> { }</span>
        <span>${date}</span>
      </div>
    </section>
  </main>

  <footer class="statusbar">
    <div class="status-left">✓</div>
    <div class="status-main"><span class="status-ok">● ready</span><span>${topic}</span></div>
    <div class="status-right">UTF-8 &nbsp; LF &nbsp; Java 21</div>
  </footer>
</div>
</body>
</html>`;
}
