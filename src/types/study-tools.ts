export interface OmrConfig {
  institutionName: string;
  examTitle: string;
  className: string;
  subject: string;
  date: string;
  totalQuestions: number; // 20, 25, 50, 75, 100
  optionsCount: number; // 4 (ক খ গ ঘ or A B C D) or 5
  optionType: 'bangla' | 'english'; // 'bangla' (ক, খ, গ, ঘ) vs 'english' (A, B, C, D)
  setCodes: string[]; // ['ক', 'খ', 'গ', 'ঘ']
  rollDigits: number; // e.g. 6 digits
  regDigits: number; // e.g. 6 digits
  showInstructions: boolean;
  showSignatureBoxes: boolean;
  watermarkText?: string;
  accentColor: string; // e.g. '#4f46e5'
}

export interface StudySummaryResult {
  title: string;
  topic: string;
  subject: string;
  quickSummary: string[];
  keyDefinitions: { term: string; explanation: string; example?: string }[];
  formulasAndRules: { label: string; formula: string; note?: string }[];
  highYieldExamTips: string[];
  sampleQuestions: { question: string; answer: string }[];
  generatedAt: string;
}

export interface FlashcardItem {
  id: string;
  front: string; // Question or concept
  back: string; // Answer or definition
  hint?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isMastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  category?: string;
}

export interface QuizDeck {
  id: string;
  title: string;
  subject: string;
  description: string;
  cards: FlashcardItem[];
  quizQuestions: QuizQuestion[];
  tags?: string[];
  icon?: string;
  totalCount?: number;
}

