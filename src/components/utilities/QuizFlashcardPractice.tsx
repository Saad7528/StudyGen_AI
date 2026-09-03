'use client';

import React, { useState, useEffect } from 'react';
import { FlashcardItem, QuizQuestion as LegacyQuizQuestion, QuizDeck } from '../../types/study-tools';
import { QuizQuestion, GameSettings, GameResult } from '../../types/quiz';
import { QuestionPaperData } from '../../types/question-paper';
import { KaTeXViewer } from '../KaTeXViewer';
import { FULL_DECK_COLLECTION } from '../../lib/quiz-flashcard-data';
import { UniversalQuizInputModal } from './quiz/UniversalQuizInputModal';
import { GamifiedPlayArena } from './quiz/GamifiedPlayArena';
import { QuizVictoryReport } from './quiz/QuizVictoryReport';
import { InteractiveLaunchpadSection } from './quiz/InteractiveLaunchpadSection';
import { CommunityQuizHub } from './quiz/CommunityQuizHub';
import { SaveQuizModal } from './quiz/SaveQuizModal';

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
  Play,
  Bookmark,
  SlidersHorizontal,
  Moon,
  Plus,
  Zap,
  Gamepad2,
  BookOpen,
  Camera,
  Upload,
  FileText,
  Heart,
  ArrowRight,
  Globe,
  Share2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizFlashcardPracticeProps {
  paperData?: QuestionPaperData;
}

