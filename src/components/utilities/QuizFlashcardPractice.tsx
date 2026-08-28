'use client';

import React, { useState, useEffect } from 'react';
import { FlashcardItem, QuizQuestion, QuizDeck } from '../../types/study-tools';
import { QuestionPaperData } from '../../types/question-paper';
import { KaTeXViewer } from '../KaTeXViewer';
import { 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Flame, 
  Lightbulb, 
  Shuffle, 
  HelpCircle,
  Trophy,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_DECKS: QuizDeck[] = [
  {
    id: 'physics',
    title: 'পদার্থবিজ্ঞান: বল ও গতি',
    subject: 'পদার্থবিজ্ঞান',
    description: 'এইচএসসি ও এসএসসি স্তরের গতিবিদ্যা, নিউটনের সূত্র ও কাজের ধারণা।',
    cards: [
      {
        id: 'p1',
        front: 'নিউটনের দ্বিতীয় গতিসূত্রটি কী এবং এর থেকে কোন রাশির মান নির্ণয় করা যায়?',
        back: 'বস্তুর ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক ($F = ma$)। এর সাহায্যে বলের মান পরিমাপ করা যায়।',
        hint: 'F, m এবং a এর সম্পর্ক মনে করুন।'
      },
      {
        id: 'p2',
        front: 'মহাকর্ষীয় ধ্রুবক $G$ এর মান ও একক কত?',
        back: '$G = 6.673 \\times 10^{-11}\\, N\\cdot m^2/kg^2$',
        hint: 'একক $N\\cdot m^2/kg^2$'
      },
      {
        id: 'p3',
        front: 'কাজ-শক্তি উপপাদ্যটি (Work-Energy Theorem) কী?',
        back: 'কোনো বস্তুর ওপর প্রযুক্ত বল দ্বারা কৃতকাজ তার গতিশক্তির পরিবর্তনের সমান ($W = \\Delta K = \\frac{1}{2}mv^2 - \\frac{1}{2}mu^2$)।',
        hint: 'কৃতকাজ = শেষ গতিশক্তি - আদি গতিশক্তি'
      }
    ],
    quizQuestions: [
      {
        id: 'pq1',
        question: 'অভিকর্ষজ ত্বরণ $g$-এর মান পৃথিবীর কোথায় সবচেয়ে বেশি?',
        options: ['মেরু অঞ্চলে', 'বিষুব অঞ্চলে', 'ক্রান্তীয় অঞ্চলে', 'পৃথিবীর কেন্দ্রে'],
        correctIndex: 0,
        explanation: 'পৃথিবী মেরু অঞ্চলে সামান্য চ্যাপ্টা হওয়ায় ব্যাসার্ধ $R$ কম, তাই $g = \\frac{GM}{R^2}$ অনুযায়ী মেরুতে $g$-এর মান সর্বাধিক ($9.83\\, m/s^2$)।'
      },
      {
        id: 'pq2',
        question: '১ কিলোওয়াট-ঘণ্টা (1 kWh) সমান কত জুল?',
        options: ['$3.6 \\times 10^5\\, J$', '$3.6 \\times 10^6\\, J$', '$1000\\, J$', '$3600\\, J$'],
        correctIndex: 1,
        explanation: '$1\\, kWh = 1000\\, W \\times 3600\\, s = 3.6 \\times 10^6\\, J$'
      },
      {
        id: 'pq3',
        question: 'নিচের কোনটি ভেক্টর রাশি?',
        options: ['দ্রুতি', 'কাজ', 'তড়িৎ বিভব', 'তড়িৎ তীব্রতা'],
        correctIndex: 3,
        explanation: 'তড়িৎ তীব্রতার নির্দিষ্ট মান ও দিক উভয়ই আছে, তাই এটি একটি ভেক্টর রাশি।'
      }
    ]
  },
  {
    id: 'ict',
    title: 'আইসিটি: লজিক গেইট ও বুলিয়ান',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    description: 'ডিজিটাল লজিক গেইট, সার্বজনীন গেইট ও বুলিয়ান সরলীকরণ।',
    cards: [
      {
        id: 'i1',
        front: 'ডি-মরগ্যানের প্রথম উপপাদ্যটি কী?',
        back: '$\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$ (যেকোনো সংখ্যক চলকের যৌক্তিক যোগের পূরক তাদের প্রত্যেকের পূরকের যৌক্তিক গুণের সমান)',
        hint: 'যোগের কমপ্লিমেন্ট গুণের সমান'
      },
      {
        id: 'i2',
        front: 'সার্বজনীন গেইট (Universal Gates) কোনগুলো এবং কেন এদের সার্বজনীন বলা হয়?',
        back: 'NAND এবং NOR গেইট। কারণ এই দুটি গেইট দিয়ে সব মৌলিক গেইটসহ যেকোনো ডিজিটাল সার্কিট বাস্তবায়ন সম্ভব।',
        hint: 'দুটি বিশেষ গেইট'
      },
      {
        id: 'i3',
        front: 'বুলিয়ান অ্যালজেব্রায় $A + \\overline{A}$ এর মান কত?',
        back: '$A + \\overline{A} = 1$',
        hint: 'চলক এবং তার কমপ্লিমেন্টের যোগফল সবসময় ১'
      }
    ],
    quizQuestions: [
      {
        id: 'iq1',
        question: 'একটি ৩-ইনপুট বিশিষ্ট AND গেইটের আউটপুট ১ হতে হলে ইনপুট কী হতে হবে?',
        options: ['যেকোনো ১টি ইনপুট ১', 'সকল ইনপুট ১', 'সকল ইনপুট ০', 'বিজড় সংখ্যক ইনপুট ১'],
        correctIndex: 1,
        explanation: 'AND গেইটে সবগুলো ইনপুট High বা 1 হলেই কেবল আউটপুট 1 পাওয়া যায়।'
      },
      {
        id: 'iq2',
        question: '$A \\oplus B$ নির্দেশ করে কোন গেইট?',
        options: ['XOR', 'XNOR', 'NAND', 'NOR'],
        correctIndex: 0,
        explanation: 'এটি Exclusive-OR (XOR) গেইটের সমীকরণ ($A\\overline{B} + \\overline{A}B$)।'
      }
    ]
  }
];

interface QuizFlashcardPracticeProps {
  paperData?: QuestionPaperData;
}

export const QuizFlashcardPractice: React.FC<QuizFlashcardPracticeProps> = ({ paperData }) => {
  const [activeMode, setActiveMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [selectedDeckId, setSelectedDeckId] = useState('physics');
  const [decks, setDecks] = useState<QuizDeck[]>(DEFAULT_DECKS);

  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Sync MCQs from current Question Paper into a custom deck if available
  useEffect(() => {
    if (paperData && paperData.sections) {
      const paperMCQs: QuizQuestion[] = [];
      const paperFlashcards: FlashcardItem[] = [];

      paperData.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          if (q.type === 'mcq' && q.options && q.options.length > 0) {
            const banglaLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const correctIdx = q.correctAnswer
              ? banglaLabels.indexOf(q.correctAnswer)
              : 0;

            paperMCQs.push({
              id: q.id,
              question: q.text,
              options: q.options.map((o) => o.text),
              correctIndex: correctIdx >= 0 ? correctIdx : 0,
              category: sec.title
            });

            paperFlashcards.push({
              id: q.id,
              front: q.text,
              back: `সঠিক উত্তর: (${q.options[correctIdx >= 0 ? correctIdx : 0]?.label}) ${
                q.options[correctIdx >= 0 ? correctIdx : 0]?.text
              }`
            });
          }
        });
      });

      if (paperMCQs.length > 0) {
        const customDeck: QuizDeck = {
          id: 'from-paper',
          title: `প্রশ্নপত্র ডেক: ${paperData.header.subject || 'পরীক্ষা'}`,
          subject: paperData.header.subject || 'পরীক্ষা প্রশ্নপত্র',
          description: 'বর্তমান তৈরিকৃত প্রশ্নপত্র থেকে সংগৃহীত কুইজ ও ফ্ল্যাশকার্ড।',
          cards: paperFlashcards,
          quizQuestions: paperMCQs
        };

        setDecks((prev) => [customDeck, ...prev.filter((d) => d.id !== 'from-paper')]);
        setSelectedDeckId('from-paper');
      }
    }
  }, [paperData]);

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];

  // Timer logic for Quiz
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !quizCompleted) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, quizCompleted]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev + 1) % currentDeck.cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length);
  };

  const handleToggleMastered = (cardId: string) => {
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
        confetti({ particleCount: 30, spread: 50 });
      }
      return next;
    });
  };

  // Quiz Handlers
  const handleSelectQuizOption = (optIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optIdx);
    setIsAnswerSubmitted(true);

    const isCorrect = optIdx === currentDeck.quizQuestions[quizIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < currentDeck.quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
    setSeconds(0);
    setTimerActive(true);
  };

  const currentCard = currentDeck.cards[cardIndex];
  const currentQuizQ = currentDeck.quizQuestions[quizIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Interactive Flashcards & Quiz Practice
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                কুইজ ও রিভিশন
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ফ্ল্যাশকার্ড দিয়ে সক্রিয় পুনরাবৃত্তি (Active Recall) এবং লাইভ টাইমার দিয়ে MCQ কুইজ প্র্যাকটিস করুন।
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveMode('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeMode === 'flashcards'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> ফ্ল্যাশকার্ড ডেক
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('quiz');
              setTimerActive(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeMode === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Timer className="w-3.5 h-3.5" /> লাইভ MCQ কুইজ
          </button>
        </div>
      </div>

      {/* Deck Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
          ডেক নির্বাচন:
        </span>
        {decks.map((deck) => (
          <button
            key={deck.id}
            type="button"
            onClick={() => {
              setSelectedDeckId(deck.id);
              setCardIndex(0);
              setIsFlipped(false);
              setQuizIndex(0);
              setQuizCompleted(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedDeckId === deck.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500'
            }`}
          >
            {deck.title}
          </button>
        ))}
      </div>

      {/* ==========================================
          MODE 1: FLASHCARDS DECK
         ========================================== */}
      {activeMode === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Progress & Stats */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 px-2">
            <span>
              কার্ড {cardIndex + 1} / {currentDeck.cards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> মুখস্থ: {masteredCards.size}
              </span>
            </div>
          </div>

          {/* Interactive Card Canvas */}
          {currentCard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 border-2 border-amber-500/30 hover:border-amber-500/60 shadow-xl cursor-pointer flex flex-col justify-between transition-all duration-300 transform select-none"
            >
              {/* Badge & Flip hint */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg ${
                  isFlipped ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {isFlipped ? 'উত্তর (ANSWER)' : 'প্রশ্ন / ধারণা (QUESTION)'}
                </span>

                <span className="text-[11px] text-slate-400 italic">
                  ক্লিক করে উল্টান ↻
                </span>
              </div>

              {/* Main Content */}
              <div className="py-6 text-center text-slate-900 dark:text-white">
                {!isFlipped ? (
                  <div className="text-base sm:text-xl font-bold leading-relaxed">
                    <KaTeXViewer content={currentCard.front} />
                  </div>
                ) : (
                  <div className="text-sm sm:text-lg font-medium text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    <KaTeXViewer content={currentCard.back} />
                  </div>
                )}

                {/* Optional Hint */}
                {showHint && currentCard.hint && !isFlipped && (
                  <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 animate-fade-in">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>ইঙ্গিত: {currentCard.hint}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                {currentCard.hint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'ইঙ্গিত লুকান' : 'ইঙ্গিত দেখুন'}
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={() => handleToggleMastered(currentCard.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    masteredCards.has(currentCard.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {masteredCards.has(currentCard.id) ? 'পড়া হয়েছে!' : 'পড়া হয়ে গেছে'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">কোনো ফ্ল্যাশকার্ড পাওয়া যায়নি।</div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shadow-sm transition"
            >
              <ChevronLeft className="w-4 h-4" /> আগের কার্ড
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setShowHint(false);
                setCardIndex((prev) => (prev + 1) % currentDeck.cards.length);
              }}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-500/20 transition"
            >
              পরের কার্ড <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          MODE 2: TIMED MCQ QUIZ
         ========================================== */}
      {activeMode === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {!quizCompleted && currentQuizQ ? (
            <div className="space-y-4">
              {/* Quiz Status Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">
                  প্রশ্ন {quizIndex + 1} / {currentDeck.quizQuestions.length}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Timer className="w-4 h-4 animate-spin text-indigo-500" /> সময়: {seconds} সে.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Award className="w-4 h-4" /> স্কোর: {score}
                </span>
              </div>

              {/* Question Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  <span className="text-indigo-600 mr-2">{quizIndex + 1}।</span>
                  <KaTeXViewer content={currentQuizQ.question} />
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQuizQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === currentQuizQ.correctIndex;
                    const banglaLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)', '(ঙ)'];

                    let btnClass = 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectQuizOption(optIdx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${btnClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">{banglaLabels[optIdx]}</span>
                          <span><KaTeXViewer content={opt} /></span>
                        </div>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Answer Submitted */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-xs space-y-1 animate-fade-in">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-600" /> ব্যাখ্যা:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {currentQuizQ.explanation || 'সঠিক উত্তরটি চিহ্নিত করা হয়েছে।'}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Question Button */}
              {isAnswerSubmitted && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition animate-fade-in"
                  >
                    {quizIndex < currentDeck.quizQuestions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-2xl animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  কুইজ সম্পন্ন হয়েছে! 🎉
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  আপনি সবগুলো প্রশ্নের উত্তর দিয়েছেন।
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-semibold">মোট প্রশ্ন</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">{currentDeck.quizQuestions.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <span className="text-[11px] text-emerald-600 block font-semibold">সঠিক উত্তর</span>
                  <span className="text-lg font-black text-emerald-600">{score}</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <span className="text-[11px] text-indigo-600 block font-semibold">মোট সময়</span>
                  <span className="text-lg font-black text-indigo-600">{seconds} সে.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 mx-auto transition"
                >
                  <RotateCcw className="w-4 h-4" /> আবার কুইজ দিন
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
