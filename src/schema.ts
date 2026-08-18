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
        visualCaption: { type: "string" }
      },
      required: ["headline", "hook", "heroToken", "visualCaption"]
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
        secondaryLabel: { type: "string" }
      },
      required: [
        "title",
        "coreIdea",
        "primaryFlow",
        "secondaryFlow",
        "primaryLabel",
        "secondaryLabel"
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
        takeaway: { type: "string" }
      },
      required: [
        "title",
        "intro",
        "language",
        "code",
        "highlightLine",
        "highlightReason",
        "takeaway"
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
        flow: { type: "array", items: { type: "string" } }
      },
      required: ["title", "scenario", "problems", "professionalApproach", "flow"]
    },
    interview: {
      type: "object",
      additionalProperties: false,
      properties: {
        question: { type: "string" },
        answer: { type: "string" },
        remember: { type: "array", items: { type: "string" } },
        tomorrow: { type: "string" }
      },
      required: ["question", "answer", "remember", "tomorrow"]
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
