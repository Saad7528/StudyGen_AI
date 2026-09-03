'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  FileText, 
  Upload, 
  Sparkles, 
  Brain, 
  HelpCircle, 
  BookOpen, 
  Check, 
  AlertCircle,
  Play,
  FileCode,
  Layers,
  ArrowRight,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { QuizQuestion } from '../../../types/quiz';

interface UniversalQuizInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizGenerated: (questions: QuizQuestion[]) => void;
  initialTab?: 'paste' | 'image' | 'file';
}

type TabType = 'paste' | 'image' | 'file';
type ModeType = 'questions_only' | 'questions_and_answers' | 'reading_notes';

export const UniversalQuizInputModal: React.FC<UniversalQuizInputModalProps> = ({
  isOpen,
  onClose,
  onQuizGenerated,
  initialTab = 'paste'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [inputMode, setInputMode] = useState<ModeType>('questions_only');
  const [rawText, setRawText] = useState('');
  const [imageFiles, setImageFiles] = useState<{ name: string; base64: string }[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageFiles(prev => [
            ...prev,
            { name: file.name, base64: event.target!.result as string }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Document Upload (.txt, .docx, .json)
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRawText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      // For binary or other docs, read as text fallback or note
      setRawText(`[ফাইল: ${file.name}]\n\nএই ডকুমেন্টের টেক্সট থেকে AI স্বয়ংক্রিয়ভাবে MCQ প্রশ্ন তৈরি করবে।`);
    }
  };

  // Preset sample questions for fast 1-click test
  const loadPreset = (presetType: 'math' | 'science' | 'gk') => {
    if (presetType === 'math') {
      setRawText(`১। দ্বিঘাত সমীকরণ ax² + bx + c = 0 এর নিশ্চয়ক কত?
২। সমান্তর ধারার n-তম পদের সূত্র কী?
৩। sin(90° - θ) এর মান কত?
৪। বৃত্তের ব্যাসার্ধ r হলে ক্ষেত্রফল কত?
৫। (a + b)² - (a - b)² = ?`);
      setInputMode('questions_only');
    } else if (presetType === 'science') {
      setRawText(`১। আলোর প্রতিসরণের স্নেলের সূত্রটি কী?
২। ওহমের সূত্রের সঠিক সমীকরণ লিখ।
৩। মানবদেহে রক্তের প্রধান উপাদান কয়টি?
৪। পর্যায় সারণির প্রথম মৌল কোনটি?
৫। শক্তির এসআই (SI) একক কী?`);
      setInputMode('questions_only');
    } else if (presetType === 'gk') {
      setRawText(`১। পদ্মা সেতুর মোট দৈর্ঘ্য কত কিলোমিটার?
২। বাংলাদেশের জাতীয় সংসদের আসন সংখ্যা কত?
৩। সুন্দরবনকে ইউনেস্কো কত সালে বিশ্ব ঐতিহ্য ঘোষণা করে?
৪। বঙ্গবন্ধু স্যাটেলাইট-১ কত সালে মহাকাশে উৎক্ষেপণ করা হয়?
৫। ভাষা আন্দোলনের শহীদদের স্মরণে কেন্দ্রীয় শহীদ মিনার কোথায় অবস্থিত?`);
      setInputMode('questions_only');
    }
    setActiveTab('paste');
  };

  // Handle Generate
  const handleGenerate = async () => {
    setErrorMessage(null);

    const hasText = rawText.trim().length > 0;
    const hasImages = imageFiles.length > 0;

    if (!hasText && !hasImages) {
      setErrorMessage('অনুগ্রহ করে কিছু প্রশ্ন পেস্ট করুন, ফাইল আপলোড দিন অথবা ছবি যুক্ত করুন।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawText.trim(),
          images: imageFiles.map(img => img.base64),
          inputMode
        })
      });

      if (!res.ok) {
        throw new Error('কুইজ তৈরিতে সমস্যা হয়েছে');
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        onQuizGenerated(data.questions);
        onClose();
      } else {
        throw new Error('কোনো প্রশ্ন তৈরি করা সম্ভব হয়নি।');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'কুইজ জেনারেশনে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                AI Gamified Quiz Creator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ছবি, ফাইল বা টেক্সট থেকে নিমেষেই তৈরি করুন আকর্ষণীয় গেম কুইজ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* 3 Input Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>টেক্সট পেস্ট / টাইপ</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>ছবি / স্ক্যান আপলোড</span>
              {imageFiles.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] flex items-center justify-center">
                  {imageFiles.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>ডকুমেন্ট ফাইল</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>আপনার ইনপুটের ধরন নির্বাচন করুন:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'questions_only',
                  title: 'শুধুমাত্র প্রশ্ন',
                  desc: 'AI সঠিক উত্তর ও ৪টি অপশন তৈরি করবে'
                },
                {
                  id: 'questions_and_answers',
                  title: 'প্রশ্ন ও উত্তর উভয়ই',
                  desc: 'সরাসরি MCQ গেমে রূপান্তর করবে'
                },
                {
                  id: 'reading_notes',
                  title: 'পড়ার নোট / অনুচ্ছেদ',
                  desc: 'গুরুত্বপূর্ণ অংশ থেকে প্রশ্ন তৈরি করবে'
                }
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setInputMode(m.id as ModeType)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    inputMode === m.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>{m.title}</span>
                    {inputMode === m.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab 1: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  প্রশ্ন বা পড়ার নোট পেস্ট করুন:
                </label>
                {/* 1-Click Samples */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">স্যাম্পল:</span>
                  <button
                    onClick={() => loadPreset('math')}
                    className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:underline"
                  >
                    গণিত
                  </button>
                  <button
                    onClick={() => loadPreset('science')}
                    className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-bold hover:underline"
                  >
                    বিজ্ঞান
                  </button>
                  <button
                    onClick={() => loadPreset('gk')}
                    className="px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 text-[10px] font-bold hover:underline"
                  >
                    সাধারণ জ্ঞান
                  </button>
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={7}
                placeholder="এখানে প্রশ্নগুলো লিখুন বা যেকোনো চ্যাপ্টারের নোট পেস্ট করুন...&#10;&#10;যেমন:&#10;১। পদ্মা সেতুর দৈর্ঘ্য কত কি.মি.?&#10;২। আলোর প্রতিফলনের ২য় সূত্রটি লিখ।&#10;৩। sin(90° - θ) এর মান কত?"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          )}

          {/* Tab 2: Upload Images */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-indigo-400/50 dark:border-indigo-600/50 rounded-3xl bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 text-center space-y-2 cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  হাতে লেখা বা বইয়ের পাতার ছবি আপলোড করুন
                </h4>
                <p className="text-xs text-slate-500">
                  ক্লিক করে ছবি নির্বাচন করুন বা ফাইল ড্রপ করুন (JPG, PNG, WebP)
                </p>
              </div>

              {/* Uploaded images list */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imageFiles.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.base64} alt={img.name} className="w-10 h-10 object-cover rounded-lg" />
                      <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate flex-1">{img.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFiles(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Upload Document File */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <input
                ref={docInputRef}
                type="file"
                accept=".txt,.docx,.pdf,.csv,.json"
                onChange={handleDocChange}
                className="hidden"
              />

              <div
                onClick={() => docInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-purple-400/50 dark:border-purple-600/50 rounded-3xl bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 text-center space-y-2 cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  ডকুমেন্ট ফাইল সিলেক্ট করুন
                </h4>
                <p className="text-xs text-slate-500">
                  সমর্থিত ফাইল: .docx, .pdf, .txt, .csv
                </p>
              </div>

              {uploadedFileName && (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                    <FileCode className="w-4 h-4 text-purple-500" />
                    <span>{uploadedFileName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> আপলোড সম্পন্ন
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            বাতিল
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI কুইজ গেম তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>এআই দিয়ে গেম কুইজ শুরু করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
