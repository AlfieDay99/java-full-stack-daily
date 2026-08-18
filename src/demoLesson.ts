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
        "Spring commonly applies transactional advice through a proxy. External calls cross that boundary; a call through this stays inside the target object, so the interceptor never sees it.",
      primaryLabel: "EXTERNAL CALL — INTERCEPTED",
      primaryFlow: ["Caller", "Spring proxy", "Begin transaction", "Service method", "Commit"],
      secondaryLabel: "SELF CALL — BYPASS",
      secondaryFlow: ["Service method", "this.saveUsers()", "No proxy", "No new advice"],
      keyOutcome: "The annotation only takes effect when the invocation crosses the transactional proxy."
    },
    code: {
      title: "The Annotation Is Not Enough",
      intro: "This internal call never crosses the Spring proxy.",
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
        "A developer extracts database writes into a new @Transactional method on the same service and assumes failures will roll back the whole operation.",
      problems: [
        "The expected transaction may never start.",
        "Persistence behaviour can differ from the intended atomic use case."
      ],
      professionalApproach:
        "Put the transaction boundary on the externally invoked service use case, or move a genuinely separate transactional operation to another Spring bean.",
      flow: ["Controller", "Spring proxy", "@Transactional service", "Repositories", "One transaction"],
      debugClue: "A rollback test fails even though the inner method is annotated @Transactional."
    },
    interview: {
      question:
        "Why might @Transactional not work when one method in a Spring service calls another method in the same service?",
      answer:
        "Spring commonly implements @Transactional with proxies. An external call passes through the proxy, which can start and manage the transaction. Self-invocation calls the target method directly, so the proxy does not intercept it. I normally put transaction boundaries around externally invoked service-level use cases.",
      remember: [
        "@Transactional is proxy-based by default",
        "Self-invocation bypasses the proxy",
        "Prefer clear service-level transaction boundaries"
      ],
      tomorrow: "How JPA N+1 queries arise",
      interviewerTesting: "Whether you understand Spring proxy mechanics, not merely the @Transactional annotation."
    }
  };
}
