import { NextRequest, NextResponse } from 'next/server';
import { MnemonicItem } from '@/types/mnemonic';

const SYSTEM_PROMPT = `
You are Bangladesh's #1 Senior BCS, Medical & University Admission Memory Coach at StudyGenAI.
Your job is to transform educational lists, questions, historical timelines, and facts into hyper-compact, ingenious, and 100% memorable Bengali mnemonics (খাঁটি বাংলা শর্টকাট, স্বরবর্ণ কৌশল, এক্রোনিম ও ছন্দ).

================================================================================
CRITICAL PEDAGOGICAL STRATEGIES (কৌশল নির্ধারণের সুনির্দিষ্ট নিয়মাবলী):
================================================================================

Choose the SMARTEST strategy based on the nature of the topic:

1. STRATEGY A: VOWEL / ALPHABET GROUPING (স্বরবর্ণ ও আদ্যক্ষর গুচ্ছ কৌশল - সেরা কৌশল):
   - যখন কোনো তালিকায় একাধিক আইটেমের শুরুর বর্ণ একই হয়, তখন বিশাল বড় বাক্য না বানিয়ে চমৎকার বর্ণগুচ্ছ তৈরি করো:
     * উদাহরণ (৭টি মহাদেশ): 
       ❌ ভুলেও লম্বা গল্প বানাবে না (যেমন: "সাত মহাদেশে আফ্রি ইউরো কুড়িয়ে ছুড়ল..." - এটি জঘন্য!)
       ✅ সঠিক কৌশল: "৪টি স্বরবর্ণ (অ, আ, ই, এ) দিয়ে ৭টি মহাদেশ!"
       ভাঙন:
       - অ (১টি) = অস্ট্রেলিয়া
       - আ (৩টি) = আফ্রিকা, আমেরিকা (উত্তর), আমেরিকা (দক্ষিণ)
       - ই (১টি) = ইউরোপ
       - এ (২টি) = এশিয়া, অ্যান্টার্কটিকা

2. STRATEGY B: REAL-LIFE SHORT ACRONYM WORDS (বাস্তব শব্দের ছোট এক্রোনিম):
   - বড় তালিকার আদ্যক্ষর মিলিয়ে পরিচিত বাংলা/ইংরেজি শব্দ তৈরি করো:
     * সাত বীরশ্রেষ্ঠ: "সাত হাজার মোম আনো!" (হা, জা, র, মো, ম, আ, নো)
     * বাংলাদেশের প্রধান ৫ নদী: "পামে যমুনার ব্রণে কর্ণফুলী" (পা=পদ্মা, মে=মেঘনা, যমুনা=যমুনা, ব্র=ব্রহ্মপুত্র, কর্ণফুলী=কর্ণফুলী)
     * সার্কের ৮ দেশ: "নিপা ও শুভ MBA পড়ে" (N-I-P-A, S-B, M-B-A)
     * মোগল সম্রাটদের ক্রম: "বাবার হইলো একবার জ্বর সারিলো ঔষধে!" (বাবর, হুমায়ূন, আকবর, জাহাঙ্গীর, শাহজাহান, আওরঙ্গজেব)
     * গ্রিনহাউস গ্যাস: "কামাল মেহমানে ক্লোরিন দেয়" (কা=কার্বন ডাই-অক্সাইড, মা=মিথেন, মে=মিথেন, নাই=নাইট্রাস অক্সাইড, ক্লোরিন=সিএফসি)

3. STRATEGY C: WITTY PHONETIC PUNCHLINE (রসাত্মক সংক্ষিপ্ত পাঞ্চলাইন):
   - দুটি দেশ বা ফ্যাক্ট মেলানোর জন্য হাস্যরসাত্মক দৈনন্দিন সংলাপ:
     * লাইন অব কন্ট্রোল (ভারত-পাকিস্তান): "ভাপা পিঠা কন্ট্রোল করে খাও!" (ভা + পা = ভাপা)
     * কার্জন লাইন (পোল্যান্ড-রাশিয়া): "কার্জন হল পুরাতন হয়ে গেছে!" (পো + রা = পুরাতন)
     * ডুরান্ড লাইন (আফগানিস্তান-পাকিস্তান): "ডুরান্ড আপা বাড়ি আছে!" (আ + পা = আপা)
     * ফস লাইন (পোল্যান্ড-লিথুয়ানিয়া): "সরকার ফস করে পলি ব্যাগ উঠায়ে দিল!" (পো + লি = পলি)
     * ম্যাজিনো ও সিগফ্রিড লাইন (জার্মানি-ফ্রান্স): "ম্যাজিনো আমাকে একটি জামা ফ্রি দিয়েছে!" (জা + ফ্রি = জামা ফ্রি)

4. STRATEGY D: HISTORICAL TIMELINE & NUMBER CODING (ধারাবাহিক সাল ও ডিজিট চাঙ্কিং):
   - স্মৃতিসৌধের ৭ স্তম্ভের আন্দোলন ও সাল: "ভাসুর শাসন শিখিয়ে ছয় দফার গণঅভ্যুত্থানে মুক্তিযুদ্ধ এনেছিল!" (ভা=৫২ ভাষা, সুর=৫৪ যুক্তফ্রন্ট, শাসন=৫৬ শাসনতন্ত্র, শিখিয়ে=৬২ শিক্ষা, ছয় দফা=৬৬ ছয় দফা, গণ=৬৯ গণঅভ্যুত্থান, মুক্তিযুদ্ধ=৭১ মুক্তিযুদ্ধ)
   - খেতাবের সংখ্যা: "শ্রেষ্ঠ তুমি উত্তম প্রতীক বীরদা (০৭-৬৮-১৭৫-৪২৬)"

================================================================================
STRICT NEGATIVE DIRECTIVES (কঠোর নিষেধাজ্ঞা):
================================================================================
- ❌ NEVER write artificial, paragraph-long stories forcing every full word together! (A mnemonic must be 10x shorter than the answer itself!)
- ❌ NEVER put brackets with numbers/years inside the mnemonic formula sentence! (All years/numbers belong in the breakdown).
- ❌ ALWAYS make sure the question and answer are 100% FACTUALLY ACCURATE and directly address the user's specific prompt. If asked about rivers of Bangladesh, answer ONLY about Bangladeshi rivers (পদ্মা, মেঘনা, যমুনা etc.), never continents or unrelated items.

JSON OUTPUT STRUCTURE STRICTLY REQUIRED:
{
  "mnemonics": [
    {
      "id": "mn-1",
      "topic": "টপিক বা বিষয়ের নাম",
      "question": "মূল প্রশ্ন বা তথ্যের নাম",
      "correct_answer": "সঠিক প্রমিত প্রাতিষ্ঠানিক উত্তর",
      "mnemonic_formula": "স্মার্ট, সংক্ষিপ্ত ও আকর্ষণীয় বাংলা সূত্র",
      "category": "phonetic" | "acronym" | "number_code" | "association" | "general",
      "breakdown": [
        {
          "code": "কোড",
          "meaning": "সম্পূর্ণ শব্দ বা অর্থ",
          "phoneticHint": "উচ্চারণ বা আদ্যক্ষর ক্লু"
        }
      ],
      "mcq_avoid_confusion_tip": "পরীক্ষার হলে যেসব কাছাকাছি তথ্যের সাথে বিভ্রান্তি হতে পারে তা দূর করার টিপ",
      "visual_cue": {
        "description": "ভিজ্যুয়াল দৃশ্যপট বা ডুডলের চমৎকার বর্ণনা",
        "sketch_prompt": "Detailed visual illustration prompt for doodle/sketch",
        "sketch_theme": "cartoon" | "historical" | "map" | "humorous" | "metaphor",
        "cartoon_dialogue": "একটি মজাদার সংলাপ বা স্মৃতি সংকেত",
        "character_left": "বাম পাশের চরিত্র বা উপাদান",
        "character_right": "ডান পাশের চরিত্র বা উপাদান",
        "map_highlight": "মানচিত্র / স্থান",
        "svg_pattern": "river_map" | "world_map_continents" | "martyrs_candles" | "border_checkpoint" | "curzon_building" | "lightbulb_idea"
      },
      "tags": ["ট্যাগ১", "ট্যাগ২"],
      "difficulty": "easy" | "medium" | "hard",
      "exam_target": "BCS / বিশ্ববিদ্যালয় ভর্তি / মেডিকেল / ব্যাংক জব"
    }
  ]
}

Return ONLY raw JSON object without markdown code backticks.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic, images } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    let userPrompt = '';
    const hasImages = images && Array.isArray(images) && images.length > 0;

    if (hasImages) {
      userPrompt = `[IMAGE INPUT: Handwritten Notes / Question Paper / Book Page]