export const QuizFlashcardPractice: React.FC<QuizFlashcardPracticeProps> = ({ paperData }) => {
  const [activeMode, setActiveMode] = useState<'arena' | 'community' | 'flashcards'>('arena');
  const [selectedDeckId, setSelectedDeckId] = useState('islamic');
  const [decks, setDecks] = useState<QuizDeck[]>(FULL_DECK_COLLECTION);

  // Modal State for Universal AI Input & Community Save
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'paste' | 'image' | 'file'>('paste');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Active Gamified Play Arena States
  const [isPlayingArena, setIsPlayingArena] = useState(false);
  const [arenaQuestions, setArenaQuestions] = useState<QuizQuestion[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [userGameAnswers, setUserGameAnswers] = useState<(number | null)[]>([]);

  // Game Arena Custom Settings
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    questionCount: 10,
    timePerQuestion: 25,
    lifelinesEnabled: true,
    soundEnabled: true
  });

  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [jumpInput, setJumpInput] = useState('');

  // Sync MCQs from current Question Paper into a custom deck if available
  useEffect(() => {
    if (paperData && paperData.sections) {
      const paperMCQs: LegacyQuizQuestion[] = [];
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
          title: `প্রশ্নপত্র ডেক: ${paperData.header.subject || 'পরীক্ষা'} (${paperMCQs.length} প্রশ্ন)`,
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

  // Convert Deck Questions to Gamified Arena Format
  const convertDeckToQuizQuestions = (deck: QuizDeck): QuizQuestion[] => {
    return deck.quizQuestions.map((q, idx) => ({
      id: q.id || `q-${idx}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctIndex,
      explanation: `সঠিক উত্তর হলো: "${q.options[q.correctIndex]}".`,
      category: q.category || deck.title,
      difficulty: 'medium'
    }));
  };

  // Start Arena Game from Current Deck
  const handleStartArenaFromDeck = () => {
    const converted = convertDeckToQuizQuestions(currentDeck);
    const selected = converted.slice(0, gameSettings.questionCount);
    setArenaQuestions(selected);
    setGameResult(null);
    setUserGameAnswers([]);
    setIsPlayingArena(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Quiz Generated from AI (Photo / File / Text)
  const handleCustomQuizGenerated = (questions: QuizQuestion[]) => {
    setArenaQuestions(questions);
    setGameResult(null);
    setUserGameAnswers([]);
    setIsPlayingArena(true);
    setActiveMode('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Game Arena Handlers
  const handleGameFinished = (result: GameResult, answers: (number | null)[]) => {
    setGameResult(result);
    setUserGameAnswers(answers);
    setIsPlayingArena(false);
  };

  const handlePlayAgainAll = () => {
    setGameResult(null);
    setUserGameAnswers([]);
    setIsPlayingArena(true);
  };

  const handlePlayAgainWrongOnly = () => {
    if (!gameResult) return;
    const failedQuestions = gameResult.wrongQuestionIndices.map(idx => arenaQuestions[idx]).filter(Boolean);
    if (failedQuestions.length > 0) {
      setArenaQuestions(failedQuestions);
      setGameResult(null);
      setUserGameAnswers([]);
      setIsPlayingArena(true);
    }
  };

  // Flashcard Actions
  const handleShuffleDeck = () => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id === selectedDeckId) {
          const shuffledCards = [...d.cards].sort(() => Math.random() - 0.5);
          return { ...d, cards: shuffledCards };
        }
        return d;
      })
    );
    setCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    confetti({ particleCount: 30, spread: 50 });
  };

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

  // Keyboard navigation for Flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMode !== 'flashcards' || isPlayingArena) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, isPlayingArena, currentDeck.cards.length]);

  const currentCard = currentDeck.cards[cardIndex];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                🎮 ক্রিয়েট ইউর MCQ গেম (Create Your Own Game)
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 border border-pink-500/20">
                Gamified AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ছবি, ডকুমেন্ট (PDF/DOCX) বা টেক্সট আপলোড করে নিজস্ব কোশ্চেন অ্যান্ড অ্যানসার কুইজ গেম বানান ও খেলুন
            </p>
          </div>
        </div>

        {/* Action Controls & Universal Modal Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setInitialModalTab('paste');
              setIsInputModalOpen(true);
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>+ নতুন AI গেম তৈরি করুন</span>
          </button>

          {/* Mode Switcher: Arena, Community, Flashcards */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setActiveMode('arena');
                setIsPlayingArena(false);
                setGameResult(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'arena'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>গেম অ্যারেনা</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('community');
                setIsPlayingArena(false);
                setGameResult(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'community'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-pink-300" />
              <span>কমিউনিটি গেমস</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/30 text-white">
                ১০+ লাইক
              </span>
            </button>

            <button
              onClick={() => {
                setActiveMode('flashcards');
                setIsPlayingArena(false);
                setGameResult(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'flashcards'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>৩D ফ্ল্যাশকার্ড</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: LIVE GAMEPLAY ARENA (WHEN ACTIVE)
         ========================================================================= */}
      {isPlayingArena && arenaQuestions.length > 0 && (
        <GamifiedPlayArena
          questions={arenaQuestions}
          settings={gameSettings}
          onGameFinished={handleGameFinished}
          onExit={() => setIsPlayingArena(false)}
        />
      )}

      {/* =========================================================================
          VIEW 2: VICTORY & GAME REPORT (WHEN FINISHED)
         ========================================================================= */}
      {!isPlayingArena && gameResult && (
        <QuizVictoryReport
          questions={arenaQuestions}
          userAnswers={userGameAnswers}
          result={gameResult}
          onPlayAgainAll={handlePlayAgainAll}
          onPlayAgainWrongOnly={handlePlayAgainWrongOnly}
          onNewQuiz={() => {
            setInitialModalTab('paste');
            setIsInputModalOpen(true);
          }}
          onSaveToCommunity={() => setIsSaveModalOpen(true)}
        />
      )}

      {/* =========================================================================
          VIEW 3: COMMUNITY AI GAMES HUB (WITH 10 UPVOTE / 5 DOWNVOTE APPROVAL)
         ========================================================================= */}
      {!isPlayingArena && !gameResult && activeMode === 'community' && (
        <div className="space-y-6 animate-fade-in">
          <CommunityQuizHub
            onPlayQuiz={(commQuestions) => {
              setArenaQuestions(commQuestions);
              setGameResult(null);
              setUserGameAnswers([]);
              setIsPlayingArena(true);
              setActiveMode('arena');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCreateModal={() => {
              setInitialModalTab('paste');
              setIsInputModalOpen(true);
            }}
          />
        </div>
      )}

      {/* =========================================================================
          VIEW 4: GAME ARENA LAUNCHPAD & DECK SHOWCASE (DEFAULT HOME)
         ========================================================================= */}
      {!isPlayingArena && !gameResult && activeMode === 'arena' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* 2-Column Serial List + Interactive Live Animation Launchpad */}
          <InteractiveLaunchpadSection
            onOpenModal={(tab) => {
              setInitialModalTab(tab);
              setIsInputModalOpen(true);
            }}
          />

          {/* Pre-Play Deck Selector & Settings Studio */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>রেডিমেড প্রশ্নব্যাংক নির্বাচন</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  কুইজ ডেক ও গেম সেটিংস
                </h3>
              </div>

              {/* Game Settings Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Question count */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  <span className="text-slate-400 px-1 font-bold">প্রশ্ন:</span>
                  {[5, 10, 15].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setGameSettings(prev => ({ ...prev, questionCount: cnt }))}
                      className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                        gameSettings.questionCount === cnt
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {cnt}টি
                    </button>
                  ))}
                </div>

                {/* Time per question */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  <span className="text-slate-400 px-1 font-bold">টাইম:</span>
                  {[
                    { label: '15s', val: 15 },
                    { label: '25s', val: 25 },
                    { label: '∞', val: 0 }
                  ].map(t => (
                    <button
                      key={t.val}
                      onClick={() => setGameSettings(prev => ({ ...prev, timePerQuestion: t.val }))}
                      className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                        gameSettings.timePerQuestion === t.val
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Deck Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {decks.map(deck => {
                const isSelected = selectedDeckId === deck.id;
                return (
                  <div
                    key={deck.id}
                    onClick={() => setSelectedDeckId(deck.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500 shadow-md scale-[1.01]'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          {deck.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {deck.quizQuestions.length}টি প্রশ্ন
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {deck.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {deck.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                      <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                        {isSelected ? '✓ নির্বাচিত' : 'নির্বাচন করুন'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Selected Game Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleStartArenaFromDeck}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-sm font-black shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition transform hover:scale-105 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>&quot;{currentDeck.title.slice(0, 25)}...&quot; গেম শুরু করুন ({Math.min(gameSettings.questionCount, currentDeck.quizQuestions.length)}টি প্রশ্ন)</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 4: 3D FLASHCARDS PRACTICE MODE
         ========================================================================= */}
      {activeMode === 'flashcards' && (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
          
          {/* Flashcard Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                কার্ড {cardIndex + 1} / {currentDeck.cards.length}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                • {currentDeck.subject}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffleDeck}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer"
                title="কার্ড শাফল করুন"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>শাফল</span>
              </button>

              <button
                onClick={() => handleToggleMastered(currentCard.id)}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  masteredCards.has(currentCard.id)
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${masteredCards.has(currentCard.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{masteredCards.has(currentCard.id) ? 'শেখা শেষ' : 'বুকমার্ক'}</span>
              </button>
            </div>
          </div>

          {/* 3D Interactive Flip Card */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl p-8 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border-2 border-indigo-500/30 hover:border-indigo-500 backdrop-blur-2xl shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between select-none"
          >
            {/* Card Top Pill */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                {isFlipped ? 'উত্তর (Back Side)' : 'প্রশ্ন (Front Side)'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                ক্লিক বা স্পেস চাপুন ফ্লিপ করতে
              </span>
            </div>

            {/* Card Content (Front vs Back) */}
            <div className="py-8 text-center space-y-3">
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              {showHint && currentCard.hint && !isFlipped && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 animate-fade-in">
                  💡 ইঙ্গিত: {currentCard.hint}
                </p>
              )}
            </div>

            {/* Card Footer info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>{currentDeck.title}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {isFlipped ? 'পুনরায় প্রশ্ন দেখুন ➔' : 'উত্তর দেখতে ফ্লিপ করুন ➔'}
              </span>
            </div>
          </div>

          {/* Bottom Next/Prev Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী কার্ড</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>পরবর্তী কার্ড</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Universal Input Modal */}
      <UniversalQuizInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onQuizGenerated={handleCustomQuizGenerated}
        initialTab={initialModalTab}
      />

      {/* Community Save & Publish Modal */}
      <SaveQuizModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        questions={arenaQuestions}
        onSaved={() => {
          setActiveMode('community');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
