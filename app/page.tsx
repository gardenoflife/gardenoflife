'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [electrodeFrequency, setElectrodeFrequency] = useState<number[]>(new Array(16).fill(0));
  const [storyCount, setStoryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'stories'));
        const frequency = new Array(16).fill(0);
        let count = 0;
        let latestTime: any = null;
        
        querySnapshot.forEach((doc) => {
          count++;
          const data = doc.data();
          
          // Track latest timestamp
          if (data.createdAt) {
            const timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            if (!latestTime || timestamp > latestTime) {
              latestTime = timestamp;
            }
          }
          
          if (data.electrodePattern) {
            data.electrodePattern.forEach((electrode: number) => {
              if (electrode >= 1 && electrode <= 16) {
                frequency[electrode - 1]++;
              }
            });
          }
        });
        
        setElectrodeFrequency(frequency);
        setStoryCount(count);
        if (latestTime) {
          setLastUpdated(latestTime.toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching grid data:', error);
      }
    };

    fetchGridData();
  }, []);

  const maxFrequency = Math.max(...electrodeFrequency, 1);

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-2 text-black" style={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}>
            gardenoflife.sh
          </h1>
          <p className="text-xs text-gray-600 tracking-wide mb-3" style={{ fontFamily: 'monospace' }}>
            Exploring Language Generation Through Neural Signals
          </p>
          <nav className="flex justify-center gap-4 text-sm" style={{ fontFamily: 'monospace' }}>
            <Link href="/" className="text-black hover:underline">Home</Link>
            <Link href="/visualizer" className="text-gray-600 hover:text-black hover:underline">Visualizer</Link>
            <Link href="/grid" className="text-gray-600 hover:text-black hover:underline">Grid</Link>
            <Link href="/garden" className="text-gray-600 hover:text-black hover:underline">Garden</Link>
          </nav>
        </div>

        {/* Mini Grid Preview */}
        <div className="mb-16">
          <div className="text-center mb-3">
            <h2 className="text-base font-bold text-black mb-1" style={{ fontFamily: 'monospace' }}>
              The Grid
            </h2>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'monospace' }}>
              {storyCount} stories
              {lastUpdated && <span className="text-gray-500"> · Last: {lastUpdated}</span>}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="border border-gray-300 rounded-lg shadow-sm p-3" style={{ backgroundColor: '#fafaf9' }}>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }, (_, i) => {
                const electrodeNum = i + 1;
                const frequency = electrodeFrequency[i];
                const intensity = frequency / maxFrequency;
                
                return (
                  <div 
                    key={electrodeNum} 
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ 
                      backgroundColor: intensity > 0 
                        ? `rgb(${Math.floor(34 + (1 - intensity) * 100)}, ${Math.floor(197 - intensity * 100)}, ${Math.floor(94 - intensity * 60)})` 
                        : '#e5e5e5',
                      color: intensity > 0.6 ? 'white' : '#1a5928',
                      fontFamily: 'monospace'
                    }}
                  >
                    {electrodeNum}
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>

        {/* Writings Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-black" style={{ fontFamily: 'monospace' }}>
            WRITINGS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Garden of Life Writing */}
            <Link href="/about" className="group block">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 text-black" style={{ fontFamily: 'monospace' }}>
                    Garden of Life
                  </h3>
                  <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'monospace' }}>
                    A Neural Language Experiment
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'monospace' }}>
                    An experiment exploring how biological style signals can influence language model decoding. 
                    Watch token-by-token generation with simulated neural electrode patterns.
                  </p>
                </div>
              </div>
            </Link>

            {/* The Grid Writing */}
            <Link href="/grid/about" className="group block">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 text-black" style={{ fontFamily: 'monospace' }}>
                    The Grid
                  </h3>
                  <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'monospace' }}>
                    /ɡrɪd/ n.
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'monospace' }}>
                    A collective neural memory map. Aggregated electrode patterns from all generated stories, 
                    revealing emergent patterns in artificial cognition.
                  </p>
                </div>
              </div>
            </Link>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm opacity-50">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 text-gray-400" style={{ fontFamily: 'monospace' }}>
                  Project 3
                </h3>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
