'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Flame, 
  Zap, 
  Clock, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  X,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, GameSettings, GameResult } from '../../../types/quiz';

interface GamifiedPlayArenaProps {
  questions: QuizQuestion[];
  settings: GameSettings;
  onGameFinished: (result: GameResult, userAnswers: (number | null)[]) => void;
  onExit: () => void;
}

export const GamifiedPlayArena: React.FC<GamifiedPlayArenaProps> = ({
  questions,
  settings,
  onGameFinished,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [livesLeft, setLivesLeft] = useState(settings.lifelinesEnabled ? 3 : 999);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  
  // Timers
  const [questionTimeLeft, setQuestionTimeLeft] = useState(settings.timePerQuestion || 30);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  // Track total game time
  useEffect(() => {
    totalTimerRef.current = setInterval(() => {
      setTotalTimeSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, []);

  // Per-Question countdown timer
  useEffect(() => {
    if (settings.timePerQuestion > 0 && !isAnswerRevealed) {
      setQuestionTimeLeft(settings.timePerQuestion);

      timerRef.current = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerRevealed, settings.timePerQuestion]);

  // Audio synthesizer for game sound effects
  const playSoundEffect = (type: 'correct' | 'wrong' | 'streak' | 'gameover') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'correct') {
        // Upbeat victory chime
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = ctx.currentTime + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      } else if (type === 'wrong') {
        // Low soft thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'streak') {
        // Rapid power-up synth
        [440, 554, 659, 880].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = ctx.currentTime + i * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
      }
    } catch {
      // Audio context fallback
    }
  };

  // Time-Up Handler
  const handleTimeUp = () => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);
    setSelectedOption(null);
    setUserAnswers(prev => [...prev, null]);
    setWrongIndices(prev => [...prev, currentIndex]);
    setStreak(0);
    playSoundEffect('wrong');

    if (settings.lifelinesEnabled) {
      const remainingLives = livesLeft - 1;
      setLivesLeft(remainingLives);
      if (remainingLives <= 0) {
        handleGameOver(false);
      }
    }
  };

  // Option Click Handler
  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);
    setIsAnswerRevealed(true);

    const isCorrect = index === currentQ.correctAnswer;
    const newAnswers = [...userAnswers, index];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Points calculation with streak multiplier
      const basePoints = 100;
      const streakMultiplier = Math.min(newStreak, 5);
      const timeBonus = settings.timePerQuestion > 0 ? questionTimeLeft * 2 : 20;
      const earned = basePoints * streakMultiplier + timeBonus;

      setScore(prev => prev + earned);

      if (newStreak >= 3) {
        playSoundEffect('streak');
      } else {
        playSoundEffect('correct');
      }

      // Confetti burst on correct
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {
        // Fallback
      }
    } else {
      setStreak(0);
      setWrongIndices(prev => [...prev, currentIndex]);
      playSoundEffect('wrong');

      if (settings.lifelinesEnabled) {
        const remainingLives = livesLeft - 1;
        setLivesLeft(remainingLives);
        if (remainingLives <= 0) {
          setTimeout(() => {
            handleGameOver(false, newAnswers);
          }, 1500);
          return;
        }
      }
    }
  };

  // Next Question or Finish Game
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      handleGameOver(true, userAnswers);
    }
  };

  // Game Over / Victory Trigger
  const handleGameOver = (completedAll: boolean, finalAnswers: (number | null)[] = userAnswers) => {
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);

    const correctCount = finalAnswers.reduce((acc: number, ans, i) => {
      return ans === questions[i]?.correctAnswer ? acc + 1 : acc;
    }, 0);

    const totalCount = questions.length;
    const accuracy = Math.round((correctCount / totalCount) * 100);

    const result: GameResult = {
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      wrongAnswers: totalCount - correctCount,
      totalScore: score,
      maxStreak,
      totalTimeSeconds,
      accuracyPercentage: accuracy,
      wrongQuestionIndices: wrongIndices,
      completedAt: Date.now()
    };

    onGameFinished(result, finalAnswers);
  };

  const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      
      {/* Top Game HUD Bar */}
      <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          
          {/* Question counter & subject badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
              প্রশ্ন {currentIndex + 1} / {questions.length}
            </span>
            {currentQ.category && (
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                • {currentQ.category}
              </span>
            )}
          </div>

          {/* Right Status (Streak + Lives + Score + Sound Toggle) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Combo Streak */}
            {streak >= 2 && (
              <div className="flex items-center gap-1 text-xs font-black text-orange-500 animate-bounce bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-xl border border-orange-200 dark:border-orange-800">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak}X কম্বো!</span>
              </div>
            )}

            {/* Heart Lives */}
            {settings.lifelinesEnabled && (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(heartNum => (
                  <Heart
                    key={heartNum}
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                      heartNum <= livesLeft
                        ? 'text-rose-500 fill-rose-500 scale-100'
                        : 'text-slate-300 dark:text-slate-700 scale-90'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Score Pill */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-mono font-black shadow-md shadow-indigo-600/20">
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{score} pts</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={soundEnabled ? 'সাউন্ড অন' : 'সাউন্ড অফ'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Exit Game */}
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="গেম থেকে বের হন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Arena */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Question Header with Timer Countdown */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed flex-1">
            {currentQ.question}
          </h3>

          {/* Countdown Clock Timer */}
          {settings.timePerQuestion > 0 && !isAnswerRevealed && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-mono font-black text-xs shrink-0 border ${
              questionTimeLeft <= 5
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{questionTimeLeft}s</span>
            </div>
          )}
        </div>

        {/* 4 Animated Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((optionText, optIndex) => {
            const isCorrect = optIndex === currentQ.correctAnswer;
            const isSelected = selectedOption === optIndex;

            let cardStyles = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:shadow-md hover:scale-[1.01]';

            if (isAnswerRevealed) {
              if (isCorrect) {
                cardStyles = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-lg shadow-emerald-500/10 font-bold';
              } else if (isSelected && !isCorrect) {
                cardStyles = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100 animate-[pulseGlow_0.5s] font-semibold';
              } else {
                cardStyles = 'opacity-50 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <div
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${cardStyles}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isAnswerRevealed && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isAnswerRevealed && isSelected && !isCorrect
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {optionLabels[optIndex] || optIndex + 1}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed">{optionText}</span>
                </div>

                {isAnswerRevealed && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswerRevealed && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation & Next Question Drawer on Answer Reveal */}
        {isAnswerRevealed && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200/80 dark:border-slate-700 space-y-3 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>সঠিক উত্তর ও ব্যাখ্যা:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation || `সঠিক উত্তর হলো "${currentQ.options[currentQ.correctAnswer]}".`}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'পরবর্তী প্রশ্ন' : 'ফলাফল ও স্কোর কার্ড দেখুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
