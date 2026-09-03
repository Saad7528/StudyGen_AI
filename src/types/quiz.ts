export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0..3
  explanation: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GameSettings {
  questionCount: number;
  timePerQuestion: number; // in seconds, 0 for unlimited
  lifelinesEnabled: boolean; // 3 hearts
  soundEnabled: boolean;
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  maxStreak: number;
  totalTimeSeconds: number;
  accuracyPercentage: number;
  wrongQuestionIndices: number[];
  completedAt: number;
}

export interface QuizFeedback {
  id: string;
  user: string;
  comment: string;
  vote: 'up' | 'down';
  time: string;
}

export interface CommunityQuiz {
  id: string;
  title: string;
  topic: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  questions: QuizQuestion[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  isPermanentFeatured: boolean; // Automatically true when upvotes >= 10
  isBlocked: boolean; // Automatically true when downvotes >= 5
  playsCount: number;
  feedbackList?: QuizFeedback[];
}