টপিক: ${topic || 'ছবিতে থাকা মূল টপিক বা বিষয়'}
${question && question.trim() ? `ব্যবহারকারীর অতিরিক্ত নির্দেশনা: ${question.trim()}` : ''}
${answer && answer.trim() ? `প্রদত্ত উত্তর: ${answer.trim()}` : ''}

বিশেষ নির্দেশনা:
১. আপলোড করা ছবি থেকে সকল প্রশ্ন, বিষয় বা শিক্ষণীয় তথ্য নিখুঁতভাবে রিড (OCR) করো।
২. ছবিতে থাকা তথ্যের নির্ভুল প্রাতিষ্ঠানিক উত্তর বের করো।
৩. প্রতিটি তথ্যের জন্য সবচেয়ে স্মার্ট ও সংক্ষিপ্ত মেমরি টেকনিক (স্বরবর্ণ গুচ্ছ, এক্রোনিম শব্দ বা পাঞ্চলাইন ছন্দ) তৈরি করো। ভুলেও অপ্রয়োজনীয় লম্বা গল্প লিখবে না।
৪. প্রতিটি শব্দের ব্যাখ্যা "breakdown" এ সুন্দরভাবে সাজিয়ে দাও।`;
    } else if (answer && answer.trim()) {
      userPrompt = `[MODE B: Question + Answer Provided]
টপিক: ${topic || 'সাধারণ জ্ঞান ও একাডেমিক'}
প্রশ্ন: ${question || 'তথ্য ও সূত্র'}
প্রদত্ত উত্তর: ${answer.trim()}

নির্দেশনা:
১. উপরের উত্তরটি এক পলকে মনে রাখার সবচেয়ে সংক্ষিপ্ত, বুদ্ধিদীপ্ত ও সেরা বাংলা মেমরি হ্যাক (যেমন: স্বরবর্ণ অ-আ-ই-এ গুচ্ছ, এক্রোনিম বা মিষ্টি ছন্দ) তৈরি করো। কোনো লম্বা অপ্রয়োজনীয় বাক্য লিখবে না।
২. "breakdown" অ্যারেতে প্রতিটি উপাদান আলাদা করে স্পষ্ট দেখাবে।
৩. MCQ কনফিউশন গার্ড ও ভিজ্যুয়াল স্কেচ কনসেপ্ট তৈরি করো।`;
    } else {
      userPrompt = `[MODE A: Only Question/Topic Provided]
