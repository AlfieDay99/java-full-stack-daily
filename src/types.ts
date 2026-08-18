export type WeekdayCategory =
  | "Monday — Fundamentals"
  | "Tuesday — Core Working Knowledge"
  | "Wednesday — Professional Engineering"
  | "Thursday — Engineering Judgement"
  | "Friday — Interview Challenge"
  | "Saturday — Practical Engineering"
  | "Sunday — Weekly Consolidation";

export type CodeLanguage = "java" | "typescript" | "sql" | "http" | "bash" | "text";

export interface HookCard {
  headline: string;
  hook: string;
  heroToken: string;
  visualCaption: string;
  microExample: string;
}

export interface MentalModelCard {
  title: string;
  coreIdea: string;
  primaryFlow: string[];
  secondaryFlow: string[];
  primaryLabel: string;
  secondaryLabel: string;
  keyOutcome: string;
  mentalShortcut: string;
}

export interface CodeCard {
  title: string;
  intro: string;
  language: CodeLanguage;
  code: string;
  highlightLine: number;
  highlightReason: string;
  takeaway: string;
  professionalNote: string;
}

export interface ProductionCard {
  title: string;
  scenario: string;
  problems: string[];
  professionalApproach: string;
  flow: string[];
  debugClue: string;
}

export interface InterviewCard {
  question: string;
  answer: string;
  remember: string[];
  tomorrow: string;
  interviewerTesting: string;
}

export interface DailyLesson {
  date: string;
  topic: string;
  tomorrowTopic: string;
  category: WeekdayCategory;
  hook: HookCard;
  mentalModel: MentalModelCard;
  code: CodeCard;
  production: ProductionCard;
  interview: InterviewCard;
}

export interface HistoryEntry {
  date: string;
  topic: string;
  category: string;
}
