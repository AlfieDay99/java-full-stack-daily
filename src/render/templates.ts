import type { DailyLesson } from "../types.js";
import { escapeHtml, flow, highlightedCode, shell } from "./common.js";

function categoryLabel(category: string): string {
  return category.toUpperCase();
}

export function renderHookCard(lesson: DailyLesson): string {
  return shell({
    lesson,
    cardNumber: "01",
    sectionLabel: categoryLabel(lesson.category),
    content: `
      <div class="stack hook-stack" style="gap:30px; padding-top:12px;">
        <h1 class="title-xl">${escapeHtml(lesson.hook.headline)}</h1>
        <div class="hero-token">${escapeHtml(lesson.hook.heroToken)}</div>
        <div class="hook-panel"><p class="body-lg">${escapeHtml(lesson.hook.hook)}</p></div>
        <div class="micro-example">
          <div class="panel-title">QUICK EXAMPLE</div>
          <div class="micro-example-text">${escapeHtml(lesson.hook.microExample)}</div>
        </div>
        <div class="panel info panel-pad">
          <div class="panel-title">WHY THIS MATTERS</div>
          <p class="caption">${escapeHtml(lesson.hook.visualCaption)}</p>
        </div>
      </div>
      <div class="spacer"></div>`
  });
}

export function renderMentalModelCard(lesson: DailyLesson): string {
  return shell({
    lesson,
    cardNumber: "02",
    sectionLabel: "MENTAL MODEL",
    content: `
      <div class="stack mental-stack" style="gap:28px;">
        <h1 class="title-lg">${escapeHtml(lesson.mentalModel.title)}</h1>
        <p class="body-md">${escapeHtml(lesson.mentalModel.coreIdea)}</p>
        <div class="panel flow-box good">
          <div class="flow-label good">${escapeHtml(lesson.mentalModel.primaryLabel)}</div>
          ${flow(lesson.mentalModel.primaryFlow)}
        </div>
        <div class="panel flow-box warn">
          <div class="flow-label warn">${escapeHtml(lesson.mentalModel.secondaryLabel)}</div>
          ${flow(lesson.mentalModel.secondaryFlow)}
        </div>
        <div class="key-outcome">
          <div class="panel-title">KEY OUTCOME</div>
          <p class="body-md">${escapeHtml(lesson.mentalModel.keyOutcome)}</p>
        </div>
        <div class="panel info panel-pad mental-shortcut">
          <div class="panel-title">MENTAL MODEL</div>
          <p class="body-sm"><span class="accent-cyan mono">boundary → interception → behaviour</span></p>
        </div>
      </div>
      <div class="spacer"></div>`
  });
}

export function renderCodeCard(lesson: DailyLesson): string {
  return shell({
    lesson,
    cardNumber: "03",
    sectionLabel: "SEE IT IN CODE",
    content: `
      <div class="stack code-stack" style="gap:24px;">
        <h1 class="title-lg">${escapeHtml(lesson.code.title)}</h1>
        <p class="body-md">${escapeHtml(lesson.code.intro)}</p>
        <div class="code-window">
          <div class="code-titlebar"><span class="mini-dot"></span><span class="mini-dot"></span><span class="mini-dot"></span><span style="margin-left:10px;">Example.${lesson.code.language === "java" ? "java" : lesson.code.language}</span></div>
          <div class="code-lines">${highlightedCode(lesson.code.language, lesson.code.code, lesson.code.highlightLine)}</div>
        </div>
        <div class="panel warn panel-pad">
          <div class="panel-title">HIGHLIGHT</div>
          <p class="body-sm">${escapeHtml(lesson.code.highlightReason)}</p>
        </div>
        <div class="panel info panel-pad">
          <div class="panel-title">PROFESSIONAL NOTE</div>
          <p class="body-sm">${escapeHtml(lesson.code.professionalNote)}</p>
        </div>
        <div class="panel good panel-pad">
          <div class="panel-title">TAKEAWAY</div>
          <p class="body-sm">${escapeHtml(lesson.code.takeaway)}</p>
        </div>
      </div>
      <div class="spacer"></div>`
  });
}

export function renderProductionCard(lesson: DailyLesson): string {
  const problems = lesson.production.problems
    .map(
      (problem, index) => `
        <div class="problem">
          <div class="problem-mark">${index + 1}</div>
          <div class="body-sm">${escapeHtml(problem)}</div>
        </div>`
    )
    .join("");

  return shell({
    lesson,
    cardNumber: "04",
    sectionLabel: "PRODUCTION REALITY",
    content: `
      <div class="stack production-stack" style="gap:23px;">
        <h1 class="title-lg">${escapeHtml(lesson.production.title)}</h1>
        <div class="panel info panel-pad">
          <div class="panel-title">SCENARIO</div>
          <p class="body-md">${escapeHtml(lesson.production.scenario)}</p>
        </div>
        <div class="panel flow-box info">
          <div class="flow-label info">RUNTIME PATH</div>
          ${flow(lesson.production.flow)}
        </div>
        <div class="problem-list">${problems}</div>
        <div class="debug-clue">
          <div class="panel-title">DEBUG CLUE</div>
          <p class="body-sm">${escapeHtml(lesson.production.debugClue)}</p>
        </div>
        <div class="panel good panel-pad">
          <div class="panel-title">PROFESSIONAL APPROACH</div>
          <p class="body-sm">${escapeHtml(lesson.production.professionalApproach)}</p>
        </div>
      </div>
      <div class="spacer"></div>`
  });
}

export function renderInterviewCard(lesson: DailyLesson): string {
  const remember = lesson.interview.remember
    .map(
      (item) => `<div class="remember-item"><span class="remember-dot"></span><span>${escapeHtml(item)}</span></div>`
    )
    .join("");

  return shell({
    lesson,
    cardNumber: "05",
    sectionLabel: "INTERVIEW + REMEMBER",
    content: `
      <div class="stack interview-stack" style="gap:24px;">
        <div class="panel interview panel-pad">
          <div class="panel-title">INTERVIEW CHECK</div>
          <h1 class="title-md">${escapeHtml(lesson.interview.question)}</h1>
        </div>
        <div class="panel info panel-pad">
          <div class="panel-title">STRONG ANSWER</div>
          <p class="body-md">${escapeHtml(lesson.interview.answer)}</p>
        </div>
        <div class="interviewer-testing">
          <div class="panel-title">WHAT THEY'RE TESTING</div>
          <p class="body-sm">${escapeHtml(lesson.interview.interviewerTesting)}</p>
        </div>
        <div class="panel interview panel-pad">
          <div class="panel-title">REMEMBER</div>
          <div class="remember-list">${remember}</div>
        </div>
        <div class="panel warn panel-pad">
          <div class="panel-title">TOMORROW</div>
          <p class="body-sm">${escapeHtml(lesson.interview.tomorrow)}</p>
        </div>
      </div>
      <div class="spacer"></div>`
  });
}

export function renderAllCards(lesson: DailyLesson): Array<{ file: string; html: string; label: string }> {
  return [
    { file: "01-hook.png", html: renderHookCard(lesson), label: "Hook" },
    { file: "02-mental-model.png", html: renderMentalModelCard(lesson), label: "Mental model" },
    { file: "03-code.png", html: renderCodeCard(lesson), label: "See it in code" },
    { file: "04-production.png", html: renderProductionCard(lesson), label: "Production reality" },
    { file: "05-interview.png", html: renderInterviewCard(lesson), label: "Interview + remember" }
  ];
}
