import { CommunityQuiz, QuizQuestion, QuizFeedback } from '../types/quiz';

const COMMUNITY_STORAGE_KEY = 'studygen_community_quizzes_v1';

export const INITIAL_COMMUNITY_QUIZZES: CommunityQuiz[] = [
  {
    id: 'comm-1',
    title: 'HTML5 & Modern CSS3 ইন্টারভিউ স্পেশাল',
    topic: 'Web Development & Frontend',
    author: 'সাদাত হাসান (Frontend Dev)',
    authorAvatar: '👨‍💻',
    createdAt: '২ ঘণ্টা আগে',
    upvotes: 12,
    downvotes: 1,
    isPermanentFeatured: true,
    isBlocked: false,
    playsCount: 142,
    feedbackList: [
      { id: 'f-1', user: 'রাফসান', comment: 'খুব চমৎকার ও প্র্যাকটিক্যাল প্রশ্ন!', vote: 'up', time: '১ ঘণ্টা আগে' },
      { id: 'f-2', user: 'তানভীর', comment: 'বক্স মডেলের ব্যাখ্যাটি অসাধারণ ছিল।', vote: 'up', time: '৩০ মিনিট আগে' }
    ],
    questions: [
      {
        id: 'q-h1',
        question: 'HTML5-এ语义িক (Semantic) ট্যাগ ব্যবহারের প্রধান সুবিধা কী?',
        options: [
          'এসইও (SEO) এবং স্ক্রিন রিডারের জন্য স্পষ্ট অর্থ প্রদান',
          'ওয়েব পেজের লোডিং স্পিড ১০ গুণ বাড়িয়ে দেয়',
          'জাভাস্ক্রিপ্ট লেখার প্রয়োজন বন্ধ করে',
          'শুধুমাত্র ফন্ট সাইজ বড় করতে সাহায্য করে'
        ],
        correctAnswer: 0,
        explanation: 'Semantic ট্যাগ (যেমন <article>, <section>, <nav>) ব্রাউজার এবং সার্চ ইঞ্জিনকে পেজের কন্টেন্টের অর্থ স্পষ্টভাবে বোঝায়।',
        category: 'HTML5',
        difficulty: 'easy'
      },
      {
        id: 'q-h2',
        question: 'CSS Flexbox-এ আইটেমগুলোকে উল্লম্বভাবে (Vertical) মাঝখানে আনতে কোন প্রোপার্টি ব্যবহৃত হয়?',
        options: ['justify-content: center;', 'align-items: center;', 'text-align: center;', 'vertical-align: middle;'],
        correctAnswer: 1,
        explanation: 'Flexbox-এ ক্রস এক্সিস বরাবর আইটেমগুলোকে মাঝখানে বিন্যস্ত করতে align-items: center ব্যবহৃত হয়।',
        category: 'CSS3',
        difficulty: 'medium'
      },
      {
        id: 'q-h3',
        question: 'CSS Box Model-এর সঠিক সিকোয়েন্স (ভেতর থেকে বাইরে) কোনটি?',
        options: [
          'Content → Padding → Border → Margin',
          'Content → Margin → Border → Padding',
          'Padding → Content → Border → Margin',
          'Border → Padding → Content → Margin'
        ],
        correctAnswer: 0,
        explanation: 'বক্স মডেলের ভেতর থেকে বাইরে ক্রমান্বয়ে: Content (মূল কন্টেন্ট), Padding (ভেতরের ফাঁকা স্থান), Border (বর্ডার), Margin (বাইরের ফাঁকা স্থান)।',
        category: 'CSS3',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'comm-2',
    title: 'বিসিএস ও সরকারি চাকরি সাধারণ জ্ঞান ২০২৬',
    topic: 'General Knowledge & Bangladesh Affairs',
    author: 'ড. মাহমুদুল করিম',
    authorAvatar: '🏛️',
    createdAt: '৫ ঘণ্টা আগে',
    upvotes: 9, // 1 away from 10!
    downvotes: 0,
    isPermanentFeatured: false,
    isBlocked: false,
    playsCount: 98,
    feedbackList: [
      { id: 'f-3', user: 'মাহিন', comment: '১টি লাইক বাকি পার্মানেন্ট হতে! আমি আপভোট দিলাম।', vote: 'up', time: '১৫ মিনিট আগে' }
    ],
    questions: [
      {
        id: 'q-b1',
        question: 'পদ্মা বহুমুখী সেতুর মোট স্প্যান সংখ্যা কতটি?',
        options: ['৩৯টি', '৪০টি', '৪১টি', '৪২টি'],
        correctAnswer: 2,
        explanation: 'পদ্মা সেতুতে মোট ৪১টি স্প্যান এবং ৪২টি পিলার রয়েছে। মোট দৈর্ঘ্য ৬.১৫ কিলোমিটার।',
        category: 'বাংলাদেশ বিষয়াবলী',
        difficulty: 'easy'
      },
      {
        id: 'q-b2',
        question: 'বাংলাদেশের সংবিধানে মূলনীতি কয়টি?',
        options: ['৩টি', '৪টি', '৫টি', '৭টি'],
        correctAnswer: 1,
        explanation: 'সংবিধানের ৮ নং অনুচ্ছেদ অনুযায়ী চারটি মূলনীতি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা।',
        category: 'সংবিধান',
        difficulty: 'medium'
      },
      {
        id: 'q-b3',
        question: 'ইউনেস্কো কত সালে সুন্দরবনকে বিশ্ব ঐতিহ্য (World Heritage) ঘোষণা করে?',
        options: ['১৯৯৭ সালে', '১৯৯৯ সালে', '২০০১ সালে', '১৯৯২ সালে'],
        correctAnswer: 0,
        explanation: '১৯৯৭ সালের ৬ই ডিসেম্বর ইউনেস্কো সুন্দরবনকে ৭৯৮তম বিশ্ব ঐতিহ্য এলাকা হিসেবে ঘোষণা করে।',
        category: 'সাধারণ জ্ঞান',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'comm-3',
    title: 'উচ্চতর গণিত ও জ্যামিতি চ্যালেঞ্জ (SSC/HSC)',
    topic: 'Higher Mathematics',
    author: 'সুমাইয়া আক্তার (Math Mentor)',
    authorAvatar: '📐',
    createdAt: '১ দিন আগে',
    upvotes: 15,
    downvotes: 2,
    isPermanentFeatured: true,
    isBlocked: false,
    playsCount: 215,
    feedbackList: [],
    questions: [
      {
        id: 'q-m1',
        question: 'দ্বিঘাত সমীকরণ ax² + bx + c = 0 এর মূলদ্বয় বাস্তব ও সমান হওয়ার শর্ত কী?',
        options: ['b² - 4ac > 0', 'b² - 4ac = 0', 'b² - 4ac < 0', 'b² + 4ac = 0'],
        correctAnswer: 1,
        explanation: 'নিশ্চায়ক D = b² - 4ac = 0 হলে দ্বিঘাত সমীকরণের মূলদ্বয় বাস্তব ও পরস্পর সমান হয়।',
        category: 'বীজগণিত',
        difficulty: 'easy'
      },
      {
        id: 'q-m2',
        question: 'সমকোণী ত্রিভুজের অতিভুজ ১৩ সে.মি. এবং একটি বাহু ১২ সে.মি. হলে অপর বাহুটি কত?',
        options: ['৫ সে.মি.', '৬ সে.মি.', '৭ সে.মি.', '৮ সে.মি.'],
        correctAnswer: 0,
        explanation: 'পিথাগোরাসের সূত্রানুযায়ী: অপর বাহু = √(১৩² - ১২²) = √(১৬৯ - ১৪৪) = √২৫ = ৫ সে.মি.।',
        category: 'জ্যামিতি',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'comm-4',
    title: 'ফালতু টেস্ট কুইজ (উদাহরণস্বরূপ ব্লক হওয়ার যোগ্য)',
    topic: 'Spam / Inappropriate Test',
    author: 'অজ্ঞাত ইউজার',
    authorAvatar: '🤖',
    createdAt: '৩ দিন আগে',
    upvotes: 1,
    downvotes: 4, // 1 away from 5 (block limit)!
    isPermanentFeatured: false,
    isBlocked: false,
    playsCount: 12,
    feedbackList: [
      { id: 'f-4', user: 'সায়েম', comment: 'কোনো সঠিক প্রশ্ন নেই এখানে।', vote: 'down', time: '১ দিন আগে' }
    ],
    questions: [
      {
        id: 'q-sp1',
        question: 'এটি একটি টেস্ট অপূর্ণ প্রশ্ন?',
        options: ['অপশন ১', 'অপশন ২', 'অপশন ৩', 'অপশন ৪'],
        correctAnswer: 0,
        explanation: 'কোনো ব্যাখ্যা দেওয়া হয়নি।',
        category: 'টেস্ট',
        difficulty: 'easy'
      }
    ]
  }
];

export function getCommunityQuizzes(): CommunityQuiz[] {
  if (typeof window === 'undefined') return INITIAL_COMMUNITY_QUIZZES;
  try {
    const data = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_QUIZZES));
      return INITIAL_COMMUNITY_QUIZZES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMUNITY_QUIZZES;
  }
}

export function saveCommunityQuizzes(quizzes: CommunityQuiz[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(quizzes));
  } catch (err) {
    console.error('Failed to save community quizzes:', err);
  }
}

export function createAndPublishCommunityQuiz(
  title: string,
  topic: string,
  author: string,
  questions: QuizQuestion[]
): CommunityQuiz {
  const current = getCommunityQuizzes();
  const newQuiz: CommunityQuiz = {
    id: `comm-user-${Date.now()}`,
    title: title.trim() || 'আমার তৈরি কাস্টম কুইজ গেম',
    topic: topic.trim() || 'কাস্টম স্টাডি',
    author: author.trim() || 'লার্নার (User)',
    authorAvatar: '🎯',
    createdAt: 'এইমাত্র',
    questions,
    upvotes: 1, // Author's first upvote
    downvotes: 0,
    userVote: 'up',
    isPermanentFeatured: false,
    isBlocked: false,
    playsCount: 1,
    feedbackList: []
  };

  const updated = [newQuiz, ...current];
  saveCommunityQuizzes(updated);
  return newQuiz;
}

export function voteOnCommunityQuiz(
  quizId: string,
  voteType: 'up' | 'down',
  userFeedbackText?: string,
  userName?: string
): { success: boolean; quiz: CommunityQuiz; isNewFeatured: boolean; isNewBlocked: boolean } {
  const quizzes = getCommunityQuizzes();
  const quizIndex = quizzes.findIndex(q => q.id === quizId);

  if (quizIndex === -1) {
    throw new Error('Quiz not found');
  }

  const quiz = { ...quizzes[quizIndex] };
  let isNewFeatured = false;
  let isNewBlocked = false;

  // Handle vote toggle or switch
  if (quiz.userVote === voteType) {
    // Retract vote
    if (voteType === 'up') quiz.upvotes = Math.max(0, quiz.upvotes - 1);
    if (voteType === 'down') quiz.downvotes = Math.max(0, quiz.downvotes - 1);
    quiz.userVote = null;
  } else {
    // If user previously voted opposite, decrement that
    if (quiz.userVote === 'up') quiz.upvotes = Math.max(0, quiz.upvotes - 1);
    if (quiz.userVote === 'down') quiz.downvotes = Math.max(0, quiz.downvotes - 1);

    // Apply new vote
    if (voteType === 'up') quiz.upvotes += 1;
    if (voteType === 'down') quiz.downvotes += 1;
    quiz.userVote = voteType;

    // Optional feedback comment
    if (userFeedbackText && userFeedbackText.trim()) {
      const feedback: QuizFeedback = {
        id: `fb-${Date.now()}`,
        user: userName?.trim() || 'বেনামী শিক্ষার্থী',
        comment: userFeedbackText.trim(),
        vote: voteType,
        time: 'এইমাত্র'
      };
      quiz.feedbackList = [feedback, ...(quiz.feedbackList || [])];
    }
  }

  // Check Rules:
  // Rule 1: 10+ Upvotes = Permanent Featured
  if (quiz.upvotes >= 10 && !quiz.isPermanentFeatured) {
    quiz.isPermanentFeatured = true;
    isNewFeatured = true;
  } else if (quiz.upvotes < 10) {
    quiz.isPermanentFeatured = false;
  }

  // Rule 2: 5+ Downvotes = Blocked & Hidden
  if (quiz.downvotes >= 5 && !quiz.isBlocked) {
    quiz.isBlocked = true;
    isNewBlocked = true;
  } else if (quiz.downvotes < 5) {
    quiz.isBlocked = false;
  }

  quizzes[quizIndex] = quiz;
  saveCommunityQuizzes(quizzes);

  return { success: true, quiz, isNewFeatured, isNewBlocked };
}
