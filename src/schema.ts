export const LESSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string" },
    topic: { type: "string" },
    tomorrowTopic: { type: "string" },
    category: {
      type: "string",
      enum: [
        "Monday — Fundamentals",
        "Tuesday — Core Working Knowledge",
        "Wednesday — Professional Engineering",
        "Thursday — Engineering Judgement",
        "Friday — Interview Challenge",
        "Saturday — Practical Engineering",
        "Sunday — Weekly Consolidation"
      ]
    },
    hook: {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string" },
        hook: { type: "string" },
        heroToken: { type: "string" },
        visualCaption: { type: "string" },
        microExample: { type: "string" }
      },
      required: ["headline", "hook", "heroToken", "visualCaption", "microExample"]
    },
    mentalModel: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        coreIdea: { type: "string" },
        primaryFlow: { type: "array", items: { type: "string" } },
        secondaryFlow: { type: "array", items: { type: "string" } },
        primaryLabel: { type: "string" },
        secondaryLabel: { type: "string" },
        keyOutcome: { type: "string" }
      },
      required: [
        "title",
        "coreIdea",
        "primaryFlow",
        "secondaryFlow",
        "primaryLabel",
        "secondaryLabel",
        "keyOutcome"
      ]
    },
    code: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        intro: { type: "string" },
        language: {
          type: "string",
          enum: ["java", "typescript", "sql", "http", "bash", "text"]
        },
        code: { type: "string" },
        highlightLine: { type: "integer" },
        highlightReason: { type: "string" },
        takeaway: { type: "string" },
        professionalNote: { type: "string" }
      },
      required: [
        "title",
        "intro",
        "language",
        "code",
        "highlightLine",
        "highlightReason",
        "takeaway",
        "professionalNote"
      ]
    },
    production: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        scenario: { type: "string" },
        problems: { type: "array", items: { type: "string" } },
        professionalApproach: { type: "string" },
        flow: { type: "array", items: { type: "string" } },
        debugClue: { type: "string" }
      },
      required: ["title", "scenario", "problems", "professionalApproach", "flow", "debugClue"]
    },
    interview: {
      type: "object",
      additionalProperties: false,
      properties: {
        question: { type: "string" },
        answer: { type: "string" },
        remember: { type: "array", items: { type: "string" } },
        tomorrow: { type: "string" },
        interviewerTesting: { type: "string" }
      },
      required: ["question", "answer", "remember", "tomorrow", "interviewerTesting"]
    }
  },
  required: [
    "date",
    "topic",
    "tomorrowTopic",
    "category",
    "hook",
    "mentalModel",
    "code",
    "production",
    "interview"
  ]
} as const;
