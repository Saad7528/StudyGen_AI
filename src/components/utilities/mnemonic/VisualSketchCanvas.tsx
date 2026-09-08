'use client';

import React, { useState, useEffect } from 'react';
import { VisualCueData } from '@/types/mnemonic';
import { 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Eye, 
  Palette, 
  Compass, 
  Smile, 
  RefreshCw,
  Lightbulb,
  Share2,
  Check,
  Download,
  Maximize2,
  ImageIcon,
  X
} from 'lucide-react';

interface VisualSketchCanvasProps {
  visualCue: VisualCueData;
  formula: string;
  topic: string;
  question: string;
  correctAnswer: string;
  compact?: boolean;
  initialImageUrl?: string;
}

export const VisualSketchCanvas: React.FC<VisualSketchCanvasProps> = ({
  visualCue,
  formula,
  topic,
  question,
  correctAnswer,
  compact = false,
  initialImageUrl
}) => {
  const [sketchStyle, setSketchStyle] = useState<'doodle' | 'blueprint' | 'warm_sketch'>('warm_sketch');
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || visualCue.image_url || '');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  // Generate real AI sketch image if not present
  useEffect(() => {
    if (!imageUrl && visualCue.sketch_prompt) {
      generateAiImage();
    }
  }, [visualCue.sketch_prompt]);

  const generateAiImage = async () => {
    setIsGeneratingImage(true);
    setImageError(false);
    try {
      const res = await fetch('/api/generate-technique-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: visualCue.sketch_prompt,
          formula,
          topic,
          question,
          correctAnswer,
          theme: visualCue.sketch_theme
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        // Direct fallback generator URL
        const cleanPrompt = encodeURIComponent(
          `colored pencil hand-drawn sketch illustration, ${visualCue.sketch_prompt}, ${formula}, vintage textbook art`
        );
        setImageUrl(`https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=600&nologo=true&enhance=true`);
      }
    } catch {
      const cleanPrompt = encodeURIComponent(
        `colored pencil hand-drawn sketch illustration, ${visualCue.sketch_prompt}, ${formula}, vintage textbook art`
      );
      setImageUrl(`https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=600&nologo=true&enhance=true`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(
      `Visual Sketch Concept:\n${visualCue.description}\nPrompt: ${visualCue.sketch_prompt}\nFormula: ${formula}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${topic}-visual-sketch.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine stylized canvas colors
  const getThemeColors = () => {
    switch (sketchStyle) {
      case 'doodle':
        return {
          bg: 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60',
          ink: 'text-amber-950 dark:text-amber-100',
          accent: 'bg-amber-400/20 text-amber-800 dark:text-amber-200 border-amber-400/40',
          bubble: 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-sm'
        };
      case 'blueprint':
        return {
          bg: 'bg-sky-950 text-cyan-100 border-cyan-500/40',
          ink: 'text-cyan-100',
          accent: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          bubble: 'bg-sky-900/90 border-cyan-500/40 text-cyan-200 shadow-md'
        };
      case 'warm_sketch':
      default:
        return {
          bg: 'bg-[#FDFBF7] dark:bg-slate-900/90 border-[#E8DFC8] dark:border-slate-800',
          ink: 'text-slate-800 dark:text-slate-100',
          accent: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/60',
          bubble: 'bg-white/95 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
        };
    }
  };

  const currentTheme = getThemeColors();

  return (
    <div
      className={`relative rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
        currentTheme.bg
      } ${compact ? 'p-3.5 sm:p-4' : 'p-5 sm:p-6'}`}
      style={{
        backgroundImage:
          sketchStyle === 'warm_sketch'
            ? 'radial-gradient(#d6cfbe 0.75px, transparent 0.75px)'
            : sketchStyle === 'blueprint'
            ? 'linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)'
            : 'none',
        backgroundSize: sketchStyle === 'blueprint' ? '20px 20px' : '16px 16px'
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 dark:bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              🎨 রঙিন হ্যান্ডমেড স্কেচ ও ভিজ্যুয়াল আর্ট
            </span>
          </div>
        </div>

        {/* Style switchers & Regenerate button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={generateAiImage}
            disabled={isGeneratingImage}
            title="নতুন করে ছবি জেনারেট করুন"
            className="p-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">নতুন ছবি</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setSketchStyle('warm_sketch')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                sketchStyle === 'warm_sketch'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              হ্যান্ডমেড
            </button>
            <button
              onClick={() => setSketchStyle('blueprint')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                sketchStyle === 'blueprint'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              ব্লুপ্রিন্ট
            </button>
          </div>
        </div>
      </div>

      {/* Main Illustration Art Box */}
      <div className="relative rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 backdrop-blur-xs space-y-3">
        {/* Top Floating Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Compass className="w-3.5 h-3.5" />
            {visualCue.map_highlight || topic}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            হাতে আঁকা রঙিন পেন্সিল স্কেচ
          </span>
        </div>

        {/* AI Generated Rich Colored Sketch Image */}
        {imageUrl && !imageError ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300/60 dark:border-amber-600/40 shadow-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={formula}
              onError={() => setImageError(true)}
              className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setShowFullImageModal(true)}
            />

            {/* Overlay Gradient with Bengali Formula Title */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 flex items-end justify-between gap-2 text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  স্মৃতি সংকেত আর্ট
                </span>
                <div className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">
                  "{formula}"
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowFullImageModal(true)}
                  title="বড় করে দেখুন"
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDownloadImage}
                  title="ছবি ডাউনলোড করুন"
                  className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isGeneratingImage && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>নতুন চিত্রপট আঁকা হচ্ছে...</span>
              </div>
            )}
          </div>
        ) : (
          /* Stylized SVG/Canvas Metaphor & Comic Dialogue Fallback */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800">
            {visualCue.character_left && (
              <div className="md:col-span-3 flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
                <div className="text-2xl mb-1">👑</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                  {visualCue.character_left}
                </span>
              </div>
            )}

            <div className={`${visualCue.character_left && visualCue.character_right ? 'md:col-span-6' : 'md:col-span-12'} flex flex-col items-center text-center px-2`}>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                "{visualCue.description}"
              </p>
              {visualCue.cartoon_dialogue && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-900 dark:text-amber-200">
                  💬 "{visualCue.cartoon_dialogue}"
                </div>
              )}
            </div>

            {visualCue.character_right && (
              <div className="md:col-span-3 flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
                <div className="text-2xl mb-1">🏰</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                  {visualCue.character_right}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 text-xs">
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
            💡 {visualCue.description}
          </p>

          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'কপি হয়েছে' : 'প্রম্পট'}</span>
          </button>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImageModal && imageUrl && (
        <div 
          onClick={() => setShowFullImageModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-white">
              <span className="text-sm font-bold text-amber-300">"{formula}"</span>
              <button 
                onClick={() => setShowFullImageModal(false)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={formula} className="w-full max-h-[70vh] object-contain rounded-2xl" />

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                {visualCue.description}
              </p>
              <button
                onClick={handleDownloadImage}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ডাউনলোড</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
