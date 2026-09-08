'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MnemonicItem, PresetTopic } from '@/types/mnemonic';
import { SketchbookCard } from './mnemonic/SketchbookCard';
import { InteractiveSlideDeck } from './mnemonic/InteractiveSlideDeck';
import { MnemonicPrintHandout } from './mnemonic/MnemonicPrintHandout';
import { MasterStudySheetTable } from './mnemonic/MasterStudySheetTable';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  FileText, 
  Layers, 
  Upload, 
  Zap, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  Download, 
  HelpCircle,
  Lightbulb,
  Share2,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Send,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  Mic,
  Table
} from 'lucide-react';

const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'p-rainbow',
    title: 'রংধনুর ৭টি রং (বেনীআসহকলা)',
    category: 'বিজ্ঞান',
    icon: '🌈',
    description: 'বেগুনি, নীল, আসমানী, সবুজ, হলুদ, কমলা, লাল (VIBGYOR)',
    question: 'রংধনুর সাতটি রঙের নাম ক্রমানুসারে কী কী?',
    answer: 'বেগুনি, নীল, আসমানী, সবুজ, হলুদ, কমলা, লাল',
    tags: ['রংধনু', 'বিজ্ঞান', 'BCS']
  },
  {
    id: 'p-rivers',
    title: 'বাংলাদেশের বড় নদী (পামে যমুনা)',
    category: 'ভূগোল',
    icon: '🌊',
    description: 'বাংলাদেশের প্রধান ৫টি বড় নদী (পদ্মা, মেঘনা, যমুনা, ব্রহ্মপুত্র, কর্ণফুলী)',
    question: 'বাংলাদেশের প্রধান বড় নদীগুলো কী কী?',
    answer: 'পদ্মা, মেঘনা, যমুনা, ব্রহ্মপুত্র, কর্ণফুলী',
    tags: ['বাংলাদেশের নদ-নদী', 'ভূগোল', 'BCS']
  },
  {
    id: 'p-continents',
    title: '৭টি মহাদেশ (৪টি স্বরবর্ণ)',
    category: 'ভূগোল',
    icon: '🌍',
    description: '৪টি স্বরবর্ণ (অ, আ, ই, এ) দিয়ে পৃথিবীর ৭টি মহাদেশ',
    question: 'পৃথিবীতে কয়টি মহাদেশ আছে এবং সেগুলো কী কী?',
    answer: 'অস্ট্রেলিয়া, আফ্রিকা, উত্তর আমেরিকা, দক্ষিণ আমেরিকা, ইউরোপ, এশিয়া, অ্যান্টার্কটিকা',
    tags: ['মহাদেশ', 'স্বরবর্ণ কৌশল', 'BCS']
  },
  {
    id: 'p-gazipur',
    title: 'গাজীপুর জেলা (ভাওয়াল গড়ের রাজা)',
    category: 'বাংলাদেশ বিষয়াবলী',
    icon: '👑',
    description: 'গাজীপুর জেলা, ভাওয়াল জাতীয় উদ্যান, গড় ও রাজবাড়ি',
    question: 'ভাওয়াল জাতীয় উদ্যান, ভাওয়ালের গড় ও রাজবাড়ি কোন জেলায় অবস্থিত?',
    answer: 'গাজীপুর জেলা',
    tags: ['গাজীপুর', 'ভাওয়াল', 'বিসিএস']
  },
  {
    id: 'p-1',
    title: 'লাইন অব কন্ট্রোল (LOC)',
    category: 'সীমারেখা',
    icon: '🚩',
    description: 'ভারত ও পাকিস্তানের বিখ্যাত নিয়ন্ত্রণ রেখা',
    question: 'লাইন অব কন্ট্রোল (LOC) কোন দুটি দেশের সীমারেখা?',
    answer: 'ভারত ও পাকিস্তান',
    tags: ['সীমারেখা', 'ভারত-পাকিস্তান', 'BCS']
  },
  {
    id: 'p-2',
    title: 'কার্জন লাইন (Curzon Line)',
    category: 'সীমারেখা',
    icon: '🏰',
    description: 'পোল্যান্ড ও রাশিয়ার ঐতিহাসিক সীমারেখা',
    question: 'কার্জন লাইন কোন দুটি দেশের মধ্যকার সীমারেখা?',
    answer: 'পোল্যান্ড ও রাশিয়া',
    tags: ['সীমারেখা', 'ইউরোপ', 'BCS']
  },
  {
    id: 'p-3',
    title: 'ডুরান্ড লাইন (Durand Line)',
    category: 'সীমারেখা',
    icon: '🏔️',
    description: 'আফগানিস্তান ও পাকিস্তানের সীমারেখা',
    question: 'ডুরান্ড লাইন কোন দুটি দেশের সীমারেখা?',
    answer: 'আফগানিস্তান ও পাকিস্তান',
    tags: ['সীমারেখা', 'এশিয়া']
  },
  {
    id: 'p-4',
    title: 'সাত বীরশ্রেষ্ঠের নাম',
    category: 'মুক্তিযুদ্ধ',
    icon: '🎖️',
    description: 'সাত বীরশ্রেষ্ঠের নাম সহজেই মনে রাখার আদ্যক্ষর ট্রিক',
    question: 'বাংলাদেশের সাতজন বীরশ্রেষ্ঠের নাম কী কী?',
    answer: 'হামিদুর রহমান, জাহাঙ্গীর, রুহুল আমীন, মোস্তফা কামাল, মতিউর রহমান, আবদুর রউফ, নুর মোহাম্মদ',
    tags: ['মুক্তিযুদ্ধ', 'বীরশ্রেষ্ঠ', 'বাংলাদেশ']
  },
  {
    id: 'p-5',
    title: 'মুক্তিযুদ্ধের ৪টি সামরিক খেতাব',
    category: 'মুক্তিযুদ্ধ',
    icon: '⭐',
    description: 'বীরশ্রেষ্ঠ, বীর উত্তম, বীর বিক্রম, বীর প্রতীক এর ক্রম ও সংখ্যা',
    question: 'মুক্তিযুদ্ধের ৪টি খেতাবধারীদের মোট সংখ্যা কত?',
    answer: 'বীরশ্রেষ্ঠ (৭), বীর উত্তম (৬৮), বীর বিক্রম (১৭৫), বীর প্রতীক (৪২৬)',
    tags: ['খেতাব', 'সংখ্যা কোডিং']
  }
];

