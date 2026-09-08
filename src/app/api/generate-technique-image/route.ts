import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, formula, topic, theme, question, correctAnswer } = await req.json();

    const fullContext = `${topic || ''} ${question || ''} ${correctAnswer || ''} ${prompt || ''} ${formula || ''}`.toLowerCase();

    let specializedScene = '';

    // 1. Rainbow / ৭ রঙের রংধনু (বেণীআসহকলা)
    if (fullContext.includes('রংধনু') || fullContext.includes('রঙধনু') || fullContext.includes('rainbow') || fullContext.includes('বেনীআসহকলা') || fullContext.includes('বেণীআসহকলা') || fullContext.includes('সাতটি রঙ') || fullContext.includes('সাতটি রং')) {
      specializedScene = 'A magnificent vivid 7-color rainbow arc shining across a clear blue sky over green meadows and soft white clouds, displaying distinct color bands of Violet, Indigo, Blue, Green, Yellow, Orange, and Red (VIBGYOR), educational science textbook illustration';
    } 
    // 2. Rivers of Bangladesh / নদ-নদী
    else if (fullContext.includes('নদী') || fullContext.includes('নদ') || fullContext.includes('river') || fullContext.includes('পদ্মা') || fullContext.includes('মেঘনা') || fullContext.includes('যমুনা')) {
      specializedScene = 'Scenic river delta of Bangladesh with wooden country boats sailing on blue meandering rivers with lush green riverbanks, vintage educational geography textbook map style';
    }
    // 3. Continents / মহাদেশ
    else if (fullContext.includes('মহাদেশ') || fullContext.includes('continent') || fullContext.includes('স্বরবর্ণ')) {
      specializedScene = 'Artistic vintage world map showing the 7 continents clearly outlined with gentle colors and educational geography markers';
    }
    // 4. Bir Sreshtho / মুক্তিযুদ্ধ
    else if (fullContext.includes('বীরশ্রেষ্ঠ') || fullContext.includes('মুক্তিযুদ্ধ') || fullContext.includes('স্মৃতিসৌধ')) {
      specializedScene = 'Inspiring memorial monument with 7 glowing tribute candles against the Bangladesh green and red flag background, vintage historical illustration';
    }
    // 5. SAARC / সার্ক
    else if (fullContext.includes('সার্ক') || fullContext.includes('saarc')) {
      specializedScene = 'South Asia map highlighting member nations with friendly diplomacy symbols and colorful flags, vintage educational storybook style';
    }
    // 6. Solar System / গ্রহ ও সৌরজগৎ
    else if (fullContext.includes('সৌরজগৎ') || fullContext.includes('গ্রহ') || fullContext.includes('planet') || fullContext.includes('সূর্য')) {
      specializedScene = 'Illustrated solar system showing the bright golden sun and 8 planets in glowing orbits against a starry space background, vintage science diagram';
    }
    // 7. General Educational Concept
    else {
      // Clean prompt from any raw Bengali acronym strings that might confuse diffusion models
      const sanitizedPrompt = (prompt || `${topic} educational concept`)
        .replace(/[^\x00-\x7F]/g, ' ') // remove non-ascii/bengali literal strings from image prompt
        .replace(/\s+/g, ' ')
        .trim();

      specializedScene = sanitizedPrompt || `Educational concept visual illustration about ${topic || 'science and history'}`;
    }

    // High quality colored pencil educational sketch prompt
    const enhancedArtPrompt = `colored pencil and watercolor hand-drawn sketch illustration, vintage children educational textbook art style, vivid harmonious colors, clear linework, artistic paper texture, ${specializedScene}, highly detailed educational memory card art, masterpiece, high quality, 8k resolution, no blur, artistic framing`;

    const encodedPrompt = encodeURIComponent(enhancedArtPrompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    
    // Generate with Pollinations Flux
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${randomSeed}&nologo=true&enhance=true&model=flux`;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: enhancedArtPrompt
    });
  } catch (error: any) {
    console.error('Mnemonic Image API Error:', error);
    return NextResponse.json(
      { success: false, error: 'ইমেজ জেনারেট করতে সমস্যা হয়েছে', details: error.message },
      { status: 500 }
    );
  }
}
