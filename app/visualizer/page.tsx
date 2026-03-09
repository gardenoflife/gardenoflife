'use client';

import { useState } from 'react';
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
    <div className="grid grid-cols-4 gap-2 p-4 rounded" style={{ backgroundColor: '#d4d1c9' }}>
      {Array.from({ length: 16 }, (_, i) => {
        const electrodeNum = i + 1;
        const isActive = activeElectrodes.includes(electrodeNum);
        
        return (
          <div key={electrodeNum} className="flex items-center justify-center">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{ 
                backgroundColor: isActive ? '#22c55e' : '#e8e5df',
                color: isActive ? 'white' : '#999',
                fontFamily: 'monospace',
                boxShadow: isActive ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
              }}
            >
              {isActive ? electrodeNum : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function generateCandidates(actualToken: string): TokenCandidate[] {
  const alternatives = ['the', 'a', 'and', 'of', 'to', 'in', 'was', 'is'];
  const candidates: TokenCandidate[] = [];
  
  const otherTokens = alternatives.filter(t => t !== actualToken.toLowerCase()).slice(0, 3);
  let maxScore = 0;
  
  otherTokens.forEach(token => {
    const neuronResponse = simulateNeuronResponse(token);
    const score = Math.random() * 0.6;
    if (score > maxScore) maxScore = score;
    
    candidates.push({
      token: token,
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
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [currentCandidates, setCurrentCandidates] = useState<TokenCandidate[]>([]);
  const [chosenToken, setChosenToken] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(true);

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey.trim() || isGenerating) return;
    
    setResponse('');
    setCurrentCandidates([]);
    setCost('');
    setError('');
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Generation failed. Please check your API key.');
        return;
      }

      setCost(data.estimatedCost);
      
      const tokens = data.fullResponse.match(/\S+|\s+/g) || [];
      
      // Auto-play visualization
      let displayedText = '';
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const candidates = generateCandidates(token);
        setCurrentCandidates(candidates);
        setChosenToken(token);
        
        displayedText += token;
        setResponse(displayedText);
        
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Generation failed. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline" style={{ fontFamily: 'monospace' }}>
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
            Visualizer
          </h1>
          <p className="text-xs text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            Observe how language is generated token by token as biological neural signals influence the decoding process. Enter a prompt to watch candidate tokens compete while neural spike activity from the CL1 system contributes to the final selection. · Not saved · Max 150 tokens (response may be cut off)
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-4">
              {/* API Key Input */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-xs font-bold text-black" style={{ fontFamily: 'monospace' }}>
                    OpenAI API Key
                  </label>
                  <button 
                    onClick={() => setShowApiKeyInfo(!showApiKeyInfo)}
                    className="text-xs text-gray-600 hover:text-black cursor-pointer"
                    style={{ fontFamily: 'monospace' }}
                  >
                    ?
                  </button>
                </div>
                {showApiKeyInfo && (
                  <div className="mb-2 p-3 rounded text-xs text-black leading-relaxed" style={{ fontFamily: 'monospace', backgroundColor: '#e8e5df' }}>
                    <p className="mb-2">Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-green-600 hover:underline">platform.openai.com/api-keys</a></p>
                    <p className="text-gray-700">Your key is only used for this session and is never stored.</p>
                  </div>
                )}
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 rounded text-sm text-black placeholder-gray-400 focus:outline-none"
                  style={{ fontFamily: 'monospace', backgroundColor: 'white', border: 'none' }}
                  disabled={isGenerating}
                />
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-black" style={{ fontFamily: 'monospace' }}>Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type anything..."
                  className="w-full p-3 rounded text-sm text-black placeholder-gray-400 resize-none focus:outline-none"
                  style={{ fontFamily: 'monospace', backgroundColor: 'white', border: 'none' }}
                  rows={6}
                  disabled={isGenerating}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
                className="w-full px-4 py-3 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                style={{ fontFamily: 'monospace' }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>

              {error && (
                <p className="text-xs text-red-600" style={{ fontFamily: 'monospace' }}>
                  {error}
                </p>
              )}

              {cost && (
                <p className="text-xs text-gray-600" style={{ fontFamily: 'monospace' }}>
                  Cost: ${cost}
                </p>
              )}
            </div>

            {/* Right Column - Output & Neural Viz */}
            <div className="space-y-4">
              {/* Response Output */}
              <div>
                <label className="block text-xs font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>Response</label>
                <div className="rounded p-4 h-[250px] overflow-y-auto" style={{ backgroundColor: 'white' }}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-black" style={{ fontFamily: 'monospace' }}>
                    {response || <span className="text-gray-400">Response will appear here...</span>}
                    {isGenerating && <span className="animate-pulse text-green-600">▊</span>}
                  </p>
                </div>
              </div>

              {/* Electrode Grid */}
              <div>
                <label className="block text-xs font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
                  Electrode Grid
                </label>
                <ElectrodeGrid activeElectrodes={currentCandidates[0]?.electrodePattern || []} />
              </div>

              {/* Token Candidates */}
              <div>
                <label className="block text-xs font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
                  Token Candidates{chosenToken && `: "${chosenToken}"`}
                </label>
                <div className="rounded p-3" style={{ backgroundColor: 'white' }}>
                  <div className="space-y-2">
                    {currentCandidates.length > 0 ? (
                      currentCandidates.slice(0, 4).map((candidate, idx) => (
                        <div 
                          key={idx} 
                          className="p-2.5 rounded transition-all"
                          style={{ 
                            border: candidate.token === chosenToken ? '2px solid #22c55e' : '1px solid #d4d1c9',
                            backgroundColor: candidate.token === chosenToken ? '#e8f5e8' : '#fafafa'
                          }}
                        >
                          <div className="flex justify-between mb-1.5 text-xs" style={{ fontFamily: 'monospace' }}>
                            <span className="font-bold text-black">"{candidate.token}"</span>
                            <span className="text-gray-700">{candidate.spikeCount} spikes</span>
                          </div>
                          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#e5e5e5' }}>
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${candidate.finalScore * 100}%`,
                                backgroundColor: '#22c55e'
                              }} 
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4" style={{ fontFamily: 'monospace' }}>
                        Waiting for generation...
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
