'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Clock, 
  Zap, 
  Sparkles, 
  Award, 
  BookOpen, 
  ArrowRight,
  Share2,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, GameResult } from '../../../types/quiz';

interface QuizVictoryReportProps {
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  result: GameResult;
  onPlayAgainAll: () => void;
  onPlayAgainWrongOnly: () => void;
  onNewQuiz: () => void;
  onSaveToCommunity?: () => void;
}

export const QuizVictoryReport: React.FC<QuizVictoryReportProps> = ({
  questions,
  userAnswers,
  result,
  onPlayAgainAll,
  onPlayAgainWrongOnly,
  onNewQuiz,
  onSaveToCommunity
}) => {
  const [showReview, setShowReview] = useState(false);

  // Trigger Victory Confetti if accuracy is 60%+
  useEffect(() => {
    if (result.accuracyPercentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  }, [result.accuracyPercentage]);

  const getRankBadge = (acc: number) => {
    if (acc >= 90) return { title: '🏆 গ্র্যান্ডমাস্টার স্কলার', desc: 'অসাধারণ ও নিখুঁত পারফরম্যান্স!', color: 'from-amber-400 via-orange-500 to-amber-600', ring: 'ring-amber-400/50' };
    if (acc >= 70) return { title: '🥇 ব্রিলিয়ান্ট পারফর্মার', desc: 'চমৎকার জ্ঞান ও একাগ্রতা!', color: 'from-indigo-500 via-purple-500 to-pink-500', ring: 'ring-indigo-400/50' };
    if (acc >= 50) return { title: '🥈 উদীয়মান প্রতিভা', desc: 'ভালো চেষ্টা, আরেকটু রিভিশন দিলে ১০০% হবে!', color: 'from-cyan-500 to-blue-600', ring: 'ring-blue-400/50' };
    return { title: '🥉 প্র্যাকটিস মাস্টার', desc: 'অনুশীলনই সাফল্যের চাবিকাঠি, ভুলগুলো দেখুন!', color: 'from-slate-500 to-slate-700', ring: 'ring-slate-400/50' };
  };

  const getAiMotivationalFeedback = (acc: number) => {
    if (acc >= 90) {
      return 'অবিশ্বাস্য পারফরম্যান্স! আপনি প্রায় প্রতিটি প্রশ্নের সঠিক উত্তর দিয়েছেন। আপনার পড়ার দক্ষতা ও মেমোরি রিটেনশন অত্যন্ত উচ্চমানের। এভাবেই আত্মবিশ্বাস নিয়ে এগিয়ে যান!';
    }
    if (acc >= 70) {
      return 'দারুণ ফলাফল! মূল কনসেপ্টগুলোতে আপনার দখল চমৎকার। যে ১-২টি প্রশ্নে বিভ্রান্তি ছিল, নিচের উত্তরমালা রিভিউ দেখে নিলে পরের বার নিশ্চিত ফুল মার্কস পাবেন!';
    }
    if (acc >= 50) {
      return 'চমৎকার চেষ্টা! আপনি অর্ধেকের বেশি প্রশ্নের সঠিক উত্তর দিয়েছেন। ভুল হওয়া প্রশ্নগুলো নিচের বাটন দিয়ে রি-ম্যাচ খেলে এখনি শতভাগ ক্লিয়ার করে নিন!';
    }
    return 'হতাশ হওয়ার কিছু নেই! যেকোনো নতুন বিষয় প্রথমবার শিখতে গেলে এমন হতে পারে। নিচের রিভিউ থেকে সঠিক উত্তর ও ব্যাখ্যাগুলো পড়ে নিয়ে আবার চেষ্টা করুন, আপনি অবশ্যই সফল হবেন!';
  };

  const rank = getRankBadge(result.accuracyPercentage);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    if (mins === 0) return `${remainder} সেকেন্ড`;
    return `${mins} মিনিট ${remainder} সেকেন্ড`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Victory Trophy & Score Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/90 via-white/70 to-indigo-50/60 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/40 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden text-center">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className={`relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${rank.color} text-white flex items-center justify-center shadow-xl mb-4 animate-float-slow ring-4 ${rank.ring}`}>
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>গেম সমাপ্ত ও ফলাফল রিপোর্ট</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {rank.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {rank.desc}
        </p>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>সঠিক উত্তর</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{result.accuracyPercentage}% নির্ভুল</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>মোট পয়েন্ট</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {result.totalScore}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">গেম স্কোর</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-orange-500 text-xs font-bold mb-1">
              <Flame className="w-4 h-4" />
              <span>সর্বোচ্চ স্ট্রিক</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {result.maxStreak}x
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">টানা সঠিক</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>মোট সময়</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
              {formatTime(result.totalTimeSeconds)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">স্পিড রেকর্ড</div>
          </div>
        </div>

        {/* AI Motivational Coach Advice Box */}
        <div className="mt-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>AI মোটিভেশনাল কোচ পরামর্শ:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {getAiMotivationalFeedback(result.accuracyPercentage)}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onPlayAgainAll}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>পুনরায় পুরো কুইজ খেলুন</span>
          </button>

          {result.wrongQuestionIndices.length > 0 && (
            <button
              onClick={onPlayAgainWrongOnly}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>ভুল হওয়া {result.wrongQuestionIndices.length}টি প্রশ্ন রি-ম্যাচ খেলুন</span>
            </button>
          )}

          {onSaveToCommunity && (
            <button
              onClick={onSaveToCommunity}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-purple-500/20 flex items-center gap-2 transition cursor-pointer hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>💾 কমিউনিটিতে সেভ ও শেয়ার করুন</span>
            </button>
          )}

          <button
            onClick={onNewQuiz}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কুইজ তৈরি</span>
          </button>
        </div>
      </div>

      {/* Expandable Answers & Explanations Review */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-lg p-5 space-y-4">
        <div 
          onClick={() => setShowReview(!showReview)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                প্রশ্ন ও সঠিক উত্তরমালা রিভিউ ({questions.length}টি প্রশ্ন)
              </h4>
              <p className="text-xs text-slate-500">আপনার দেওয়া উত্তর ও প্রতিটির সঠিক ব্যাখ্যা দেখুন</p>
            </div>
          </div>

          <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showReview && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              const isUnanswered = userAns === null || userAns === undefined;

              return (
                <div
                  key={q.id || idx}
                  className={`p-4 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {idx + 1}। {q.question}
                    </h5>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isCorrect ? 'সঠিক' : isUnanswered ? 'উত্তর দেননি' : 'ভুল'}</span>
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswer;
                      const isOptionSelected = userAns === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                            isOptionCorrect
                              ? 'bg-emerald-100/70 dark:bg-emerald-900/40 border-emerald-400 font-bold text-emerald-900 dark:text-emerald-200'
                              : isOptionSelected && !isCorrect
                              ? 'bg-rose-100/70 dark:bg-rose-900/40 border-rose-400 font-semibold text-rose-900 dark:text-rose-200'
                              : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isOptionCorrect && <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">✓ সঠিক উত্তর</span>}
                          {isOptionSelected && !isCorrect && <span className="text-[10px] text-rose-700 dark:text-rose-400 font-extrabold">✗ আপনার উত্তর</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
                      <strong className="text-indigo-600 dark:text-indigo-400">ব্যাখ্যা: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
