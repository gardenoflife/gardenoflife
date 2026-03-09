import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simulated neuron scoring system
function simulateNeuronResponse(token: string): {
  neuronScore: number;
  spikeCount: number;
  electrodePattern: number[];
} {
  // This simulates biological chaos/patterns
  // Uses token content to create semi-deterministic but unpredictable scores
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) % 1000;
  }
  
  // Generate electrode pattern (which electrodes were stimulated)
  // Using 3-5 electrodes from a 16-electrode grid
  const numElectrodes = 3 + (hash % 3); // 3-5 electrodes
  const electrodePattern: number[] = [];
  for (let i = 0; i < numElectrodes; i++) {
    const electrode = ((hash * (i + 1)) % 16) + 1;
    if (!electrodePattern.includes(electrode)) {
      electrodePattern.push(electrode);
    }
  }
  electrodePattern.sort((a, b) => a - b);
  
  // Simulate spike count (biological response strength)
  // Range: 5-30 spikes
  const deterministicPart = hash / 1000;
  const noise = Math.random() * 0.3;
  const spikeCount = Math.floor(5 + (deterministicPart * 0.7 + noise) * 25);
  
  // Normalize spike count to 0-1 score
  const neuronScore = Math.min(1, spikeCount / 30);
  
  return {
    neuronScore,
    spikeCount,
    electrodePattern,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, needsStory } = await request.json();
    
    // Generate full story once at the beginning
    if (needsStory) {
      // First generate a title
      const titleResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Generate a short, compelling title (3-6 words) for this story prompt.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 20,
        temperature: 0.7,
      });

      const title = titleResponse.choices[0].message.content?.replace(/['"]/g, '').trim() || 'Untitled Story';
      const titleTokens = titleResponse.usage?.total_tokens || 0;
      
      // Then generate the story
      const storyResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a creative story writer. Write engaging, well-structured stories with proper paragraphs.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.8,
      });

      const fullStory = storyResponse.choices[0].message.content || '';
      const storyTokens = storyResponse.usage?.total_tokens || 0;
      
      // Calculate cost (GPT-3.5-turbo pricing: $0.0015/1K input tokens, $0.002/1K output tokens)
      // Rough estimate: assume ~50% input, 50% output for simplicity
      const totalTokens = titleTokens + storyTokens;
      const estimatedCost = (totalTokens / 1000) * 0.00175; // Average of input/output
      
      return NextResponse.json({
        title,
        fullStory,
        tokensUsed: totalTokens,
        estimatedCost: estimatedCost.toFixed(4),
      });
    }

    // This shouldn't be called anymore, but kept for compatibility
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error: unknown) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
