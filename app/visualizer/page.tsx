'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TokenCandidate {
  token: string;
  finalScore: number;
  spikeCount: number;
  electrodePattern: number[];
}

function simulateNeuronResponse(token: string): { neuronScore: number; spikeCount: number; electrodePattern: number[]; } {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) % 1000;
  }
  
  const numElectrodes = 3 + (hash % 3);
  const electrodePattern: number[] = [];
  for (let i = 0; i < numElectrodes; i++) {
    const electrode = ((hash * (i + 1)) % 16) + 1;
    if (!electrodePattern.includes(electrode)) electrodePattern.push(electrode);
  }
  electrodePattern.sort((a, b) => a - b);
  
  const deterministicPart = hash / 1000;
  const noise = Math.random() * 0.3;
  const spikeCount = Math.floor(5 + (deterministicPart * 0.7 + noise) * 25);
  const neuronScore = Math.min(1, spikeCount / 30);
  
  return { neuronScore, spikeCount, electrodePattern };
}

function ElectrodeGrid({ activeElectrodes }: { activeElectrodes: number[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 p-3 rounded border border-gray-300 bg-white">
      {Array.from({ length: 16 }, (_, i) => {
        const electrodeNum = i + 1;
        const isActive = activeElectrodes.includes(electrodeNum);
        
        return (
          <div key={electrodeNum} className="flex items-center justify-center h-4">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
        );
      })}
    </div>
  );
}

function generateFakeCandidates(actualToken: string): TokenCandidate[] {
  const alternatives = ['the', 'a', 'and', 'of', 'to', 'in', 'was', 'is'];
  const candidates: TokenCandidate[] = [];
  
  const fakeTokens = alternatives.filter(t => t !== actualToken.toLowerCase()).slice(0, 3);
  let maxScore = 0;
  
  fakeTokens.forEach(fakeToken => {
    const neuronResponse = simulateNeuronResponse(fakeToken);
    const score = Math.random() * 0.6;
    if (score > maxScore) maxScore = score;
    
    candidates.push({
      token: fakeToken,
      finalScore: score,
      spikeCount: neuronResponse.spikeCount,
      electrodePattern: neuronResponse.electrodePattern,
    });
  });
  
  const actualNeuronResponse = simulateNeuronResponse(actualToken);
  let adjNeuronScore = actualNeuronResponse.neuronScore;
  if (adjNeuronScore < 0.5) adjNeuronScore = 0.5 + Math.random() * 0.3;
  
  candidates.push({
    token: actualToken,
    finalScore: maxScore + 0.1,
    spikeCount: Math.floor(adjNeuronScore * 30),
    electrodePattern: actualNeuronResponse.electrodePattern,
  });
  
  candidates.sort((a, b) => b.finalScore - a.finalScore);
  return candidates;
}

export default function Visualizer() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [title, setTitle] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [currentCandidates, setCurrentCandidates] = useState<TokenCandidate[]>([]);
  const [chosenToken, setChosenToken] = useState('');
  const [cost, setCost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setStory('');
    setTitle('');
    setCurrentCandidates([]);
    setCost('');
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, needsStory: true }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setFullStory(data.fullStory);
      setTitle(data.title);
      setCost(data.estimatedCost);
      
      const tokens = data.fullStory.match(/\S+|\s+/g) || [];
      const lastToken = tokens[tokens.length - 1] || 'end';
      const finalPattern = simulateNeuronResponse(lastToken.trim()).electrodePattern;
      
      // Auto-play visualization
      let displayedText = '';
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const candidates = generateFakeCandidates(token);
        setCurrentCandidates(candidates);
        setChosenToken(token);
        
        displayedText += token;
        setStory(displayedText);
        
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      
      // Save to database
      try {
        const docRef = await addDoc(collection(db, 'stories'), {
          title: data.title,
          story: data.fullStory,
          prompt: prompt,
          electrodePattern: finalPattern,
          cost: data.estimatedCost,
          tokensUsed: data.tokensUsed,
          createdAt: serverTimestamp()
        });
        
        setTimeout(() => router.push(`/garden/${docRef.id}`), 1000);
      } catch (error) {
        console.error('Error saving:', error);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black mb-4 inline-block" style={{ fontFamily: 'monospace' }}>
            ← Back to Home
          </Link>
        </div>

        <div className="border border-gray-300 rounded-lg p-8 bg-white shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-black" style={{ fontFamily: 'monospace' }}>
            Neural Simulator
          </h1>
          
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ fontFamily: 'monospace' }}>Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A story about..."
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black resize-none"
                  style={{ fontFamily: 'monospace' }}
                  rows={3}
                  disabled={isGenerating}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full px-4 py-2 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors cursor-pointer"
                style={{ fontFamily: 'monospace' }}
              >
                {isGenerating ? 'GENERATING...' : 'GENERATE'}
              </button>

              {cost && <p className="text-xs text-gray-600" style={{ fontFamily: 'monospace' }}>Cost: ${cost}</p>}

              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: 'monospace' }}>Output</label>
                <div className="border border-gray-300 rounded p-3 h-[200px] overflow-y-auto bg-white">
                  {title && <h3 className="font-bold mb-1 text-xs" style={{ fontFamily: 'monospace' }}>{title}</h3>}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'monospace' }}>
                    {story || <span className="text-gray-400">Output will appear here...</span>}
                    {isGenerating && <span className="animate-pulse">▊</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: 'monospace' }}>Electrode Grid</label>
                <ElectrodeGrid activeElectrodes={currentCandidates[0]?.electrodePattern || []} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2" style={{ fontFamily: 'monospace' }}>
                  Tokens{chosenToken && `: "${chosenToken}"`}
                </label>
                <div className="border border-gray-300 rounded p-2 bg-white">
                  <div className="space-y-1.5">
                    {currentCandidates.length > 0 ? (
                      currentCandidates.slice(0, 4).map((candidate, idx) => (
                        <div key={idx} className={`p-1.5 rounded border ${candidate.token === chosenToken ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                          <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'monospace' }}>
                            <span className="font-bold">"{candidate.token}"</span>
                            <span className="text-gray-600">{candidate.spikeCount}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-green-500 h-1 rounded-full" style={{ width: `${candidate.finalScore * 100}%` }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-2" style={{ fontFamily: 'monospace' }}>
                        Candidates...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
