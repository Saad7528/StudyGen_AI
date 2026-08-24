export type MathCategory = 
  | 'algebra'
  | 'quadratic'
  | 'calculus_derivative'
  | 'calculus_integral'
  | 'system_equations'
  | 'trigonometry'
  | 'matrix'
  | 'geometry';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathLatex?: string;
  result?: string;
}

export interface MathSolution {
  originalInput: string;
  category: MathCategory;
  finalAnswer: string;
  latexAnswer?: string;
  steps: SolutionStep[];
  graphFormula?: string;
  executionTimeMs?: number;
}

export interface GpaSubject {
  id: string;
  name: string;
  marks?: number;
  gradePoint: number;
  letterGrade: string;
  creditHours?: number; // For University
  isOptional?: boolean; // For SSC/HSC (4th Subject)
}

export interface GpaResult {
  gpa: number;
  totalGradePoints: number;
  totalCredits?: number;
  letterGrade: string;
  passed: boolean;
  remarks: string;
}

export interface FormulaItem {
  id: string;
  topic: string;
  subject: 'Physics' | 'Chemistry' | 'Higher Math' | 'General Math' | 'ICT';
  title: string;
  formulaLatex: string;
  description: string;
  variables: { symbol: string; meaning: string }[];
}
