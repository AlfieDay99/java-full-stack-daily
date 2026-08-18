import type { DailyLesson, WeekdayCategory } from "./types.js";

export function demoLesson(date: string, category: WeekdayCategory): DailyLesson {
  return {
    date,
    category,
    topic: "Why Spring @Transactional self-invocation bypasses the proxy",
    tomorrowTopic: "How JPA N+1 queries arise",
    hook: {
      headline: "@Transactional Can Be Silently Skipped",
      hook: "Why can a method marked @Transactional run without the transaction you expected?",
      heroToken: "@Transactional",
      visualCaption: "The annotation is present. The proxy call is not.",
      microExample: "external call → proxy → transaction   |   this.method() → direct call → no interception"
    },
    mentalModel: {
      title: "The Proxy Is the Boundary",
      coreIdea:
        "In Spring's common proxy-based transaction mode, external calls cross the proxy boundary; self-invocation stays on the target object, so the proxy does not intercept that call.",
      primaryLabel: "EXTERNAL CALL — INTERCEPTED",
      primaryFlow: ["Caller", "Spring proxy", "Begin TX", "Service method", "Commit"],
      secondaryLabel: "SELF CALL — BYPASS",
      secondaryFlow: ["Service method", "this.saveUsers()", "No proxy", "No new advice"],
      keyOutcome: "Proxy-based transactional advice applies when the invocation actually crosses the proxy.",
      mentalShortcut: "external call → proxy → advice → transaction"
    },
    code: {
      title: "The Annotation Is Not Enough",
      intro: "This internal call does not cross the Spring proxy in the common proxy-based mode.",
      language: "java",
      code: `public void importUsers() {\n    saveUsers();\n}\n\n@Transactional\npublic void saveUsers() {\n    repository.saveAll(users);\n}`,
      highlightLine: 2,
      highlightReason: "saveUsers() is invoked directly on the same object, so proxy-based transactional advice is bypassed.",
      takeaway: "Transactional behaviour depends on the invocation path, not only the annotation.",
      professionalNote: "Put the transaction boundary around the externally invoked use case whenever possible."
    },
    production: {
      title: "A Dangerous False Assumption",
      scenario:
        "A developer extracts database writes into a new @Transactional method on the same service and assumes the inner annotation will create the intended transaction boundary.",
      problems: [
        "The inner annotation may not be intercepted during self-invocation.",
        "The resulting transaction semantics can differ from the intended use case."
      ],
      professionalApproach:
        "Put the transaction boundary on the externally invoked service use case, or move a genuinely separate transactional operation to another Spring bean.",
      flow: ["Controller", "Spring proxy", "TX service", "Repositories", "One transaction"],
      debugClue: "A rollback test fails even though the internally called method is annotated @Transactional."
    },
    interview: {
      question:
        "Why might @Transactional not take effect when one method in a Spring service calls another method in the same service?",
      answer:
        "In Spring's common proxy-based transaction mode, an external call passes through the proxy, which applies the transactional interceptor. Self-invocation calls the target method directly, so that inner call is not intercepted. I normally place transaction boundaries around externally invoked service-level use cases.",
      remember: [
        "Proxy mode is common",
        "Self-invocation bypasses it",
        "Prefer clear TX boundaries"
      ],
      tomorrow: "How JPA N+1 queries arise",
      interviewerTesting: "Whether you understand Spring proxy mechanics rather than merely recognising the annotation."
    }
  };
}
