'use client';

import React, { useState, useEffect } from 'react';
import { 
  CommunityQuiz, 
  QuizQuestion, 
  QuizFeedback 
} from '../../../types/quiz';
import { 
  getCommunityQuizzes, 
  voteOnCommunityQuiz, 
  createAndPublishCommunityQuiz 
} from '../../../lib/community-quiz-store';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Play, 
  Sparkles, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  User, 
  Clock, 
  MessageSquare, 
  Share2, 
  Search,
  Filter,
  Plus,
  Zap,
  Info,
  Send,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommunityQuizHubProps {
  onPlayQuiz: (questions: QuizQuestion[], quizTitle?: string) => void;
  onOpenCreateModal: () => void;
}

export const CommunityQuizHub: React.FC<CommunityQuizHubProps> = ({
  onPlayQuiz,
  onOpenCreateModal
}) => {
  const [quizzes, setQuizzes] = useState<CommunityQuiz[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'new' | 'my_games'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Feedback / Comment Modal State
  const [activeFeedbackQuiz, setActiveFeedbackQuiz] = useState<CommunityQuiz | null>(null);
  const [feedbackVoteType, setFeedbackVoteType] = useState<'up' | 'down'>('up');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackUserName, setFeedbackUserName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadQuizzes = () => {
    setQuizzes(getCommunityQuizzes());
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Quick Direct Vote Handler
  const handleQuickVote = (quiz: CommunityQuiz, voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = voteOnCommunityQuiz(quiz.id, voteType);
      loadQuizzes();

      if (result.isNewFeatured) {
        confetti({ particleCount: 80, spread: 70 });
        showToast(`🎉 অভিনন্দন! "${quiz.title}" গেমটি ১০টি লাইক পেয়ে স্থায়ীভাবে ফিচার্ড হয়ে গেছে!`);
      } else if (result.isNewBlocked) {
        showToast(`🚫 "${quiz.title}" গেমটি ৫টি ডিসলাইক পাওয়ায় কমিউনিটি ফিড থেকে ব্লক করা হয়েছে।`);
      } else {
        showToast(voteType === 'up' ? '👍 আপনার লাইক ও ভোট যুক্ত হয়েছে!' : '👎 আপনার ডিসলাইক ভোট যুক্ত হয়েছে।');
      }
    } catch {
      showToast('ভোট গ্রহণ করা সম্ভব হয়নি।');
    }
  };

  // Submit Vote with Comment Modal
  const handleSubmitFeedbackWithVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackQuiz) return;

    try {
      const result = voteOnCommunityQuiz(
        activeFeedbackQuiz.id,
        feedbackVoteType,
        feedbackText,
        feedbackUserName
      );
      loadQuizzes();
      setActiveFeedbackQuiz(null);
      setFeedbackText('');

      if (result.isNewFeatured) {
        confetti({ particleCount: 100, spread: 80 });
        showToast(`🎉 "${activeFeedbackQuiz.title}" ১০টি লাইক পেয়ে স্থায়ী ফিচার্ড লিস্টে যুক্ত হয়েছে!`);
      } else if (result.isNewBlocked) {
        showToast(`🚫 "${activeFeedbackQuiz.title}" ৫টি ডিসলাইক পাওয়ায় ব্লক করা হয়েছে।`);
      } else {
        showToast('ধন্যবাদ! আপনার ফিডব্যাক ও ভোট সংরক্ষিত হয়েছে।');
      }
    } catch {
      showToast('ফিডব্যাক সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  // Filtered Quiz List (Hiding blocked games unless specifically searching)
  const filteredQuizzes = quizzes.filter((q) => {
    // 1. Hide blocked games from community feed
    if (q.isBlocked) return false;

    // 2. Tab Filter
    if (activeFilter === 'featured' && !q.isPermanentFeatured) return false;
    if (activeFilter === 'my_games' && !q.id.startsWith('comm-user-')) return false;

    // 3. Search Query
    if (searchQuery.trim()) {
      const qText = `${q.title} ${q.topic} ${q.author}`.toLowerCase();
      return qText.includes(searchQuery.toLowerCase());
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-indigo-500/50 shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-bold">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Community Rules & Voting Explainer Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/40 border border-purple-500/30 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-pink-500 text-white">
                <Flame className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                🌐 কমিউনিটি AI গেমস হাব (Community Voting & Permanent Approval)
              </h3>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              শিক্ষার্থী ও শিক্ষকদের তৈরি কাস্টম কুইজ খেলুন এবং ভোট দিন। 
            </p>
          </div>

          {/* Voting Milestones Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>১০+ লাইক = পার্মানেন্ট ফিচার্ড</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>৫ ডিসলাইক = অটোমেটিক ব্লক</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>⚡ সকল গেমস ({quizzes.filter(q => !q.isBlocked).length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeFilter === 'featured'
                ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>🔥 ফিচার্ড (১০+ লাইক)</span>
          </button>

          <button
            onClick={() => setActiveFilter('my_games')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeFilter === 'my_games'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👤 আমার তৈরি গেম</span>
          </button>
        </div>

        {/* Search Input & Publish Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কমিউনিটি কুইজ খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন গেম বানান</span>
          </button>
        </div>

      </div>

      {/* Grid of Community Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuizzes.map((quiz) => {
          const upvoteProgress = Math.min(100, (quiz.upvotes / 10) * 100);
          const isUserVotedUp = quiz.userVote === 'up';
          const isUserVotedDown = quiz.userVote === 'down';

          return (
            <div
              key={quiz.id}
              className={`rounded-3xl p-5 sm:p-6 bg-white/90 dark:bg-slate-900/90 border-2 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                quiz.isPermanentFeatured
                  ? 'border-amber-400/70 dark:border-amber-500/50 shadow-amber-500/5'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              {/* Permanent Featured Badge Banner */}
              {quiz.isPermanentFeatured && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 via-orange-500 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-2xl shadow-md flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 fill-current text-amber-200" />
                  <span>⭐ ১০+ লাইক: পার্মানেন্ট ফিচার্ড</span>
                </div>
              )}

              <div>
                {/* Meta Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{quiz.authorAvatar || '🎯'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {quiz.author}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{quiz.createdAt}</span>
                    </p>
                  </div>
                </div>

                {/* Title & Topic */}
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {quiz.title}
                </h4>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                  #{quiz.topic} • {quiz.questions.length}টি প্রশ্ন
                </p>

                {/* Upvote Progress towards Permanent 10 Votes */}
                {!quiz.isPermanentFeatured && (
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">ফিচার্ড হতে প্রয়োজন:</span>
                      <span className="text-purple-600 dark:text-purple-400 font-extrabold">{quiz.upvotes} / ১০ লাইক</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${upvoteProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Play Button & Upvote/Downvote Controls */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                
                {/* Voting Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    
                    {/* Upvote Button */}
                    <button
                      onClick={(e) => handleQuickVote(quiz, 'up', e)}
                      title="এই গেমটি ভালো লেগেছে (১০টি লাইকে স্থায়ী ফিচার্ড হবে)"
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                        isUserVotedUp
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUserVotedUp ? 'fill-current' : ''}`} />
                      <span>{quiz.upvotes}</span>
                    </button>

                    {/* Downvote Button */}
                    <button
                      onClick={(e) => handleQuickVote(quiz, 'down', e)}
                      title="অপছন্দ / ফালতু (৫টি ডিসলাইক পেলে গেম ব্লক হবে)"
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                        isUserVotedDown
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:text-rose-600'
                      }`}
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${isUserVotedDown ? 'fill-current' : ''}`} />
                      <span>{quiz.downvotes}</span>
                    </button>

                    {/* Feedback / Review Dialog Launcher */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFeedbackQuiz(quiz);
                        setFeedbackVoteType('up');
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      title="ফিডব্যাক ও মতামত লিখুন"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    {quiz.playsCount || 1} বার খেলা হয়েছে
                  </span>
                </div>

                {/* Direct Play Button */}
                <button
                  onClick={() => onPlayQuiz(quiz.questions, quiz.title)}
                  className="w-full py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-black shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>🎮 এই গেমটি খেলুন</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <Info className="w-8 h-8 mx-auto text-slate-400" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            কোনো কুইজ গেম পাওয়া যায়নি
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনি প্রথম ব্যক্তি হিসেবে নিজের তৈরি প্রশ্ন দিয়ে নতুন গেম বানিয়ে পাবলিশ করুন!
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-indigo-700 transition"
          >
            + নতুন AI গেম বানান
          </button>
        </div>
      )}

      {/* =========================================================================
          FEEDBACK & VOTING MODAL
         ========================================================================= */}
      {activeFeedbackQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  গেম রিভিউ ও ভোটিং ফিডব্যাক
                </h4>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">
                  {activeFeedbackQuiz.title}
                </p>
              </div>
              <button
                onClick={() => setActiveFeedbackQuiz(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedbackWithVote} className="space-y-4">
              
              {/* Vote Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  আপনার ভোট নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackVoteType('up')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                      feedbackVoteType === 'up'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>👍 ভালো গেম (+১ লাইক)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackVoteType('down')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                      feedbackVoteType === 'down'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>👎 অপছন্দ / ফালতু (+১ ডিসলাইক)</span>
                  </button>
                </div>
              </div>

              {/* User Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  আপনার নাম (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={feedbackUserName}
                  onChange={(e) => setFeedbackUserName(e.target.value)}
                  placeholder="যেমন: সাকিব আল হাসান"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Feedback Comment */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  মন্তব্য বা মতামত:
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  placeholder="এই কুইজ গেমটি সম্পর্কে আপনার মতামত লিখুন..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackQuiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ভোট ও মন্তব্য জমা দিন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
