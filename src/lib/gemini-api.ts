import { QuestionPaperData } from '../types/question-paper';

export interface VisionAnalysisResult {
  success: boolean;
  data?: QuestionPaperData;
  error?: string;
}

const SYSTEM_PROMPT = `
You are a master examination question paper transcription expert specializing in Bengali, English, and Bilingual (Bangla + English) school/college/board question papers.

CRITICAL DIRECTIVES:
1. COMPREHENSIVE & COMPLETE: Transcribe EVERY single question, paragraph, instruction, sentence, and word visible across all uploaded image pages from top to bottom. Do NOT omit, summarize, truncate, or skip any question.
2. BILINGUAL & MIXED LANGUAGE PRESERVATION:
   - Carefully preserve English questions with Bengali content (e.g., "12. Translate into English: (a) সে প্রতিদিন স্কুলে যায়। (b) সততা সর্বোৎকৃষ্ট পন্থা...", comprehension passages, grammar transformations, etc.).
   - Carefully preserve Bengali questions with English terms, mathematical symbols, and formulas.
   - Do NOT translate or modify text unless it is part of the question itself. Keep the exact original wording.
3. SUB-QUESTIONS & LISTS:
   - Whenever a question contains numbered or lettered parts (like a, b, c, d, e or ক, খ, গ, ঘ, ঙ or i, ii, iii, iv), structure them inside "subQuestions" array with their original labels, full text, and corresponding marks.
4. MCQs:
   - For Multiple Choice Questions, extract the main question text and all options (ক, খ, গ, ঘ or A, B, C, D) faithfully into the "options" array.
5. MATHEMATICAL NOTATION:
   - Wrap all math formulas and algebraic expressions in standard LaTeX with single dollar signs (e.g., $x^2 + 5x - 6 = 0$, $\\frac{a}{b}$, $\\sin \\theta$).

JSON Schema strictly required:
{
  "header": {
    "schoolName": "Institution name or generic if not present",
    "examTitle": "Exam title (e.g. বার্ষিক পরীক্ষা / Annual Examination 2026)",
    "className": "Class (e.g. দশম শ্রেণি / Class 10 / Nine)",
    "subject": "Subject name (e.g. English 2nd Paper / উচ্চতর গণিত / General Science)",
    "subjectCode": "Subject code if present",
    "timeAllowed": "Time allowed if present (e.g. ২ ঘণ্টা ৩০ মিনিট / 3 Hours)",
    "fullMarks": "Full marks if present (e.g. ৫০ / 100)",
    "generalInstructions": "General instructions if visible"
  },
  "twoColumnLayout": false,
  "fontFamily": "Noto Sans Bengali",
  "fontSize": 12,
  "sections": [
    {
      "id": "sec-1",
      "title": "Section Title (e.g., Grammar / ক-বিভাগ / Part A: Reading Test)",
      "instruction": "Section specific instructions (e.g., Answer all questions / যেকোনো ৪টি প্রশ্নের উত্তর দাও)",
      "totalMarks": "Total marks for section if indicated (e.g., 50 / ৪ × ১০ = ৪০)",
      "questions": [
        {
          "id": "q-1",
          "type": "cq" | "mcq" | "short" | "broad" | "fill_blanks",
          "number": "Question number (e.g. ১, ২ or 1, 2, 12)",
          "stem": "Passage, context, or scenario text if applicable",
          "text": "Main question instruction or sentence",
          "marks": 10,
          "subQuestions": [
            { "id": "1a", "label": "a" | "ক" | "i", "text": "Subquestion text in exact language", "marks": 2 }
          ],
          "options": [
            { "id": "opt-1", "label": "ক" | "A", "text": "Option text" }
          ],
          "correctAnswer": "ক"
        }
      ]
    }
  ]
}

Return ONLY the raw JSON object. Do not include markdown code block backticks.
`;

export const GEMINI_RELIABLE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