export const MemoryTechniqueGenerator: React.FC = () => {
  const [inputMode, setInputMode] = useState<'mode_a' | 'mode_b'>('mode_a');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [topic, setTopic] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modelUsed, setModelUsed] = useState<string>('');

  // Active Output View Mode: 'master_table' | 'sketchbook' | 'slideshow' | 'print_handout'
  const [viewMode, setViewMode] = useState<'master_table' | 'sketchbook' | 'slideshow' | 'print_handout'>('master_table');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generated Items list (Clean initial state - results only show on generation)
  const [mnemonicList, setMnemonicList] = useState<MnemonicItem[]>([]);

  // Handle Preset Click
  const handleSelectPreset = (preset: PresetTopic) => {
    setTopic(preset.title);
    setQuestion(preset.question);
    if (preset.answer) {
      setAnswer(preset.answer);
      setInputMode('mode_b');
    } else {
      setInputMode('mode_a');
    }
  };

  // Handle Image Upload for Handwritten Notes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate Memory Technique API Call
  const handleGenerate = async () => {
    if (!question.trim() && images.length === 0) {
      setErrorMessage('দয়া করে প্রশ্ন লিখুন, মুখে বলুন অথবা নোটসের ছবি আপলোড করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/generate-technique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          answer: inputMode === 'mode_b' ? answer.trim() : undefined,
          topic: topic.trim(),
          images,
          inputMode
        })
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Attach instant AI image visual link for each item
        const enrichedItems: MnemonicItem[] = json.data.map((item: any, idx: number) => {
          const prompt = item.visual_cue?.sketch_prompt || `${item.topic} ${item.mnemonic_formula}`;
          const cleanPrompt = encodeURIComponent(
            `colored pencil hand-drawn sketch illustration, ${prompt}, vintage textbook art, masterpiece`
          );
          const randomSeed = Math.floor(Math.random() * 1000000);
          const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=600&seed=${randomSeed}&nologo=true&enhance=true`;

          return {
            ...item,
            id: item.id || `mn-${Date.now()}-${idx}`,
            image_url: item.image_url || imageUrl
          };
        });

        setMnemonicList((prev) => [...enrichedItems, ...prev]);
        setModelUsed(json.modelUsed || 'gemini-3.6-flash');
        
        // Confetti celebration
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Reset inputs
        setQuestion('');
        setAnswer('');
        setImages([]);
      } else {
        setErrorMessage(json.error || 'টেকনিক জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক এরর। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Mnemonics
  const filteredMnemonics = mnemonicList.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.mnemonic_formula.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.correct_answer.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================================
          HERO BANNER & HEADER
         ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 text-white p-6 sm:p-10 border border-indigo-500/20 shadow-2xl overflow-hidden">
        {/* Background glow & sparkles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>StudyGenAI AI মেমরি কোচ ও ভিজ্যুয়াল ছন্দ ইঞ্জিন ২০২৬</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            স্মার্ট মেমরি টেকনিক, ফোনেটিক ছন্দ ও ভিজ্যুয়াল স্কেচ নোট
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            পরীক্ষার হলে দীর্ঘ উত্তর ভুলে যাওয়ার ভয় আর নেই! যেকোনো সাধারণ জ্ঞান বা কঠিন তথ্যের জন্য 
            স্বয়ংক্রিয় <strong className="text-amber-300">বাংলা ছন্দ (Mnemonics)</strong>, 
            <strong className="text-cyan-300"> রঙিন পেন্সিল স্কেচ আর্ট</strong> এবং 
            <strong className="text-emerald-300"> ধাপে ধাপে সিলেবল ব্রেকডাউন</strong> তৈরি করুন।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              স্বরবর্ণ ও এক্রোনিম শর্টকাট
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              বাংলা ভয়েস ইনপুট (ভয়েস টু টেক্সট)
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              মাস্টার স্টাডি শিট ও সাইড-বাই-সাইড PDF
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GENERATOR INPUT SECTION (With Bengali Voice Dictation)
         ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              নতুন মেমরি টেকনিক তৈরি করুন
            </h2>
          </div>

          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setInputMode('mode_a')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'mode_a'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mode A: শুধু প্রশ্ন দিন (AI সলভ + ছন্দ)
            </button>
            <button
              onClick={() => setInputMode('mode_b')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'mode_b'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mode B: প্রশ্ন ও উত্তর দুটোই দিন (কাস্টম ট্রিক)
            </button>
          </div>
        </div>

        {/* Preset Quick Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              🔥 দ্রুত ট্রাই করার জন্য বাছাইকৃত টপিক (১-ক্লিক লোড):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer"
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields with Voice Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                টপিক বা বিষয়ের নাম (ঐচ্ছিক):
              </label>
              <VoiceInputButton
                onTranscript={(txt) => setTopic((prev) => (prev ? `${prev} ${txt}` : txt))}
                size="sm"
              />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: বিশ্বের বিখ্যাত সীমারেখা / বাংলাদেশ বিষয়াবলী / সাধারণ জ্ঞান"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>প্রশ্ন বা মনে রাখার তথ্যটি লিখুন অথবা মুখে বলুন:</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hidden sm:inline">
                  বাংলায় মুখে বলুন 🎙️
                </span>
                <VoiceInputButton
                  onTranscript={(txt) => setQuestion((prev) => (prev ? `${prev} ${txt}` : txt))}
                  size="sm"
                />
              </div>
            </div>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                inputMode === 'mode_a'
                  ? 'যেমন: ডুরান্ড লাইন কোন দুটি দেশের মধ্যকার সীমারেখা? (অথবা মাইক্রোফোনে চাপ দিয়ে বলুন)'
                  : 'যেমন: বাংলাদেশের সাতজন বীরশ্রেষ্ঠের নাম কী কী?'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {inputMode === 'mode_b' && (
            <div className="animate-fade-in space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <span>সঠিক উত্তর (যে শব্দগুলো দিয়ে এআই ছন্দ বানাবে):</span>
                  <span className="text-rose-500">*</span>
                </label>
                <VoiceInputButton
                  onTranscript={(txt) => setAnswer((prev) => (prev ? `${prev} ${txt}` : txt))}
                  size="sm"
                />
              </div>
              <textarea
                rows={2}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="যেমন: আফগানিস্তান ও পাকিস্তান (অথবা হামিদুর, জাহাঙ্গীর, রুহুল আমীন...)"
                className="w-full px-4 py-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          )}

          {/* Multimodal Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              হাতে লেখা খাতার নোট বা বইয়ের পাতার ছবি আপলোড (Vision OCR):
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-indigo-500" />
                <span>ছবি যুক্ত করুন (Upload Notes/Page)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer underline"
                >
                  সব ছবি মুছে ফেলুন ({images.length}টি)
                </button>
              )}
            </div>

            {/* Image Preview Thumbnails */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-500/50 shadow-xs group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition-opacity cursor-pointer"
                    >
                      মুছুন
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>হায়ারেস্ট স্পিড জেমিনি এআই + রঙিন স্কেচ ইমেজ জেনারেটর</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ম্যাজিক ছন্দ ও ছবি তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ছন্দ ও ভিজ্যুয়াল আর্ট তৈরি করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          OUTPUT SHOWCASE & MULTI-VIEW WORKSPACE (Renders on generation)
         ========================================================================= */}
      {mnemonicList.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* View Switcher & Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            {/* Left View Tabs */}
            <div className="flex flex-wrap items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 gap-1">
              <button
                onClick={() => setViewMode('master_table')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'master_table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>📑 মাস্টার টেবিল শিট ({filteredMnemonics.length})</span>
              </button>

              <button
                onClick={() => setViewMode('sketchbook')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'sketchbook'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📒 ডিজিটাল স্কেচবুক</span>
              </button>

              <button
                onClick={() => setViewMode('slideshow')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'slideshow'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>📽️ ইন্টারঅ্যাক্টিভ স্লাইডশো</span>
              </button>

              <button
                onClick={() => setViewMode('print_handout')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'print_handout'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>🖨️ PDF চিট-শিট ও ডেক</span>
              </button>
            </div>

            {/* Right Actions: Search & Clear Button */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[180px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="সূত্র বা টপিক খুঁজুন..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => setMnemonicList([])}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                সব মুছুন
              </button>
            </div>
          </div>

          {/* VIEW 0: MASTER DUAL COLUMN STUDY SHEET (Left = Q&A + Technique, Right = Visual Art) */}
          {viewMode === 'master_table' && (
            <MasterStudySheetTable items={filteredMnemonics.length > 0 ? filteredMnemonics : mnemonicList} />
          )}

          {/* VIEW 1: DIGITAL SKETCHBOOK CARDS */}
          {viewMode === 'sketchbook' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredMnemonics.map((item, idx) => (
                  <SketchbookCard
                    key={item.id || idx}
                    item={item}
                    index={idx}
                    onSelectForPresentation={() => setViewMode('slideshow')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: INTERACTIVE ACTIVE RECALL SLIDESHOW */}
          {viewMode === 'slideshow' && (
            <div className="space-y-4">
              <InteractiveSlideDeck items={filteredMnemonics.length > 0 ? filteredMnemonics : mnemonicList} />
            </div>
          )}

          {/* VIEW 3: PRINT-READY A4 HANDOUT & SLIDE DECK */}
          {viewMode === 'print_handout' && (
            <div className="space-y-4">
              <MnemonicPrintHandout
                items={filteredMnemonics.length > 0 ? filteredMnemonics : mnemonicList}
                title="StudyGenAI স্মার্ট মেমরি ছন্দ ও রিভিশন শিট"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
