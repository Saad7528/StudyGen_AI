export type QuestionType = 'cq' | 'mcq' | 'short' | 'broad' | 'fill_blanks';

export interface MCQOption {
  id: string;
  label: string; // 'ক', 'খ', 'গ', 'ঘ' or 'A', 'B', 'C', 'D'
  text: string;
}

export interface CQSubQuestion {
  id: string;
  label: string; // 'ক', 'খ', 'গ', 'ঘ' or 'a', 'b', 'c', 'd'
  text: string;
  marks: number;
}

export interface QuestionItem {
  id: string;
  type: QuestionType;
  number: string; // '১', '২', '1', '2'
  stem?: string; // উদ্দীপক / Context passage / Scenario
  text: string; // Question main text
  marks?: number; // e.g., 10 or 5 or 1
  options?: MCQOption[]; // For MCQ
  correctAnswer?: string; // Optional answer key
  subQuestions?: CQSubQuestion[]; // For CQ (ক, খ, গ, ঘ)
  hasOrOption?: boolean; // 'অথবা' / 'OR' alternative question
  orText?: string;
  orSubQuestions?: CQSubQuestion[];
  imageUrl?: string;
}

export interface QuestionSection {
  id: string;
  title: string; // e.g. 'ক-বিভাগ (সৃজনশীল প্রশ্ন)' or 'Section A: Multiple Choice'
  instruction?: string; // e.g. 'যেকোনো ৪টি প্রশ্নের উত্তর দাও'
  totalMarks?: string; // e.g. '৪ x ১০ = ৪০'
  questions: QuestionItem[];
}

export interface ExamHeaderInfo {
  schoolName: string; // e.g., 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ'
  examTitle: string; // e.g., 'বার্ষিক পরীক্ষা - ২০২৬'
  className: string; // e.g., 'দশম শ্রেণি'
  subject: string; // e.g., 'উচ্চতর গণিত'
  subjectCode?: string; // e.g., '১২৬'
  timeAllowed: string; // e.g., '২ ঘণ্টা ৩০ মিনিট'
  fullMarks: string; // e.g., '৭৫'
  generalInstructions?: string; // 'বিশেষ দ্রষ্টব্য: ডানপাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক।'
}

export interface QuestionPaperData {
  header: ExamHeaderInfo;
  sections: QuestionSection[];
  twoColumnLayout: boolean;
  fontFamily: 'Noto Sans Bengali' | 'Kalpurush' | 'Arial' | 'Times New Roman';
  fontSize: number; // e.g. 11 or 12
}
