import type { DailyLesson, WeekdayCategory } from "./types.js";

export function demoLesson(date: string, category: WeekdayCategory): DailyLesson {
  return {
    date,
    category,
    topic: "Why Spring @Transactional self-invocation bypasses proxy advice",
    tomorrowTopic: "How JPA N+1 queries arise",
    hook: {
      headline: "@Transactional Can Be Silently Bypassed",
      hook: "Why can a method marked @Transactional run without the transaction advice you expected?",
      heroToken: "@Transactional",
      visualCaption: "In Spring's common proxy-based transaction mode, invocation path matters as much as the annotation.",
      microExample: "external call → proxy advice   |   this.method() → direct self-call"
    },
    mentalModel: {
      title: "The Proxy Is the Interception Boundary",
      coreIdea:
        "In Spring's default proxy-based transaction management, external calls can pass through transactional advice. A self-call such as this.saveUsers() stays on the target object, so that inner invocation is not intercepted by the proxy.",
      primaryLabel: "EXTERNAL CALL — INTERCEPTED",
      primaryFlow: ["Caller", "Spring proxy", "TX advice", "Service method", "Commit"],
      secondaryLabel: "SELF CALL — BYPASS",
      secondaryFlow: ["Service method", "this.saveUsers()", "Direct call", "No inner advice"],
      keyOutcome: "Self-invocation bypasses proxy advice in the usual proxy-based Spring transaction mode.",
      mentalShortcut: "external call → proxy → TX advice → method"
    },
    code: {
      title: "The Annotation Alone Is Not Enough",
      intro: "The inner call below does not cross the transactional proxy.",
      language: "java",
      code: `public void importUsers() {\n    saveUsers();\n}\n\n@Transactional\npublic void saveUsers() {\n    repository.saveAll(users);\n}`,
      highlightLine: 2,
      highlightReason:
        "saveUsers() is invoked directly from the same instance, so proxy-based transactional advice on that inner method is not applied.",
      takeaway: "With proxy-based transactions, transactional advice depends on the invocation path as well as the annotation.",
      professionalNote: "Prefer a clear transaction boundary on an externally invoked service use case."
    },
    production: {
      title: "A Dangerous False Assumption",
      scenario:
        "A developer extracts database writes into a new @Transactional method on the same service and assumes that annotation creates a separate transaction boundary when called internally.",
      problems: [
        "The inner method's transactional advice is not applied through the proxy.",
        "Rollback behaviour can therefore differ from what the developer intended."
      ],
      professionalApproach:
        "Place the transaction boundary on the externally invoked service operation, or move a genuinely separate transactional operation to another Spring bean when that boundary is required.",
      flow: ["Controller", "Spring proxy", "TX service", "Repositories", "One transaction"],
      debugClue: "A rollback-focused integration test fails even though the internally called method is annotated @Transactional."
    },
    interview: {
      question:
        "Why might @Transactional not apply when one method in a Spring service calls another method in the same service?",
      answer:
        "Spring commonly applies @Transactional through a proxy. An external call can cross that proxy and trigger transaction advice, but self-invocation is a direct call on the target object, so the inner method is not intercepted. That caveat applies to the usual proxy-based mode; other weaving approaches can behave differently.",
      remember: [
        "Proxy-based advice needs a proxy crossing",
        "Self-invocation is a direct target call",
        "Prefer explicit service transaction boundaries"
      ],
      tomorrow: "How JPA N+1 queries arise",
      interviewerTesting: "Whether you understand Spring's transaction interception model rather than merely recognising the annotation."
    }
  };
}
