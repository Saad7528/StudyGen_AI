import { NextRequest, NextResponse } from 'next/server';

const OCR_PROMPT = `
You are a high-precision Optical Character Recognition (OCR) and text transcription engine specializing in both Bengali (বাংলা) and English handwritten/printed text, mathematical formulas, and diagrams.

CRITICAL DIRECTIVES:
1. ACCURATE TRANSCRIPTION: Extract ALL text, numbers, headings, sub-questions, instructions, and mathematical expressions visible in the provided image from top to bottom.
2. PRESERVE STRUCTURE: Maintain line breaks, numbered lists, bullet points, and paragraph divisions accurately as shown in the image.
3. MATHEMATICAL EXPRESSIONS: Transcribe mathematical equations, fractions, square roots, and variables clearly (using standard notation or LaTeX if helpful).
4. HANDWRITTEN BENGALI: Carefully recognize complex Bengali conjuncts (যুক্তাক্ষর), matras, and handwriting styles.
5. NO EXTRA COMMENTARY: Output ONLY the transcribed text from the image. Do NOT add conversational preamble, notes, or explanations.
`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'কোনো ছবি প্রদান করা হয়নি।' },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const mimeType = match ? match[1] : 'image/jpeg';
    const data = match ? match[2] : image;

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
                    { text: OCR_PROMPT },
                    { text: 'Please transcribe all text from this image faithfully and completely:' },
                    { inlineData: { mimeType, data } }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1
              }
            })
          }
        );

        if (geminiRes.ok) {
          const resData = await geminiRes.json();
          const extractedText =
            resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            'ছবি থেকে কোনো লেখা শনাক্ত করা সম্ভব হয়নি।';
          return NextResponse.json({ success: true, text: extractedText });
        } else {
          lastErr = await geminiRes.text();
        }
      } catch (err: unknown) {
        lastErr = err instanceof Error ? err.message : 'API call error';
      }
    }

    return NextResponse.json({ error: lastErr || 'OCR processing failed' }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
