'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

interface Story {
  id: string;
  title: string;
  electrodePattern: number[];
  createdAt: any;
}

export default function GridPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [electrodeFrequency, setElectrodeFrequency] = useState<number[]>(new Array(16).fill(0));

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData: Story[] = [];
        const frequency = new Array(16).fill(0);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          storiesData.push({
            id: doc.id,
            title: data.title,
            electrodePattern: data.electrodePattern || [],
            createdAt: data.createdAt
          });
          
          // Count electrode usage
          if (data.electrodePattern) {
            data.electrodePattern.forEach((electrode: number) => {
              if (electrode >= 1 && electrode <= 16) {
                frequency[electrode - 1]++;
              }
            });
          }
        });
        
        setStories(storiesData);
        setElectrodeFrequency(frequency);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const maxFrequency = Math.max(...electrodeFrequency, 1);

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black mb-4 inline-block" style={{ fontFamily: 'monospace' }}>
            ← Back to Home
          </Link>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold mb-1 text-black" style={{ fontFamily: 'monospace' }}>
            The Grid
          </h1>
          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'monospace' }}>
            Collective neural memory from {stories.length} stories
          </p>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            Each story's final electrode activation pattern—the terminal neural spike captured at the moment 
            generation completed. These patterns aggregate into a living map of artificial cognition.
          </p>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500" style={{ fontFamily: 'monospace' }}>Loading data...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Aggregated Heat Map */}
              <div>
                <h2 className="text-base font-bold mb-3 text-black" style={{ fontFamily: 'monospace' }}>
                  Overall Frequency
                </h2>
                <div className="grid grid-cols-4 gap-3 p-4 rounded">
                  {Array.from({ length: 16 }, (_, i) => {
                    const electrodeNum = i + 1;
                    const frequency = electrodeFrequency[i];
                    const intensity = frequency / maxFrequency;
                    
                    return (
                      <div key={electrodeNum} className="flex flex-col items-center gap-1">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all"
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
                        <span className="text-xs text-gray-600" style={{ fontFamily: 'monospace' }}>
                          {frequency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Patterns */}
              <div>
                <h2 className="text-base font-bold mb-3 text-black" style={{ fontFamily: 'monospace' }}>
                  Recent Patterns
                </h2>
                <div className="space-y-3">
                  {stories.slice(0, 10).map((story) => (
                    <div key={story.id} className="border border-gray-300 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/garden/${story.id}`} className="text-xs font-bold text-black hover:underline" style={{ fontFamily: 'monospace' }}>
                          {story.title}
                        </Link>
                        <span className="text-xs text-gray-500" style={{ fontFamily: 'monospace' }}>
                          {story.createdAt?.toDate?.()?.toLocaleString() || 'Recent'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 16 }, (_, i) => {
                          const electrodeNum = i + 1;
                          const isActive = story.electrodePattern?.includes(electrodeNum);
                          
                          return (
                            <div 
                              key={electrodeNum} 
                              className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: isActive ? '#22c55e' : '#e5e5e5',
                                color: isActive ? 'white' : '#9ca3af',
                                fontFamily: 'monospace'
                              }}
                            >
                              {electrodeNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
