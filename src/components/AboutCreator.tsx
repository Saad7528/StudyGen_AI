'use client';

import React, { useState } from 'react';
import { 
  User, 
  ExternalLink, 
  Mail, 
  Code, 
  Sparkles, 
  Heart, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  Cpu, 
  Copy, 
  Check, 
  Award,
  BookOpen
} from 'lucide-react';

export const AboutCreator: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = 'Saad0174742@gmail.com';
  const portfolioUrl = 'https://saad-portfolio-eta-three.vercel.app/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const projectModules = [
    {
      title: 'ছবি থেকে প্রশ্নপত্র (Doc Generator)',
      desc: 'হাতে লেখা বা প্রিন্ট করা প্রশ্নের ছবি থেকে এআই ভিশন দিয়ে ১-ক্লিকে ১০০% গুগল ডক এডিটেবল (.docx) ২-কলাম প্রশ্নপত্র তৈরি।',
      icon: Sparkles,
      color: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'টেক্সট ডিফারেন্স ফাইন্ডার (Diff Checker)',
      desc: 'দুটি প্যারাগ্রাফ বা টেক্সটের মধ্যে প্রতিটি ক্যারেক্টার, শব্দ ও লাইনের পার্থক্য বিশ্লেষণ এবং বিশদ পরিসংখ্যান।',
      icon: Layers,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'এআই ব্যাকরণ ও বানান পরীক্ষক',
      desc: 'বাংলা ও ইংরেজি লেখার বানান, ব্যাকরণ ও বিরামচিহ্নের ভুল শনাক্তকরণ এবং ১-ক্লিকে স্বয়ংক্রিয় সংশোধন।',
      icon: CheckCircle2,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'স্টেপ-বাই-স্টেপ সমীকরণ সমাধানকারী',
      desc: 'বীজগণিত, দ্বিঘাত সমীকরণ, ত্রিকোণমিতি ও ক্যালকুলাসের প্রতিটি ধাপের ব্যাখ্যা সহ সমাধান ও গ্রাফ।',
      icon: Cpu,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'এডুকেশনাল টুলকিট (GPA, Base, OCR)',
      desc: 'এসএসসি/এইচএসসি জিপিএ ক্যালকুলেটর, বাইনারি/ডেসিমেল কনভার্টার, দ্রুত টেক্সট ওসিআর ও ফর্মুলা ব্যাংক।',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const techStack = [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'Google Gemini AI Vision',
    'Docx.js Engine',
    'KaTeX Math Engine',
    'MathJS',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Creator Profile Card */}
      <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative z-10">
          {/* Real Avatar / Profile Photo */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-1 shadow-2xl shadow-indigo-500/30 shrink-0 group hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[22px] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/saad-profile.jpg"
                alt="S. M. Amirul Islam Saad"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> ক্রিয়েটর ও সফটওয়্যার ইঞ্জিনিয়ার
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              S. M. Amirul Islam Saad
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
              Software Engineer & Creator of <strong className="text-indigo-600 dark:text-indigo-400">StudyGen AI (স্টাডিজেন এআই)</strong>। 
              শিক্ষার্থী, শিক্ষক ও সাধারণ মানুষের প্রাত্যহিক শিক্ষা ও গবেষণামূলক কাজকে সহজ, নির্ভুল এবং সময়সাশ্রয়ী করতে আধুনিক এআই ও ওয়েব প্রযুক্তির সমন্বয়ে তিনি এই প্ল্যাটফর্মটি তৈরি করেছেন।
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>পোর্টফোলিও ভিজিট করুন (Portfolio)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Mail className="w-4 h-4 text-indigo-500" />}
                <span>{copiedEmail ? 'ইমেইল কপি হয়েছে!' : email}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About The Platform Section */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500/20" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              “StudyGen AI (স্টাডিজেন এআই)” সৃষ্টির পটভূমি
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              শিক্ষা, প্রযুক্তির সহজলভ্যতা এবং সৃজনশীল সমাধান
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          বাংলাদেশের শিক্ষক ও শিক্ষার্থীদের প্রতিদিন প্রশ্নপত্র তৈরি, সমাধান যাচাই, ব্যাকরণগত শুদ্ধতা নিশ্চিত করা এবং গণিতের জটিল সমীকরণ সমাধানে প্রচুর সময় ব্যয় করতে হয়। 
          <strong> S. M. Amirul Islam Saad </strong> এই চ্যালেঞ্জগুলোকে সহজ ও আনন্দময় করতে এক প্ল্যাটফর্মের ভেতরে বহুমুখী সমাধান তৈরি করেছেন—যেখানে শুধু একটি ক্লিকের মাধ্যমেই জটিল সব কাজ সম্পন্ন করা সম্ভব।
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {projectModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact & Portfolio Direct Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/40 border border-indigo-500/30 text-center space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-white">
          যোগাযোগ ও আরও প্রজেক্ট দেখতে চান?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          সফটওয়্যার ডেভেলপমেন্ট, এআই ইন্টিগ্রেশন অথবা যেকোনো পরামর্শের জন্য সাদ-এর সাথে সরাসরি যোগাযোগ করুন।
        </p>
        <div className="pt-2">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl transition active:scale-95"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>https://saad-portfolio-eta-three.vercel.app/</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
