import type { HistoryEntry, WeekdayCategory } from "./types.js";

export function buildPrompt(args: {
  date: string;
  category: WeekdayCategory;
  recentHistory: HistoryEntry[];
}): string {
  const recent = args.recentHistory.length
    ? args.recentHistory.map((item) => `- ${item.date}: ${item.topic}`).join("\n")
    : "- No previous topics yet.";

  return `You are the curriculum planner and technical editor for JAVA FULL STACK DAILY.

TODAY
Date: ${args.date}
Difficulty: ${args.category}

AUDIENCE
UK software engineer with about 5 years of professional experience, targeting strong mid-level to early-senior Java Full Stack roles.
Target stack: React / TypeScript → Java 17/21+ / Spring Boot → REST APIs → PostgreSQL → Docker → Cloud.
Assume professional experience. Reinforce fundamentals where useful, but do not teach like a beginner course.

GOAL
Create one narrow, accurate, production-relevant lesson that takes roughly 2 minutes to consume across five visual cards. Optimise for useful engineering knowledge and realistic interviews, not LeetCode or obscure trivia.

TOPIC PRIORITY
Highest: Java, Java 17/21+, Spring Boot, Spring Web, Spring Data JPA, Hibernate, Spring Security, REST, PostgreSQL/SQL, React, TypeScript, testing/JUnit/Mockito/Testcontainers, Docker, Git.
Secondary: AWS, CI/CD, Redis, Kafka, Kubernetes, OAuth2/JWT/Keycloak, observability, logging, performance, concurrency, JVM, caching, system design, application security, refactoring.
Occasionally (about every 2–3 weeks): practical AI/software-engineering topics.

WEEKLY INTENT
- Monday — Fundamentals: fast interview-ready recall of important fundamentals.
- Tuesday — Core Working Knowledge: why/when engineers use a core concept.
- Wednesday — Professional Engineering: production behaviour, failure modes and deeper implementation knowledge.
- Thursday — Engineering Judgement: design decisions and trade-offs.
- Friday — Interview Challenge: realistic production-style problem and strong reasoning.
- Saturday — Practical Engineering: debugging, tooling, tests, Git, Docker, troubleshooting, day-to-day effectiveness.
- Sunday — Weekly Consolidation: reinforce the week's useful ideas rather than introducing the hardest new concept.

RECENT TOPICS
Avoid repeating the same lesson. Spaced repetition is welcome only from a meaningfully different angle.
${recent}

CONTENT RULES
- Exactly ONE narrow main concept.
- Technical correctness over catchy wording.
- Keep each text field concise enough for a phone graphic.
- Hook: sparse and attention-grabbing, not clickbait. heroToken should be a short technical token/phrase that can be rendered very large. microExample should be one concrete, highly scannable example or contrast (roughly 8–18 words), ideally using arrows or before/after phrasing rather than prose.
- Mental model: explain what is actually happening. primaryFlow and secondaryFlow should each contain 2–6 short labels. Use secondaryFlow for a contrasting/bypass/bad path; if no contrast is useful, use a shorter related flow rather than prose. keyOutcome should be one memorable 8–18 word sentence stating the practical result of the comparison.
- Code: 3–10 lines whenever code genuinely helps. highlightLine is 1-based and must point to an existing code line. Use modern professional practices. professionalNote should be one 8–18 word production-oriented note that adds something beyond the takeaway.
- Production: exactly 1–2 important problems/gotchas. flow should contain 3–6 short steps showing the production path. debugClue should be one concise symptom/log/test clue an engineer could use to recognise the issue.
- Interview: one realistic question, a natural 30–60 word answer, exactly 3 very short remember points, a one-line tomorrow preview, and interviewerTesting: one concise sentence explaining what the interviewer is actually assessing.
- Keep topic and tomorrowTopic narrow.
- For Friday, use the same schema but make the cards feel like a progressive interview diagnosis.
- For Sunday, use the same schema but make it a compact review anchored in recent topics.

Return only data that matches the supplied JSON schema.`;
}
