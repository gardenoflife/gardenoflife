'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Story {
  title: string;
  story: string;
  prompt: string;
  createdAt: any;
  electrodePattern: number[];
  cost: string;
  tokensUsed: number;
}

function ElectrodeGrid({ activeElectrodes }: { activeElectrodes: number[] }) {
  const totalElectrodes = 16;
  
  return (
    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded border border-gray-300">
      {Array.from({ length: totalElectrodes }, (_, i) => {
        const electrodeNum = i + 1;
        const isActive = activeElectrodes.includes(electrodeNum);
        
        return (
          <div
            key={electrodeNum}
            className="flex items-center justify-center h-8"
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              {electrodeNum}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StoryPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStory(docSnap.data() as Story);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-20">
            <p style={{ fontFamily: 'monospace' }}>Loading story...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-20">
            <p className="text-base mb-4" style={{ fontFamily: 'monospace' }}>Story not found</p>
            <Link href="/garden" className="text-black hover:underline" style={{ fontFamily: 'monospace' }}>
              Back to garden
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = story.createdAt?.toDate?.();
  const dateString = createdDate?.toLocaleDateString() || 'Recent';
  const timeString = createdDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-7xl mx-auto">
        <Link href="/garden" className="text-gray-600 hover:text-black mb-6 inline-block text-sm" style={{ fontFamily: 'monospace' }}>
          ← Back to garden
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-white shadow-sm">
              <h1 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'monospace' }}>{story.title}</h1>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'monospace' }}>
                {story.story}
              </p>
            </div>

            {story.prompt && (
              <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-xs text-gray-600 mb-2 font-bold" style={{ fontFamily: 'monospace' }}>Original Prompt</h3>
                <p className="text-gray-700 text-sm" style={{ fontFamily: 'monospace' }}>{story.prompt}</p>
              </div>
            )}
          </div>

          {/* Neural Info Sidebar */}
          <div>
            <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-white shadow-sm">
              <h3 className="text-base font-bold text-black mb-4" style={{ fontFamily: 'monospace' }}>Neural State</h3>
              
              {story.electrodePattern && story.electrodePattern.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2 font-bold" style={{ fontFamily: 'monospace' }}>Final Electrode Pattern</p>
                  <ElectrodeGrid activeElectrodes={story.electrodePattern} />
                  <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: 'monospace' }}>
                    Active: {story.electrodePattern.join(', ')}
                  </p>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm" style={{ fontFamily: 'monospace' }}>
                  <span className="text-gray-600">Cost</span>
                  <span className="text-black font-bold">${story.cost}</span>
                </div>
                
                <div className="flex justify-between text-sm" style={{ fontFamily: 'monospace' }}>
                  <span className="text-gray-600">Date</span>
                  <span className="text-black">{dateString}</span>
                </div>
                
                {timeString && (
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'monospace' }}>
                    <span className="text-gray-600">Time</span>
                    <span className="text-black">{timeString}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
              <p className="text-xs text-gray-700" style={{ fontFamily: 'monospace' }}>
                This story was generated using neural-enhanced token selection with simulated biological neuron feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
