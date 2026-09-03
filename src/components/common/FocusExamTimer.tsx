'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Minimize2, 
  Maximize2, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Edit3,
  Check,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';

interface FocusExamTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

type SoundType = 'chime' | 'melody' | 'marimba' | 'beep';

export const FocusExamTimer: React.FC<FocusExamTimerProps> = ({
  isOpen,
  onClose
}) => {
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState<SoundType>('chime');
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Manual Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState('15');
  const [editSeconds, setEditSeconds] = useState('00');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const minInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'countdown') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              setIsCompleted(true);
              if (soundEnabled) {
                playAlertSound(selectedSound);
              }
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeLeft(prev => prev + 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, soundEnabled, selectedSound]);

  const playAlertSound = (type: SoundType = selectedSound) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'chime') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.2);
        osc2.stop(ctx.currentTime + 1.2);

      } else if (type === 'melody') {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = ctx.currentTime + i * 0.14;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.5);
        });

      } else if (type === 'marimba') {
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = ctx.currentTime + idx * 0.12;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });

      } else if (type === 'beep') {
        [0, 0.2].forEach(delay => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = ctx.currentTime + delay;
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.12);
        });
      }
    } catch {
      // Audio fallback
    }
  };

  const soundList: { id: SoundType; label: string }[] = [
    { id: 'chime', label: '🔔 বেল/চাইম' },
    { id: 'melody', label: '🎶 মেলোডি' },
    { id: 'marimba', label: '🪵 মারিম্বা' },
    { id: 'beep', label: '⏰ ক্লাসিক বিপ' }
  ];

  const handleSelectSound = (id: SoundType) => {
    setSelectedSound(id);
    setSoundEnabled(true);
    setShowSoundMenu(false);
    playAlertSound(id);
  };

  const handleSetPreset = (minutes: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setIsEditing(false);
    setMode('countdown');
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
    setEditMinutes(minutes.toString().padStart(2, '0'));
    setEditSeconds('00');
  };

  const handleToggleStopwatch = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setIsEditing(false);
    setMode('stopwatch');
    setTimeLeft(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setIsEditing(false);
    if (mode === 'countdown') {
      const mins = parseInt(editMinutes, 10) || durationMinutes || 15;
      const secs = parseInt(editSeconds, 10) || 0;
      setTimeLeft(mins * 60 + secs);
    } else {
      setTimeLeft(0);
    }
  };

  const handleAdjustSeconds = (deltaSeconds: number) => {
    if (mode !== 'countdown') return;
    setIsRunning(false);
    setIsCompleted(false);
    const newTotal = Math.max(10, timeLeft + deltaSeconds);
    setTimeLeft(newTotal);
    const m = Math.floor(newTotal / 60);
    const s = newTotal % 60;
    setDurationMinutes(m);
    setEditMinutes(m.toString().padStart(2, '0'));
    setEditSeconds(s.toString().padStart(2, '0'));
  };

  const handleStartEdit = () => {
    if (isRunning) setIsRunning(false);
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    setEditMinutes(m.toString().padStart(2, '0'));
    setEditSeconds(s.toString().padStart(2, '0'));
    setIsEditing(true);
    setTimeout(() => {
      minInputRef.current?.select();
    }, 50);
  };

  const handleSaveEdit = () => {
    const mins = Math.max(0, parseInt(editMinutes, 10) || 0);
    const secs = Math.min(59, Math.max(0, parseInt(editSeconds, 10) || 0));
    const total = mins * 60 + secs;

    if (total <= 0) {
      setTimeLeft(60);
      setDurationMinutes(1);
    } else {
      setTimeLeft(total);
      setDurationMinutes(mins || 1);
    }
    setMode('countdown');
    setIsCompleted(false);
    setIsEditing(false);
  };

  const formatDigits = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <div 
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-xl border cursor-pointer backdrop-blur-xl transition-all ${
            isRunning 
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-600/30 animate-pulse-glow'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Clock className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span className="text-sm font-black font-mono tracking-wider">{formatDigits(timeLeft)}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsRunning(!isRunning);
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <Maximize2 className="w-3.5 h-3.5 text-indigo-300 dark:text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-88 animate-fade-in">
      <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">ফোকাস ও এক্সাম টাইমার</h4>
              <p className="text-[10px] text-slate-400 font-medium">StudyGen Focus Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-1 relative">
            {/* Sound Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                  soundEnabled 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="অ্যালার্ট সাউন্ড নির্বাচন করুন"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showSoundMenu && (
                <div className="absolute top-full right-0 mt-1.5 w-36 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-1 z-50 animate-fade-in text-xs">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase">
                    সাউন্ড নির্বাচন
                  </div>
                  {soundList.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSound(s.id)}
                      className={`w-full px-2 py-1.5 rounded-xl text-left font-medium transition flex items-center justify-between ${
                        selectedSound === s.id && soundEnabled
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{s.label}</span>
                      {selectedSound === s.id && soundEnabled && <Check className="w-3 h-3 text-indigo-600" />}
                    </button>
                  ))}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        setShowSoundMenu(false);
                      }}
                      className="w-full px-2 py-1 text-left text-slate-400 hover:text-rose-500 rounded-lg text-[11px]"
                    >
                      {soundEnabled ? '🔇 সাউন্ড মিউট করুন' : '🔊 সাউন্ড অন করুন'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="মিনিমাইজ করুন"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Display / Clean Manual Inline Edit Section */}
        <div className="py-4 text-center relative">
          {isCompleted ? (
            <div className="animate-fade-in space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>টাইম শেষ! চমৎকার একাগ্রতা</span>
              </div>
              <p className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">00:00</p>
            </div>
          ) : isEditing ? (
            <div className="animate-fade-in space-y-2.5">
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">মিনিট</label>
                  <input
                    ref={minInputRef}
                    type="number"
                    min="0"
                    max="999"
                    value={editMinutes}
                    onChange={(e) => setEditMinutes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="w-18 sm:w-20 text-center py-1.5 px-1 text-2xl sm:text-3xl font-black font-mono rounded-2xl bg-indigo-50/80 dark:bg-slate-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 focus:outline-none shadow-inner"
                  />
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-400 pb-1">:</span>
                <div className="flex flex-col items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">সেকেন্ড</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editSeconds}
                    onChange={(e) => setEditSeconds(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="w-18 sm:w-20 text-center py-1.5 px-1 text-2xl sm:text-3xl font-black font-mono rounded-2xl bg-indigo-50/80 dark:bg-slate-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>সেট করুন</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div 
                onClick={handleStartEdit}
                className="group inline-flex items-center justify-center gap-2 cursor-pointer px-3 py-1 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 transition-all"
                title="ক্লিক করে টাইম এডিট করুন"
              >
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {formatDigits(timeLeft)}
                </span>
                <span className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400">
                {mode === 'countdown' ? `${Math.floor(timeLeft / 60)} মি. ${timeLeft % 60} সে. কাউন্টডাউন` : 'স্টপওয়াচ মোড'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Fine-Tuning Increments (-1m, +1m, +5m) */}
        {mode === 'countdown' && !isEditing && (
          <div className="flex items-center justify-center gap-1.5 mb-3.5">
            <button
              onClick={() => handleAdjustSeconds(-60)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-0.5 cursor-pointer"
              title="১ মিনিট কমান"
            >
              <Minus className="w-3 h-3" />
              <span>1 মি.</span>
            </button>
            <button
              onClick={() => handleAdjustSeconds(60)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-0.5 cursor-pointer"
              title="১ মিনিট বাড়ান"
            >
              <Plus className="w-3 h-3" />
              <span>1 মি.</span>
            </button>
            <button
              onClick={() => handleAdjustSeconds(300)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-0.5 cursor-pointer"
              title="৫ মিনিট বাড়ান"
            >
              <Plus className="w-3 h-3" />
              <span>5 মি.</span>
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={() => {
              if (isEditing) handleSaveEdit();
              setIsRunning(!isRunning);
            }}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>পজ করুন</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>শুরু করুন</span>
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="রিসেট"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Presets Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              কুইক প্রিসেট:
            </span>
            <button
              onClick={handleStartEdit}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              ✏️ কাস্টম টাইম লিখুন
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: '15 মি.', min: 15 },
              { label: '25 মি.', min: 25 },
              { label: '45 মি.', min: 45 },
              { label: '60 মি.', min: 60 },
            ].map(preset => (
              <button
                key={preset.min}
                onClick={() => handleSetPreset(preset.min)}
                className={`py-1.5 text-[11px] font-bold rounded-xl transition cursor-pointer ${
                  mode === 'countdown' && durationMinutes === preset.min && !isEditing
                    ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleToggleStopwatch}
            className={`w-full py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
              mode === 'stopwatch'
                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            ⏱️ ফ্রি স্টপওয়াচ মোড ব্যবহার করুন
          </button>
        </div>
      </div>
    </div>
  );
};
