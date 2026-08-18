export const CARD_CSS = String.raw`
:root {
  --bg: #1e1e1e;
  --chrome: #171a1f;
  --panel: #252b33;
  --panel-2: #20252c;
  --border: #3a414c;
  --border-soft: #303640;
  --text: #e6eaf2;
  --muted: #9aa3b2;
  --blue: #0d6efd;
  --cyan: #53d8fb;
  --green: #22c55e;
  --amber: #f59e0b;
  --purple: #a855f7;
  --red: #ef4444;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: var(--bg); }
body { font-family: var(--sans); color: var(--text); }

.ide {
  width: 1080px;
  height: 1920px;
  display: grid;
  grid-template-columns: 78px 1fr;
  grid-template-rows: 76px 1fr 54px;
  background:
    radial-gradient(circle at 82% 8%, rgba(13,110,253,.12), transparent 28%),
    linear-gradient(180deg, #20242a 0%, var(--bg) 20%);
}

.topbar {
  grid-column: 1 / 3;
  display: flex;
  align-items: stretch;
  background: var(--chrome);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}
.window-controls { width: 78px; display: flex; align-items: center; justify-content: center; gap: 7px; border-right: 1px solid var(--border-soft); }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #555e69; }
.file-tab { min-width: 340px; display: flex; align-items: center; gap: 12px; padding: 0 22px; border-right: 1px solid var(--border-soft); border-top: 3px solid var(--blue); background: #20242a; font: 600 20px var(--mono); color: #d7e4fb; }
.java-chip { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 6px; background: rgba(13,110,253,.16); color: #79b1ff; font: 800 15px var(--mono); border: 1px solid rgba(13,110,253,.45); }
.toolbar-spacer { flex: 1; }
.toolbar { display: flex; align-items: center; gap: 24px; padding: 0 28px; color: #77818f; font: 18px var(--mono); }
.tool-pill { height: 30px; min-width: 30px; padding: 0 10px; display: grid; place-items: center; border: 1px solid #343b45; border-radius: 6px; background: #20242a; }

.sidebar {
  grid-column: 1;
  grid-row: 2;
  background: #1a1d22;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding-top: 28px;
}
.side-icon { width: 42px; height: 42px; border-radius: 8px; display: grid; place-items: center; color: #737e8e; font: 700 17px var(--mono); border: 1px solid transparent; }
.side-icon.active { color: #9ac3ff; background: rgba(13,110,253,.11); border-color: rgba(13,110,253,.35); }
.side-divider { width: 38px; height: 1px; background: #333a44; margin: 2px 0; }

.editor {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent 0 56px, rgba(255,255,255,.025) 56px 57px, transparent 57px),
    var(--bg);
}
.line-numbers { position: absolute; left: 0; top: 22px; width: 54px; color: #59616e; font: 17px/42px var(--mono); text-align: right; padding-right: 12px; user-select: none; }
.line-numbers span { display: block; }

.card {
  position: absolute;
  inset: 0 0 0 56px;
  padding: 56px 58px 48px 52px;
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.card-kicker { display: flex; align-items: center; gap: 18px; min-height: 62px; }
.card-number { width: 60px; height: 60px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(145deg, #1680ff, #0959d8); color: white; font: 800 22px var(--mono); box-shadow: 0 0 0 6px rgba(13,110,253,.09), 0 0 28px rgba(13,110,253,.28); }
.section-label { color: #a9b1bd; letter-spacing: .14em; font: 800 18px var(--mono); text-transform: uppercase; }

h1, h2, h3, p { margin: 0; }
.title-xl { font-size: 76px; line-height: 1.04; letter-spacing: -.045em; font-weight: 850; max-width: 850px; }
.title-lg { font-size: 56px; line-height: 1.08; letter-spacing: -.035em; font-weight: 820; }
.title-md { font-size: 34px; line-height: 1.2; font-weight: 780; }
.body-lg { font-size: 30px; line-height: 1.42; color: #d6dbe4; }
.body-md { font-size: 25px; line-height: 1.45; color: #c9d0db; }
.body-sm { font-size: 21px; line-height: 1.42; color: #b4bdca; }
.muted { color: var(--muted); }
.mono { font-family: var(--mono); }

.hero-token { font: 800 68px/1.1 var(--mono); color: #d2c4ff; padding: 28px 32px; border-radius: 18px; border: 1px solid rgba(168,85,247,.35); background: linear-gradient(135deg, rgba(168,85,247,.13), rgba(13,110,253,.08)); box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 50px rgba(0,0,0,.22); overflow-wrap: anywhere; }
.hook-panel { border-left: 5px solid var(--blue); background: rgba(13,110,253,.075); border-radius: 12px; padding: 26px 28px; }
.caption { color: #8ea7c8; font: 600 20px/1.4 var(--mono); }

.panel { background: linear-gradient(180deg, rgba(39,45,54,.96), rgba(32,37,44,.96)); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 45px rgba(0,0,0,.18); }
.panel-pad { padding: 28px 30px; }
.panel-title { font: 800 17px var(--mono); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 16px; }
.panel.info { border-left: 4px solid var(--blue); }
.panel.good { border-left: 4px solid var(--green); }
.panel.warn { border-left: 4px solid var(--amber); }
.panel.interview { border-left: 4px solid var(--purple); }
.panel.error { border-left: 4px solid var(--red); }
.info .panel-title { color: #76aaff; }
.good .panel-title { color: #74da95; }
.warn .panel-title { color: #f7bc56; }
.interview .panel-title { color: #c090ff; }
.error .panel-title { color: #ff8787; }

.flow-box { padding: 26px; }
.flow-label { font: 800 16px var(--mono); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 22px; }
.flow-label.good { color: #70dc93; }
.flow-label.warn { color: #f7bc56; }
.flow-label.info { color: #7bb0ff; }
.flow { display: flex; align-items: stretch; gap: 10px; width: 100%; }
.flow-step { flex: 1 1 0; min-width: 0; min-height: 112px; padding: 15px 10px; border: 1px solid #3b4654; border-radius: 12px; background: #20252c; display: flex; align-items: center; justify-content: center; text-align: center; font: 700 17px/1.22 var(--mono); color: #d8e0ea; overflow-wrap: anywhere; }
.flow-arrow { flex: 0 0 24px; display: grid; place-items: center; color: #647185; font: 700 24px var(--mono); }

.code-window { overflow: hidden; border-radius: 16px; border: 1px solid #3b424c; background: #181b20; box-shadow: 0 22px 55px rgba(0,0,0,.28); }
.code-titlebar { height: 50px; display: flex; align-items: center; gap: 9px; padding: 0 18px; border-bottom: 1px solid #303640; background: #20242a; color: #8993a1; font: 600 16px var(--mono); }
.code-titlebar .mini-dot { width: 9px; height: 9px; border-radius: 50%; background: #48515c; }
.code-lines { padding: 22px 0 24px; font: 22px/1.55 var(--mono); }
.code-line { min-height: 34px; display: grid; grid-template-columns: 54px 1fr; padding-right: 22px; white-space: pre-wrap; overflow-wrap: anywhere; }
.code-line .ln { color: #59616e; text-align: right; padding-right: 16px; user-select: none; }
.code-line.highlight { background: linear-gradient(90deg, rgba(245,158,11,.16), rgba(245,158,11,.05)); box-shadow: inset 4px 0 0 var(--amber); }
.code-line.highlight .ln { color: #f0ad3d; }
.hljs-keyword, .hljs-selector-tag { color: #c678dd; }
.hljs-title, .hljs-title.class_, .hljs-type, .hljs-built_in { color: #56b6c2; }
.hljs-string, .hljs-attr { color: #98c379; }
.hljs-number, .hljs-literal { color: #d19a66; }
.hljs-comment { color: #6f7a89; font-style: italic; }
.hljs-meta, .hljs-annotation { color: #e5c07b; }
.hljs-function .hljs-title, .hljs-title.function_ { color: #61afef; }
.hljs-variable, .hljs-params { color: #e6eaf2; }

.problem-list { display: grid; gap: 18px; }
.problem { display: grid; grid-template-columns: 44px 1fr; gap: 16px; align-items: start; padding: 22px 24px; border-radius: 14px; background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.28); }
.problem-mark { width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; background: rgba(245,158,11,.15); color: var(--amber); font: 900 18px var(--mono); }

.remember-list { display: grid; gap: 13px; }
.remember-item { display: flex; gap: 14px; align-items: flex-start; font-size: 22px; line-height: 1.38; }
.remember-dot { width: 10px; height: 10px; margin-top: 10px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 14px rgba(83,216,251,.55); flex: 0 0 auto; }

.spacer { flex: 1; }
.brand-signature { margin-top: auto; padding-top: 20px; border-top: 1px solid #333a44; font: 600 18px var(--mono); color: #8791a0; display: flex; justify-content: space-between; gap: 20px; }
.brand-signature .kw { color: #c678dd; }
.brand-signature .class { color: #56b6c2; }

.statusbar { grid-column: 1 / 3; grid-row: 3; display: grid; grid-template-columns: 78px 1fr auto; align-items: center; background: #171a1f; border-top: 1px solid var(--border); color: #727c89; font: 15px var(--mono); }
.status-left { height: 100%; border-right: 1px solid var(--border-soft); display: grid; place-items: center; color: #5a9cff; }
.status-main { padding-left: 20px; display: flex; gap: 18px; align-items: center; }
.status-right { padding: 0 20px; color: #8893a2; }
.status-ok { color: #65d688; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
.stack { display: grid; gap: 22px; }
.rule { height: 1px; background: linear-gradient(90deg, #39414b, transparent); }
.accent-blue { color: #78adff; }
.accent-cyan { color: var(--cyan); }
.accent-green { color: #6ddd91; }
.accent-amber { color: #f7b74a; }
.accent-purple { color: #c092ff; }

@media (prefers-reduced-motion: no-preference) {
  .card-number { animation: none; }
}
`;
