import { QuestionPaperData } from '../types/question-paper';

export const SAMPLE_EXAM_PAPERS: { id: string; name: string; description: string; data: QuestionPaperData }[] = [
  {
    id: 'h-math-cq',
    name: 'উচ্চতর গণিত - সৃজনশীল ও বহুনির্বাচনী (Class 10)',
    description: 'হাতে লেখা উদ্দীপক, জ্যামিতি, বীজগণিত ও ত্রিকোণমিতি মিশ্রিত পূর্ণাঙ্গ বোর্ড প্রশ্নপত্র',
    data: {
      header: {
        schoolName: 'রাজউক উত্তরা মডেল কলেজ, ঢাকা',
        examTitle: 'প্রাক-নির্বাচনি পরীক্ষা — ২০২৬',
        className: 'দশম শ্রেণি',
        subject: 'উচ্চতর গণিত (তত্ত্বীয়)',
        subjectCode: '১২৬',
        timeAllowed: '২ ঘণ্টা ৩০ মিনিট',
        fullMarks: '৫০',
        generalInstructions: 'বিশেষ দ্রষ্টব্য: প্রত্যেক বিভাগ থেকে কমপক্ষে একটি করে মোট ৫টি প্রশ্নের উত্তর দাও। ডানপাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক।'
      },
      twoColumnLayout: false,
      fontFamily: 'Noto Sans Bengali',
      fontSize: 12,
      sections: [
        {
          id: 'sec-1',
          title: 'ক-বিভাগ (বীজগণিত ও জ্যামিতি)',
          instruction: 'যেকোনো ৩টি প্রশ্নের উত্তর দাও',
          totalMarks: '৩ × ১০ = ৩০',
          questions: [
            {
              id: 'q-1',
              type: 'cq',
              number: '১',
              stem: 'একটি বহুপদী $P(x) = ax^3 + bx^2 + cx + d$ এবং অপর একটি ফাংশন $f(x) = \\frac{2x+3}{x-5}$ যেখানে $x \\neq 5$।',
              text: '',
              marks: 10,
              subQuestions: [
                { id: '1a', label: 'ক', text: '$f^{-1}(3)$ এর মান নির্ণয় করো।', marks: 2 },
                { id: '1b', label: 'খ', text: 'যদি $(x-2)$ এবং $(x+1)$ বহুপদী $P(x)$ এর দুটি উৎপাদক হয়, তবে দেখাও যে $a+c = b+d$।', marks: 4 },
                { id: '1c', label: 'গ', text: '$f(x)$ ফাংশনটির ডোমেন ও রেঞ্জ নির্ণয় করে ফাংশনটি এক-এক ও সার্বিক কিনা যাচাই করো।', marks: 4 }
              ]
            },
            {
              id: 'q-2',
              type: 'cq',
              number: '২',
              stem: 'একটি ত্রিভুজের তিনটি শীর্ষবিন্দুর স্থানাঙ্ক যথাক্রমে $A(2, 3)$, $B(-4, 1)$ এবং $C(6, -2)$।',
              text: '',
              marks: 10,
              subQuestions: [
                { id: '2a', label: 'ক', text: '$AB$ রেখাংশের দৈর্ঘ্য এবং ঢাল নির্ণয় করো।', marks: 2 },
                { id: '2b', label: 'খ', text: '$ABC$ ত্রিভুজটির ক্ষেত্রফল স্থানাঙ্ক জ্যামিতির সাহায্যে বের করো।', marks: 4 },
                { id: '2c', label: 'গ', text: '$A$ বিন্দুগামী এবং $BC$ বাহুর উপর অঙ্কিত লম্বের সমীকরণ নির্ণয় করো।', marks: 4 }
              ]
            }
          ]
        },
        {
          id: 'sec-2',
          title: 'খ-বিভাগ (ত্রিকোণমিতি ও সম্ভাবনা)',
          instruction: 'যেকোনো ২টি প্রশ্নের উত্তর দাও',
          totalMarks: '২ × ১০ = ২০',
          questions: [
            {
              id: 'q-3',
              type: 'cq',
              number: '৩',
              stem: 'যদি $\\tan \\theta + \\sec \\theta = x$ এবং $0 < \\theta < \\frac{\\pi}{2}$ হয়।',
              text: '',
              marks: 10,
              subQuestions: [
                { id: '3a', label: 'ক', text: 'প্রমাণ করো যে, $\\sin \\theta = \\frac{x^2-1}{x^2+1}$।', marks: 2 },
                { id: '3b', label: 'খ', text: 'সমাধান করো: $2\\sin^2\\theta + 3\\cos\\theta - 3 = 0$।', marks: 4 },
                { id: '3c', label: 'গ', text: 'যদি $x = \\sqrt{3}$ হয়, তবে $\\theta$ এর মান রেডিয়ান এককে নির্ণয় করো।', marks: 4 }
              ]
            },
            {
              id: 'q-4',
              type: 'mcq',
              number: '৪',
              text: 'একটি ছক্কা একবার নিক্ষেপ করা হলে বিজোড় মৌলিক সংখ্যা আসার সম্ভাবনা কত?',
              marks: 1,
              options: [
                { id: '4a', label: 'ক', text: '১/২' },
                { id: '4b', label: 'খ', text: '১/৩' },
                { id: '4c', label: 'গ', text: '২/৩' },
                { id: '4d', label: 'ঘ', text: '১/৬' }
              ],
              correctAnswer: 'খ'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'physics-board',
    name: 'পদার্থবিজ্ঞান - প্রথম সাময়িক পরীক্ষা (Class 9-10)',
    description: 'গতি, বল, কাজ ক্ষমতা শক্তি ভিত্তিক সৃজনশীল প্রশ্ন ও এমসিকিউ',
    data: {
      header: {
        schoolName: 'আইডিয়াল স্কুল অ্যান্ড কলেজ, মতিঝিল, ঢাকা',
        examTitle: 'প্রথম সাময়িক পরীক্ষা — ২০২৬',
        className: 'নবম শ্রেণি',
        subject: 'পদার্থবিজ্ঞান',
        subjectCode: '১৩৬',
        timeAllowed: '২ ঘণ্টা',
        fullMarks: '৫০',
        generalInstructions: 'বিশেষ দ্রষ্টব্য: চিত্রসমূহ স্পষ্ট করে খাতায় আঁকতে হবে। প্রয়োজনীয় একক উল্লেখ করো।'
      },
      twoColumnLayout: false,
      fontFamily: 'Noto Sans Bengali',
      fontSize: 12,
      sections: [
        {
          id: 'phy-sec-1',
          title: 'ক-বিভাগ (সৃজনশীল প্রশ্ন)',
          instruction: 'যেকোনো ৪টি প্রশ্নের উত্তর দাও',
          totalMarks: '৪ × ১০ = ৪০',
          questions: [
            {
              id: 'phy-1',
              type: 'cq',
              number: '১',
              stem: '$500\\text{ g}$ ভরের একটি স্থির বস্তুর উপর $20\\text{ N}$ বল $5\\text{ s}$ যাবত প্রয়োগ করা হলো। এরপর বল অপসারণ করা হলে বস্তুটি আরও $10\\text{ s}$ চলে থেমে যায়।',
              text: '',
              marks: 10,
              subQuestions: [
                { id: 'p1a', label: 'ক', text: 'ত্বরণ কাকে বলে? এর মাত্রা লিখো।', marks: 1 },
                { id: 'p1b', label: 'খ', text: 'ঘর্ষণ একটি প্রয়োজনীয় উপদ্রব — ব্যাখ্যা করো।', marks: 2 },
                { id: 'p1c', label: 'গ', text: 'প্রথম $5\\text{ s}$-এ বস্তুটি কত দূরত্ব অতিক্রম করবে নির্ণয় করো।', marks: 3 },
                { id: 'p1d', label: 'ঘ', text: 'উদ্দীপকের ঘটনাটি শক্তির সংরক্ষণশীলতা নীতি সমর্থন করে কি? গাণিতিক যুক্তি দাও।', marks: 4 }
              ]
            }
          ]
        },
        {
          id: 'phy-sec-2',
          title: 'খ-বিভাগ (বহুনির্বাচনী প্রশ্ন)',
          instruction: 'সকল প্রশ্নের উত্তর দাও',
          totalMarks: '১০ × ১ = ১০',
          questions: [
            {
              id: 'mcq-1',
              type: 'mcq',
              number: '১',
              text: 'বলের মাত্রা সমীকরণ নিচের কোনটি?',
              marks: 1,
              options: [
                { id: 'm1a', label: 'ক', text: '$[MLT^{-1}]$' },
                { id: 'm1b', label: 'খ', text: '$[MLT^{-2}]$' },
                { id: 'm1c', label: 'গ', text: '$[ML^2T^{-2}]$' },
                { id: 'm1d', label: 'ঘ', text: '$[ML^{-1}T^{-2}]$' }
              ],
              correctAnswer: 'খ'
            },
            {
              id: 'mcq-2',
              type: 'mcq',
              number: '২',
              text: 'পরন্ত বস্তুর তৃতীয় সূত্র অনুসারে দূরত্ব ($h$) ও সময় ($t$) এর সম্পর্ক কোনটি?',
              marks: 1,
              options: [
                { id: 'm2a', label: 'ক', text: '$h \\propto t$' },
                { id: 'm2b', label: 'খ', text: '$h \\propto t^2$' },
                { id: 'm2c', label: 'গ', text: '$h \\propto \\sqrt{t}$' },
                { id: 'm2d', label: 'ঘ', text: '$h \\propto \\frac{1}{t}$' }
              ],
              correctAnswer: 'খ'
            }
          ]
        }
      ]
    }
  }
];