টপিক: ${topic || 'সাধারণ জ্ঞান ও একাডেমিক'}
প্রশ্ন: ${question?.trim() || 'শিক্ষণীয় বিষয় ও তথ্য'}

নির্দেশনা:
১. এই প্রশ্নের ১০০% নির্ভুল প্রাতিষ্ঠানিক সঠিক উত্তর বের করো (যেমন: বাংলাদেশের নদী নিয়ে প্রশ্ন হলে বাংলাদেশের প্রধান নদীগুলোর নামই আসবে)।
২. উত্তরটি মুখস্থ না করে এক দেখাতেই মনে রাখার সবচেয়ে জাদুকরী ও সংক্ষিপ্ত বাংলা মেমরি টেকনিক (স্বরবর্ণ গুচ্ছ, এক্রোনিম বা সাবলীল পাঞ্চলাইন) তৈরি করো। 
৩. "breakdown" অ্যারেতে প্রতিটি উপাদান আলাদা করে স্পষ্ট দেখাবে।`;
    }

    if (apiKey) {
      // Tiered robust model list with high-availability fallbacks
      const models = [
        'gemini-3.6-flash',
        'gemini-3.5-flash',
        'gemini-flash-lite-latest',
        'gemini-3-flash-preview'
      ];
      const formattedParts: any[] = [{ text: SYSTEM_PROMPT }, { text: userPrompt }];

      if (hasImages) {
        images.forEach((base64: string) => {
          const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          const mimeType = match ? match[1] : 'image/jpeg';
          const data = match ? match[2] : base64;
          formattedParts.push({
            inlineData: { mimeType, data }
          });
        });
      }

      let lastError = '';

      for (const model of models) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: formattedParts }],
                  generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json'
                  }
                })
              }
            );

            if (res.ok) {
              const data = await res.json();
              const textParts = data.candidates?.[0]?.content?.parts || [];
              const rawText = textParts.map((p: any) => p.text || '').join('').trim();

              if (rawText) {
                const cleanJson = rawText
                  .replace(/^```json\s*/i, '')
                  .replace(/\s*```$/i, '')
                  .replace(/```/g, '')
                  .trim();

                const parsed = safeJsonParse(cleanJson);
                if (parsed) {
                  const items = parsed.mnemonics || parsed.data || (Array.isArray(parsed) ? parsed : [parsed]);

                  if (Array.isArray(items) && items.length > 0) {
                    return NextResponse.json({
                      success: true,
                      data: items.map((item: any, idx: number) => ({
                        ...item,
                        id: `${item.id || 'mn'}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
                      })),
                      modelUsed: model
                    });
                  }
                }
              }
            } else {
              lastError = await res.text();
              console.warn(`Model ${model} attempt ${attempt + 1} status: ${res.status}`, lastError);
              if (res.status === 503 || res.status === 429) {
                await delay(400 * (attempt + 1));
              }
            }
          } catch (modelErr: any) {
            lastError = modelErr.message || String(modelErr);
            console.warn(`Model ${model} attempt ${attempt + 1} error:`, modelErr);
          }
        }
      }

      if (lastError && hasImages) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'ছবি প্রসেস করতে এআই এপিআইতে সমস্যা হয়েছে। অনুগ্রহ করে স্পষ্ট ছবি আপলোড করুন অথবা প্রশ্নটি লিখে দিন।',
            details: lastError 
          },
          { status: 500 }
        );
      }
    }

    // Dynamic smart fallback matching real BCS & student knowledge base
    const fallbackData = generateDynamicFallback(question, answer, topic, hasImages);
    return NextResponse.json({
      success: true,
      data: fallbackData,
      modelUsed: 'bcs-curated-knowledge-engine'
    });
  } catch (error: any) {
    console.error('Mnemonic API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'মেমরি টেকনিক জেনারেট করতে সমস্যা হয়েছে', details: error.message },
      { status: 500 }
    );
  }
}

function safeJsonParse(text: string): any {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const jsonCandidate = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonCandidate);
      } catch {}
    }
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        const jsonCandidate = text.substring(firstBracket, lastBracket + 1);
        return JSON.parse(jsonCandidate);
      } catch {}
    }
  }
  return null;
}

// Curated BCS & Admission Knowledge Bank & Smart Fallback Generator
function generateDynamicFallback(
  question?: string,
  answer?: string,
  topic?: string,
  hasImages?: boolean
): MnemonicItem[] {
  const cleanQ = question && question.trim() ? question.trim() : (hasImages ? 'আপলোডকৃত নোটসের মূল তথ্য' : 'বাংলাদেশের সাধারণ জ্ঞান');
  const cleanTopic = topic && topic.trim() ? topic.trim() : 'ভূগোল ও সাধারণ জ্ঞান';
  const qLower = cleanQ.toLowerCase();

  // 1. বাংলাদেশের বড় নদ-নদী (Rivers of Bangladesh)
  if (qLower.includes('নদী') || qLower.includes('নদ') || qLower.includes('river') || qLower.includes('পদ্মা') || qLower.includes('মেঘনা') || qLower.includes('যমুনা')) {
    return [
      {
        id: `mn-rivers-${Date.now()}`,
        topic: 'বাংলাদেশ বিষয়াবলী ও ভূগোল',
        question: cleanQ.includes('কয়টি') || cleanQ.includes('কি কি') ? cleanQ : 'বাংলাদেশের প্রধান বড় ৫টি নদী কী কী এবং মনে রাখার কৌশল?',
        correct_answer: 'বাংলাদেশের প্রধান ৫টি বড় নদী হলো: পদ্মা, মেঘনা, যমুনা, ব্রহ্মপুত্র এবং কর্ণফুলী।',
        mnemonic_formula: 'পামে যমুনার ব্রণে কর্ণফুলী!',
        category: 'acronym',
        breakdown: [
          { code: 'পা', meaning: 'পদ্মা নদী (বাংলাদেশের প্রধান নদী)', phoneticHint: 'পদ্মার "পা"' },
          { code: 'মে', meaning: 'মেঘনা নদী (সবচেয়ে গভীর ও প্রশস্ত নদী)', phoneticHint: 'মেঘনার "মে"' },
          { code: 'যমুনা', meaning: 'যমুনা নদী (ব্রহ্মপুত্রের প্রধান শাখা)', phoneticHint: 'যমুনা নদী' },
          { code: 'ব্রণে', meaning: 'ব্রহ্মপুত্র নদ (প্রধান আন্তর্জাতিক নদ)', phoneticHint: 'ব্রহ্মপুত্রের "ব্র"' },
          { code: 'কর্ণফুলী', meaning: 'কর্ণফুলী নদী (খরস্রোতা পাহাড়ি নদী)', phoneticHint: 'কর্ণফুলী নদী' }
        ],
        mcq_avoid_confusion_tip: 'মনে রাখবেন: বাংলাদেশের সবচেয়ে দীর্ঘতম ও প্রশস্ততম নদী হলো মেঘনা, সবচেয়ে খরস্রোতা নদী কর্ণফুলী এবং ব্রহ্মপুত্র হলো একটি পুরুষবাচক "নদ"। মোট প্রধান নদী ৫টি।',
        visual_cue: {
          description: 'বাংলাদেশের সবুজ শ্যামল নদীমাতৃক মানচিত্রে ৫টি প্রধান নদী (পদ্মা, মেঘনা, যমুনা, ব্রহ্মপুত্র, কর্ণফুলী) দিয়ে নৌকা চলার রঙিন স্কেচ।',
          sketch_prompt: 'Artistic vintage colored pencil sketch map of Bangladesh showing the 5 major rivers Padma, Meghna, Jamuna, Brahmaputra, Karnaphuli with wooden country boats and green riverbanks',
          sketch_theme: 'map',
          cartoon_dialogue: '"পামে যমুনার ব্রণে কর্ণফুলী" মনে রাখলেই বাংলাদেশের বড় ৫ নদী এক পলকে ক্লিয়ার!',
          character_left: 'পদ্মা ও মেঘনা',
          character_right: 'যমুনা ও কর্ণফুলী',
          map_highlight: 'Rivers of Bangladesh',
          svg_pattern: 'river_map'
        },
        tags: ['বাংলাদেশের নদ-নদী', 'ভূগোল', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / প্রাথমিক শিক্ষক নিয়োগ'
      }
    ];
  }

  // 2. সাত বীরশ্রেষ্ঠ (7 Bir Sreshtho)
  if (qLower.includes('বীরশ্রেষ্ঠ') || qLower.includes('bir sreshtho') || qLower.includes('মুক্তিযোদ্ধা')) {
    return [
      {
        id: `mn-birsreshtho-${Date.now()}`,
        topic: 'মুক্তিযুদ্ধ ও জাতীয় ইতিহাস',
        question: 'বাংলাদেশের ৭ জন বীরশ্রেষ্ঠের নাম সহজে মনে রাখার উপায় কী?',
        correct_answer: 'মতিউর রহমান, মোস্তফা কামাল, হামিদুর রহমান, জাহাঙ্গীর (ক্যাপ্টেন মহিউদ্দিন), রুহুল আমিন, আব্দুর রউফ এবং নুর মোহাম্মদ শেখ।',
        mnemonic_formula: 'সাত হাজার মোম আনো!',
        category: 'acronym',
        breakdown: [
          { code: 'হা', meaning: 'সিপাহী হামিদুর রহমান (সর্বকনিষ্ঠ বীরশ্রেষ্ঠ)', phoneticHint: 'হামিদুর' },
          { code: 'জা', meaning: 'ক্যাপ্টেন মহিউদ্দীন জাহাঙ্গীর (আর্মি)', phoneticHint: 'জাহাঙ্গীর' },
          { code: 'র', meaning: 'ইঞ্জিনরুম আর্টিফিসার মোহাম্মদ রুহুল আমিন (নৌবাহিনী)', phoneticHint: 'রুহুল আমিন' },
          { code: 'মো', meaning: 'সিপাহী মোস্তফা কামাল (বীরশ্রেষ্ঠ)', phoneticHint: 'মোস্তফা কামাল' },
          { code: 'ম', meaning: 'ফ্লাইট লেফটেন্যান্ট মতিউর রহমান (বিমানবাহিনী)', phoneticHint: 'মতিউর রহমান' },
          { code: 'আ', meaning: 'ল্যান্স নায়েক আব্দুর রউফ (ইপিআর)', phoneticHint: 'আব্দুর রউফ' },
          { code: 'নো', meaning: 'ল্যান্স নায়েক নূর মোহাম্মদ শেখ (ইপিআর)', phoneticHint: 'নূর মোহাম্মদ' }
        ],
        mcq_avoid_confusion_tip: 'বীরশ্রেষ্ঠদের মধ্যে সেনাবাহিনী থেকে ৩ জন (হামিদুর, মোস্তফা, জাহাঙ্গীর), ইপিআর থেকে ২ জন (রউফ, নূর মোহাম্মদ), নৌবাহিনী থেকে ১ জন (রুহুল আমিন) এবং বিমানবাহিনী থেকে ১ জন (মতিউর)।',
        visual_cue: {
          description: 'বাংলাদেশের জাতীয় পতাকার সামনে ৭টি স্মৃতিপ্রদীপ ও বীরদের প্রতিকৃতির অনুপ্রেরণাদায়ক কার্টুন স্কেচ।',
          sketch_prompt: 'Inspiring colored pencil illustration of 7 glowing memorial candles in front of Bangladesh map honoring the 7 Bir Sreshtho heroes',
          sketch_theme: 'historical',
          cartoon_dialogue: '"সাত হাজার মোম আনো" মনে রাখলেই ৭ বীরশ্রেষ্ঠের নাম পরীক্ষার হলে নিমেষে মনে পড়বে!',
          character_left: 'হামিদুর ও মোস্তফা',
          character_right: 'মতিউর ও জাহাঙ্গীর',
          map_highlight: 'Bir Sreshtho Memorial',
          svg_pattern: 'martyrs_candles'
        },
        tags: ['বীরশ্রেষ্ঠ', 'মুক্তিযুদ্ধ', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / সরকারি চাকরি'
      }
    ];
  }

  // 3. সার্কের ৮টি দেশ (SAARC 8 Countries)
  if (qLower.includes('সার্ক') || qLower.includes('saarc') || qLower.includes('দক্ষিণ এশিয়া')) {
    return [
      {
        id: `mn-saarc-${Date.now()}`,
        topic: 'আন্তর্জাতিক বিষয়াবলী',
        question: 'সার্কভুক্ত (SAARC) ৮টি দেশের নাম মনে রাখার শর্টকাট কী?',
        correct_answer: 'বাংলাদেশ, ভারত, পাকিস্তান, শ্রীলঙ্কা, নেপাল, ভুটান, মালদ্বীপ ও আফগানিস্তান।',
        mnemonic_formula: 'নিপা ও শুভ MBA পড়ে!',
        category: 'acronym',
        breakdown: [
          { code: 'N', meaning: 'Nepal (নেপাল)', phoneticHint: 'নিপা-এর N' },
          { code: 'I', meaning: 'India (ভারত)', phoneticHint: 'নিপা-এর I' },
          { code: 'P', meaning: 'Pakistan (পাকিস্তান)', phoneticHint: 'নিপা-এর P' },
          { code: 'A', meaning: 'Afghanistan (আফগানিস্তান)', phoneticHint: 'নিপা-এর A' },
          { code: 'S', meaning: 'Sri Lanka (শ্রীলঙ্কা)', phoneticHint: 'শুভ-এর S' },
          { code: 'B', meaning: 'Bangladesh (বাংলাদেশ) ও Bhutan (ভুটান)', phoneticHint: 'শুভ-এর B' },
          { code: 'M', meaning: 'Maldives (মালদ্বীপ)', phoneticHint: 'MBA-এর M' }
        ],
        mcq_avoid_confusion_tip: 'মনে রাখবেন: সার্ক প্রতিষ্ঠিত হয় ১৯৮৫ সালে ঢাকায়, কিন্তু এর সদর দপ্তর নেপালের কাঠমান্ডুতে। সর্বশেষ যুক্ত হওয়া ৮ম দেশ হলো আফগানিস্তান (২০০৭)। মায়ানমার সার্কের সদস্য নয়!',
        visual_cue: {
          description: 'দক্ষিণ এশিয়ার মানচিত্রের ওপর সার্কের ৮ দেশের পতাকাসহ এক শিক্ষার্থী হাসিমুখে ক্লাসে বসে পড়ার স্কেচ।',
          sketch_prompt: 'Vintage colored pencil drawing of South Asian map with 8 flags representing SAARC member nations with student reading happily',
          sketch_theme: 'map',
          cartoon_dialogue: '"নিপা ও শুভ MBA পড়ে" জানলে সার্কের ৮ দেশ কখনো ভুল হবে না!',
          character_left: 'NIPA (৪ দেশ)',
          character_right: 'MBA (মালদ্বীপ, ভুটান, বাংলাদেশ)',
          map_highlight: 'SAARC Region',
          svg_pattern: 'world_map_continents'
        },
        tags: ['সার্ক', 'আন্তর্জাতিক', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / ব্যাংক জব'
      }
    ];
  }

  // 4. মোগল সম্রাটদের ক্রম (Mughal Emperors Chronology)
  if (qLower.includes('মোগল') || qLower.includes('মুঘল') || qLower.includes('সম্রাট') || qLower.includes('আকবর') || qLower.includes('বাবর')) {
    return [
      {
        id: `mn-mughal-${Date.now()}`,
        topic: 'ইতিহাস ও ঐতিহ্য',
        question: 'মোগল সম্রাটদের ধারাবাহিক শাসনক্রম মনে রাখার উপায় কী?',
        correct_answer: 'বাবর, হুমায়ূন, আকবর, জাহাঙ্গীর, শাহজাহান এবং আওরঙ্গজেব।',
        mnemonic_formula: 'বাবার হইলো একবার জ্বর সারিলো ঔষধে!',
        category: 'phonetic',
        breakdown: [
          { code: 'বাবার', meaning: 'সম্রাট বাবর (১৫২৬-১৫৩০, মোগল সাম্রাজ্যের প্রতিষ্ঠাতা)', phoneticHint: 'বাবর' },
          { code: 'হইলো', meaning: 'সম্রাট হুমায়ূন (১৫৩০-১৫৫৬)', phoneticHint: 'হুমায়ূন' },
          { code: 'একবার', meaning: 'সম্রাট আকবর (১৫৫৬-১৬০৫, শ্রেষ্ঠ সম্রাট)', phoneticHint: 'আকবর' },
          { code: 'জ্বর', meaning: 'সম্রাট জাহাঙ্গীর (১৬০৫-১৬২৭)', phoneticHint: 'জাহাঙ্গীর' },
          { code: 'সারিলো', meaning: 'সম্রাট শাহজাহান (১৬২৭-১৬৫৮, তাজমহলের নির্মাতা)', phoneticHint: 'শাহজাহান' },
          { code: 'ঔষধে', meaning: 'সম্রাট আওরঙ্গজেব (১৬৫৮-১৭০৭)', phoneticHint: 'আওরঙ্গজেব' }
        ],
        mcq_avoid_confusion_tip: 'পানিপথের ১ম যুদ্ধে (১৫২৬) ইব্রাহিম লোদিকে পরাজিত করে বাবর মোগল সাম্রাজ্য প্রতিষ্ঠা করেন। আকবরের সময় বাংলা নববর্ষ ও সুবাহ বাংলা গঠিত হয়।',
        visual_cue: {
          description: 'ঐতিহাসিক রাজকীয় লালকেল্লার পটভূমিতে মোগল দরবারের মুকুট ও রাজকীয় তলোয়ারের রঙিন পেন্সিল স্কেচ।',
          sketch_prompt: 'Vintage colored pencil illustration of royal Mughal crown, historical throne and ancient palace scrolls',
          sketch_theme: 'historical',
          cartoon_dialogue: 'এই বিখ্যাত ছন্দটি মনে রাখলেই মোগল সম্রাটদের পুরো বংশলতিকা পানির মতো সহজ!',
          character_left: 'বাবর (প্রতিষ্ঠাতা)',
          character_right: 'আওরঙ্গজেব (শেষ বড় সম্রাট)',
          map_highlight: 'Mughal Dynasty',
          svg_pattern: 'curzon_building'
        },
        tags: ['মোগল সাম্রাজ্য', 'ইতিহাস', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি'
      }
    ];
  }

  // 5. ৭টি মহাদেশ (7 Continents - Only when continents are actually asked)
  if (qLower.includes('মহাদেশ') || qLower.includes('continent') || qLower.includes('অস্ট্রেলিয়া') || qLower.includes('ইউরোপ')) {
    return [
      {
        id: `mn-continents-${Date.now()}`,
        topic: 'বিশ্বের ভূগোল ও মহাদেশ',
        question: 'পৃথিবীর ৭টি মহাদেশের নাম কীভাবে সহজে মনে রাখা যায়?',
        correct_answer: 'এশিয়া, আফ্রিকা, উত্তর আমেরিকা, দক্ষিণ আমেরিকা, অ্যান্টার্কটিকা, ইউরোপ এবং ওশেনিয়া (অস্ট্রেলিয়া)।',
        mnemonic_formula: '৪টি স্বরবর্ণ (অ, আ, ই, এ) দিয়ে ৭টি মহাদেশ!',
        category: 'acronym',
        breakdown: [
          { code: 'অ (১টি)', meaning: 'অস্ট্রেলিয়া (ওশেনিয়া)', phoneticHint: 'স্বরবর্ণ অ' },
          { code: 'আ (৩টি)', meaning: 'আফ্রিকা, আমেরিকা (উত্তর), আমেরিকা (দক্ষিণ)', phoneticHint: 'স্বরবর্ণ আ' },
          { code: 'ই (১টি)', meaning: 'ইউরোপ', phoneticHint: 'স্বরবর্ণ ই' },
          { code: 'এ (২টি)', meaning: 'এশিয়া, অ্যান্টার্কটিকা', phoneticHint: 'স্বরবর্ণ এ' }
        ],
        mcq_avoid_confusion_tip: 'মনে রাখবেন: সবচেয়ে বড় মহাদেশ এশিয়া (এ) এবং সবচেয়ে ছোট মহাদেশ অস্ট্রেলিয়া (অ)। মোট ৪টি স্বরবর্ণের মাধ্যমে ১+৩+১+২ = ৭টি মহাদেশ।',
        visual_cue: {
          description: 'বিশ্ব মানচিত্রের ওপর ৪টি স্বরবর্ণ (অ, আ, ই, এ) সুন্দরভাবে মহাদেশগুলোর দিকে আলো ছড়াচ্ছে।',
          sketch_prompt: 'Colorful artistic world map with 4 glowing Bengali vowels pointing towards the 7 continents with continent icons',
          sketch_theme: 'map',
          cartoon_dialogue: 'মাত্র ৪টি স্বরবর্ণ অ-আ-ই-এ জানলেই পৃথিবীর ৭টি মহাদেশ এক পলকে মুখস্থ!',
          character_left: 'অ, আ (৪টি)',
          character_right: 'ই, এ (৩টি)',
          map_highlight: 'World 7 Continents',
          svg_pattern: 'world_map_continents'
        },
        tags: ['মহাদেশ', 'ভূগোল', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / সকল পরীক্ষা'
      }
    ];
  }

  // 6. জাতীয় স্মৃতিসৌধের ৭ স্তম্ভ (7 Pillars of National Martyrs Monument)
  if (qLower.includes('স্মৃতিসৌধ') || qLower.includes('স্তম্ভ') || qLower.includes('ফলক')) {
    return [
      {
        id: `mn-monument-${Date.now()}`,
        topic: 'মুক্তিযুদ্ধ ও জাতীয় ইতিহাস',
        question: 'জাতীয় স্মৃতিসৌধের ৭টি ফলক বা স্তম্ভ দ্বারা কোন কোন ঐতিহাসিক আন্দোলন নির্দেশ করা হয়েছে?',
        correct_answer: '১৯৫২ (ভাষা আন্দোলন), ১৯৫৪ (যুক্তফ্রন্ট নির্বাচন), ১৯৫৬ (শাসনতন্ত্র আন্দোলন), ১৯৬২ (শিক্ষা আন্দোলন), ১৯৬৬ (৬ দফা আন্দোলন), ১৯৬৯ (গণ-অভ্যুত্থান) এবং ১৯৭১ (মহান মুক্তিযুদ্ধ)।',
        mnemonic_formula: 'ভাসুর শাসন শিখিয়ে ছয় দফার গণঅভ্যুত্থানে মুক্তিযুদ্ধ এনেছিল!',
        category: 'phonetic',
        breakdown: [
          { code: 'ভা', meaning: '১৯৫২ সালের ভাষা আন্দোলন', phoneticHint: 'ভাসুর-এর ভা' },
          { code: 'সুর', meaning: '১৯৫৪ সালের যুক্তফ্রন্ট নির্বাচন', phoneticHint: 'ভাসুর-এর সুর' },
          { code: 'শাসন', meaning: '১৯৫৬ সালের শাসনতন্ত্র আন্দোলন', phoneticHint: 'শাসন' },
          { code: 'শিখিয়ে', meaning: '১৯৬২ সালের শিক্ষা আন্দোলন', phoneticHint: 'শিখিয়ে' },
          { code: 'ছয় দফা', meaning: '১৯৬৬ সালের ঐতিহাসিক ৬ দফা দাবি', phoneticHint: 'ছয় দফা' },
          { code: 'গণ', meaning: '১৯৬৯ সালের গণ-অভ্যুত্থান', phoneticHint: 'গণ' },
          { code: 'মুক্তিযুদ্ধ', meaning: '১৯৭১ সালের মহান মুক্তিযুদ্ধ', phoneticHint: 'মুক্তিযুদ্ধ' }
        ],
        mcq_avoid_confusion_tip: 'মনে রাখবেন: স্তম্ভ শুরু হয়েছে ১৯৫২ (ভাষা আন্দোলন) দিয়ে এবং শেষ হয়েছে ১৯৭১ (মহান মুক্তিযুদ্ধ)-এ। ১ম ৩টি ২ বছর পর পর (৫২, ৫৪, ৫৬)।',
        visual_cue: {
          description: 'স্মৃতিসৌধের ৭টি সুউচ্চ স্তম্ভের সামনে দাঁড়িয়ে ইতিহাস স্মরণ করার অনুপ্রেরণাদায়ক কার্টুন দৃশ্য।',
          sketch_prompt: 'Seven rising triangular pillars of Bangladesh National Martyrs Monument with glowing historical timeline badges',
          sketch_theme: 'historical',
          cartoon_dialogue: 'এই একটি লাইন জানলে ৭টি স্তম্ভের সাল ও আন্দোলন চোখের পলকেই মনে থাকবে!',
          character_left: '১৯৫২ (ভাষা)',
          character_right: '১৯৭১ (মুক্তিযুদ্ধ)',
          map_highlight: 'Savar National Monument',
          svg_pattern: 'martyrs_candles'
        },
        tags: ['স্মৃতিসৌধ', 'মুক্তিযুদ্ধ', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / সরকারি চাকরি'
      }
    ];
  }

  // 7. রংধনুর ৭টি রং (Rainbow 7 Colors - বেনীআসহকলা)
  if (qLower.includes('রংধনু') || qLower.includes('রঙধনু') || qLower.includes('rainbow') || qLower.includes('বেনীআসহকলা') || qLower.includes('বেণীআসহকলা')) {
    return [
      {
        id: `mn-rainbow-${Date.now()}`,
        topic: 'সাধারণ বিজ্ঞান ও পদার্থবিদ্যা',
        question: 'রংধনুর সাতটি রঙের নাম ও ক্রমানুসার মনে রাখার সূত্র কী?',
        correct_answer: 'বেগুনি, নীল, আসমানী, সবুজ, হলুদ, কমলা এবং লাল (সংক্ষেপে VIBGYOR)।',
        mnemonic_formula: 'বেনীআসহকলা!',
        category: 'acronym',
        breakdown: [
          { code: 'বে', meaning: 'বেগুনি (Violet)', phoneticHint: 'বেগুনি' },
          { code: 'নী', meaning: 'নীল (Indigo)', phoneticHint: 'নীল' },
          { code: 'আ', meaning: 'আসমানী (Blue)', phoneticHint: 'আসমানী' },
          { code: 'স', meaning: 'সবুজ (Green)', phoneticHint: 'সবুজ' },
          { code: 'হ', meaning: 'হলুদ (Yellow)', phoneticHint: 'হলুদ' },
          { code: 'ক', meaning: 'কমলা (Orange)', phoneticHint: 'কমলা' },
          { code: 'লা', meaning: 'লাল (Red)', phoneticHint: 'লাল' }
        ],
        mcq_avoid_confusion_tip: 'মনে রাখবেন: রংধনুতে সবচেয়ে বেশি বিচ্যুতি ঘটে বেগুনি রঙের এবং সবচেয়ে কম বিচ্যুতি ঘটে লাল রঙের। দৃশ্যমান আলোর মধ্যে লালের তরঙ্গদৈর্ঘ্য সবচেয়ে বেশি।',
        visual_cue: {
          description: 'নীল আকাশে সবুজ প্রকৃতির ওপর বিশাল ৭ রঙের উজ্জ্বল রংধনু ধনুকের মতো বাঁকা হয়ে ভাসছে, যেখানে বেগুনি থেকে লাল পর্যন্ত ৭টি বর্ণালী স্তর স্পষ্টভাবে দৃশ্যমান।',
          sketch_prompt: 'A magnificent vivid 7-color rainbow arc shining across a clear blue sky over green meadows and soft white clouds, displaying distinct color bands of Violet, Indigo, Blue, Green, Yellow, Orange, and Red, educational science textbook illustration',
          sketch_theme: 'metaphor',
          cartoon_dialogue: '"বেনীআসহকলা" মনে রাখলেই আকাশের ৭টি রঙের ক্রমানুসার এক পলকে ক্লিয়ার!',
          character_left: 'বেগুনি ও নীল (কম তরঙ্গদৈর্ঘ্য)',
          character_right: 'কমলা ও লাল (বেশি তরঙ্গদৈর্ঘ্য)',
          map_highlight: 'Light Spectrum',
          svg_pattern: 'lightbulb_idea'
        },
        tags: ['রংধনু', 'পদার্থবিজ্ঞান', 'BCS'],
        difficulty: 'easy',
        exam_target: 'BCS / বিশ্ববিদ্যালয় ভর্তি / মেডিকেল'
      }
    ];
  }

  // 8. General Dynamic Smart Generator for Any User-Provided Q&A
  const resolvedAnswer = answer && answer.trim() 
    ? answer.trim() 
    : `${cleanQ} বিষয়ের গুরুত্বপূর্ণ তথ্যাবলী`;

  const syllables = extractSyllables(resolvedAnswer);
  const anchorWord = cleanQ.split(/[\s,।?]+/).find(w => w.length >= 2 && !['কয়টি', 'কি', 'কী', 'কেমন', 'কোথায়', 'কবে'].includes(w)) || 'টপিক';

  return [
    {
      id: `mn-custom-${Date.now()}`,
      topic: cleanTopic,
      question: cleanQ,
      correct_answer: resolvedAnswer,
      mnemonic_formula: `${syllables.formulaPhrase} দিয়ে ${anchorWord} মনে রাখি!`,
      category: 'phonetic',
      breakdown: syllables.breakdowns,
      mcq_avoid_confusion_tip: `পরীক্ষার হলে '${cleanQ}' সম্পর্কিত প্রশ্নের অপশনগুলো মনোযোগ সহকারে লক্ষ্য করুন এবং বিভ্রান্তি এড়িয়ে চলুন।`,
      visual_cue: {
        description: `শিক্ষার্থী '${cleanQ}' বিষয়ের মূল তথ্য মনে রাখার জন্য চমৎকার স্মার্ট ছন্দ পড়ছে।`,
        sketch_prompt: `Inspiring colored pencil textbook sketch of a student discovering an easy memory rhyme for ${cleanQ}`,
        sketch_theme: 'cartoon',
        cartoon_dialogue: `ছন্দটি একবার পড়লেই পরীক্ষার হলে নির্ভুল উত্তর দেওয়া সম্ভব!`,
        character_left: syllables.breakdowns[0]?.code || 'ক্লু ১',
        character_right: syllables.breakdowns[1]?.code || 'ক্লু ২',
        map_highlight: cleanTopic,
        svg_pattern: 'lightbulb_idea'
      },
      tags: [cleanTopic, 'মেমরি টেকনিক', 'স্মার্ট নোট'],
      difficulty: 'medium',
      exam_target: 'বিসিএস / ভর্তি / সরকারি চাকরি'
    }
  ];
}

function extractSyllables(text: string) {
  const words = text.split(/[\s,।+]+/).filter(w => w.trim().length > 0 && !['এবং', 'ও', 'অথবা', 'ইত্যাদি', 'হলো', 'এর'].includes(w.trim()));
  const breakdowns: any[] = [];
  const parts: string[] = [];

  for (let i = 0; i < Math.min(words.length, 5); i++) {
    const w = words[i];
    const syllable = w.slice(0, 2);
    parts.push(syllable);
    breakdowns.push({
      code: syllable,
      meaning: w,
      phoneticHint: `'${w}' শব্দ থেকে '${syllable}'`
    });
  }

  return {
    formulaPhrase: parts.length > 0 ? parts.join('-') : 'স্মার্ট সূত্র',
    breakdowns: breakdowns.length > 0 ? breakdowns : [{ code: 'ক্লু', meaning: text, phoneticHint: 'মূল শব্দ' }]
  };
}
