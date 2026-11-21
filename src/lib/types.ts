export type ExerciseKind =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "fractions"
  | "comparison"
  | "sequence"
  | "roman"
  | "mental"
  | "neighbors"
  | "placeValue"
  | "decimals"
  | "ruleOfThree"
  | "mcmMcd"
  | "combined"
  | "balance";

export type DifficultyLevel = "facil" | "medio" | "dificil";

export interface WorksheetConfig {
  topicSlug: string;
  kind: ExerciseKind;
  title: string;
  difficulty: DifficultyLevel;
  count: number; // 12, 16, 20, 24, 30
  layout: "vertical" | "horizontal";
  carry: boolean; // con llevadas / sin llevar (for add/sub)
  tableNumber?: number; // 0 = mixed 1-12, 1..12 = specific table
  digitsA: number; // 1..4
  digitsB: number; // 1..3
  includeAnswers: boolean;
  showGrid?: boolean;
  studentName: string;
  showDateLine: boolean;
  fontSize: "normal" | "grande";
}

export interface FractionValue {
  num: number;
  den: number;
}

export interface GeneratedExercise {
  id: number;
  kind: ExerciseKind;
  // For standard arithmetic
  a?: number;
  b?: number;
  operator?: "+" | "-" | "×" | "÷";
  // For fractions
  fracA?: FractionValue;
  fracB?: FractionValue;
  // For sequence
  sequence?: (number | null)[];
  // For roman or text-based prompts (neighbors, placeValue, ruleOfThree, mcmMcd, combined)
  romanPrompt?: string;
  promptText?: string;
  // For balance scale equations
  balance?: {
    leftX: number;
    leftConst: number;
    rightX: number;
    rightConst: number;
  };
  // Answer representation
  answer: string;
  // Optional extra note (e.g., remainder)
  remainder?: number;
}

export interface TopicDefinition {
  slug: string;
  name: string;
  shortName: string;
  category:
    | "Operaciones"
    | "Tablas y Cálculo"
    | "Fracciones"
    | "Numeración";
  grades: string[]; // slugs of grades
  badge?: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  defaultConfig: Omit<WorksheetConfig, "topicSlug" | "title" | "studentName" | "showDateLine">;
  supportsCarryToggle?: boolean;
  supportsTableSelector?: boolean;
  supportsLayoutToggle?: boolean;
  pedagogicalGuide: {
    intro: string;
    howToTeach: string[];
    tips: string[];
    faqs: { q: string; a: string }[];
  };
}

export interface GradeDefinition {
  slug: string;
  name: string;
  ageRange: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  color: string;
  recommendedTopics: string[];
}
