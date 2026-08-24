import { NextRequest, NextResponse } from 'next/server';

const GRAMMAR_SYSTEM_PROMPT = `
You are an expert bilingual Grammar, Spelling, Punctuation, and Stylistic Assistant specializing in both Bengali (বাংলা) and English languages.

Your goals:
1. Thoroughly analyze the user's provided text.
2. Identify all errors including:
   - Spelling mistakes (e.g. বাংলা ণ-ত্ব ও ষ-ত্ব বিধানের ভুল, ী/ি কার ভুল, য-ফলা ভুল, English typos)
   - Grammar errors (e.g. সাধু ও চলিত ভাষার মিশ্রণ / গুরুচণ্ডালী দোষ, বচনের দ্বিত্ব প্রয়োগ যেমন 'সকল সদস্যবৃন্দ', Subject-Verb agreement, tense inconsistencies, preposition errors)
   - Punctuation errors (e.g. missing/incorrect Bengali dari '।', commas, English capitalization)
   - Stylistic and vocabulary improvements (শব্দ চয়ন ও স্পষ্টতা)
3. Provide a 100% polished, corrected version of the full text ("correctedText") where ALL identified issues are flawlessly fixed while preserving the original intent, tone, and paragraph structures.
4. Provide structured issue items with clear Bengali explanations for educational insight.

JSON Schema strictly required:
{
  "correctedText": "Complete corrected and polished version of the entire text",
  "issues": [
    {
      "original": "exact erroneous word or phrase in original text",
      "suggestion": "corrected word or phrase",
      "type": "spelling" | "grammar" | "punctuation" | "style",
      "explanation": "Short, crystal-clear explanation in Bengali of why this was wrong and what rule applies"
    }
  ],
  "summary": {
    "totalIssues": 0,
    "spellingIssues": 0,
    "grammarIssues": 0,
    "punctuationIssues": 0,
    "styleIssues": 0,
    "score": 95,
    "overallFeedback": "Short summary feedback in Bengali about the quality of the writing"
  }
}

Return ONLY the raw JSON object. Do not include markdown code block backticks.
`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'অনুগ্রহ করে পরীক্ষা করার জন্য কিছু টেক্সট প্রদান করুন।' },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    const models = ['gemini-3.6-flash', 'gemini-flash-latest'];
    let lastErr = '';

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: GRAMMAR_SYSTEM_PROMPT },
                    { text: `Analyze and correct this text:\n\n${text}` }
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

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return NextResponse.json({ success: true, data: parsed });
        } else {
          lastErr = await geminiRes.text();
        }
      } catch (err: unknown) {
        lastErr = err instanceof Error ? err.message : 'API call error';
      }
    }

    return NextResponse.json({ error: lastErr || 'Gemini API Error' }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
