import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Generate response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const fullResponse = response.choices[0].message.content || '';
    const tokensUsed = response.usage?.total_tokens || 0;
    const estimatedCost = (tokensUsed / 1000) * 0.00175;
    
    return NextResponse.json({
      fullResponse,
      tokensUsed,
      estimatedCost: estimatedCost.toFixed(4),
    });

  } catch (error: unknown) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