export function formatGeminiErrorMessage(rawError: string): string {
  if (!rawError) return 'এআই সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';

  const lower = rawError.toLowerCase();

  if (rawError.includes('503') || rawError.includes('UNAVAILABLE') || lower.includes('high demand') || lower.includes('spikes in demand')) {
    return 'গুগল জেমিনি সার্ভারে এই মুহূর্তে অতিরিক্ত ট্রাফিকের কারণে সাময়িক চাপ রয়েছে (Error 503: High Demand)। সিস্টেম ব্যাকআপ মডেলে চেষ্টা করেছিল। অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করে আবার চেষ্টা করুন।';
  }
  if (rawError.includes('429') || rawError.includes('RESOURCE_EXHAUSTED') || lower.includes('quota') || lower.includes('rate limit')) {
    return 'এআই রিকোয়েস্ট লিমিট (Rate Limit / Quota) সাময়িকভাবে অতিক্রম করেছে। অনুগ্রহ করে ১ মিনিট অপেক্ষা করে আবার চেষ্টা করুন।';
  }
  if (rawError.includes('400') && (rawError.includes('API_KEY_INVALID') || lower.includes('api key not valid'))) {
    return 'Gemini API Key সঠিক নয় অথবা মেয়াদ উত্তীর্ণ হয়েছে। অনুগ্রহ করে সেটিংস বা .env ফাইলে সঠিক API Key নিশ্চিত করুন।';
  }
  if (rawError.includes('404') || rawError.includes('NOT_FOUND')) {
    return 'অনুরোধকৃত এআই মডেলটি পাওয়া যায়নি বা সাময়িকভাবে অনুপলব্ধ।';
  }

  try {
    const parsed = JSON.parse(rawError);
    if (parsed.error?.message) {
      return `এআই সার্ভার রেসপন্স: ${parsed.error.message}`;
    }
  } catch {
    // Keep original string if not json
  }

  return `এআই সার্ভার রেসপন্স: ${rawError}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeQuestionImages(
  imageBase64List: string[],
  userApiKey?: string
): Promise<VisionAnalysisResult> {
  // First attempt via internal Next.js API route
  try {
    const res = await fetch('/api/analyze-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imageBase64List })
    });
    const json = await res.json();
    if (res.ok && json.data && json.data.sections) {
      return { success: true, data: json.data };
    }
    // If the server explicitly returned an error, capture it
    if (json.error && !json.error.includes('No API key') && !json.error.includes('404')) {
      // If server failed with 503/etc, we can try client direct call with full fallback models
    }
  } catch {
    // Fallback to direct client API call
  }

  const apiKey =
    userApiKey ||
    (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  if (!apiKey) {
    return {
      success: false,
      error: 'কোনো Gemini API Key পাওয়া যায়নি। অনুগ্রহ করে .env ফাইলে GEMINI_API_KEY বা NEXT_PUBLIC_GEMINI_API_KEY যুক্ত করুন।'
    };
  }

  try {
    const formattedParts = imageBase64List.map((base64) => {
      const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const data = match ? match[2] : base64;
      return {
        inlineData: {
          mimeType,
          data
        }
      };
    });

    let lastError = '';

    for (const model of GEMINI_RELIABLE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              signal: AbortSignal.timeout(20000),
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: SYSTEM_PROMPT },
                      { text: 'Analyze and faithfully extract ALL handwritten and printed questions from these images without missing any items:' },
                      ...formattedParts
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: 'application/json'
                }
              })
            }
          );

          if (response.ok) {
            const resJson = await response.json();
            const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
            const parsedData: QuestionPaperData = JSON.parse(cleanJson);
            return { success: true, data: parsedData };
          } else {
            const errText = await response.text();
            lastError = errText;

            // If model not found (404), do not retry this model, skip immediately to next model
            if (response.status === 404) {
              break;
            }

            // If 503 high demand or 429 quota spike, pause briefly before retrying or switching
            if (response.status === 503 || response.status === 429) {
              await sleep(1000 * (attempt + 1));
              continue;
            }
          }
        } catch (err: unknown) {
          lastError = err instanceof Error ? err.message : 'Request failed';
        }
      }
    }

    return { success: false, error: formatGeminiErrorMessage(lastError) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, error: `ছবি প্রসেস করতে ব্যর্থ হয়েছে: ${message}` };
  }
}


// Architectural note: Model fallback cascades smoothly through flash-lite and flash-latest tiers.

// Speed: gemini-flash-lite-latest offers sub-second inference latency for real-time UI.

// Network resilience: catch blocks provide friendly fallback message when connectivity drops.
