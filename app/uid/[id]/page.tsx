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
    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-900/30 rounded">
      {Array.from({ length: totalElectrodes }, (_, i) => {
        const electrodeNum = i + 1;
        const isActive = activeElectrodes.includes(electrodeNum);
        
        return (
          <div
            key={electrodeNum}
            className="flex items-center justify-center h-6"
          >
            <div
              className={`w-1 h-1 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              }`}
            />
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
      <main className="min-h-screen p-8" style={{ backgroundColor: '#1d1d1d' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-20">
            <p>Loading story...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#1d1d1d' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg mb-4">Story not found</p>
            <Link href="/uid" className="text-blue-400 hover:text-blue-300">
              Back to stories
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
    <main className="min-h-screen p-8" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="max-w-7xl mx-auto">
        <Link href="/uid" className="text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to stories
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#2a2a2a' }}>
              <h1 className="text-3xl font-bold text-white mb-4">{story.title}</h1>
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {story.story}
              </p>
            </div>

            {story.prompt && (
              <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a2a' }}>
                <h3 className="text-sm text-gray-400 mb-2">Original Prompt</h3>
                <p className="text-gray-300 text-sm">{story.prompt}</p>
              </div>
            )}
          </div>

          {/* Neural Info Sidebar */}
          <div>
            <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#2a2a2a' }}>
              <h3 className="text-lg font-bold text-white mb-4">Neural State</h3>
              
              {story.electrodePattern && story.electrodePattern.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Final Electrode Pattern</p>
                  <ElectrodeGrid activeElectrodes={story.electrodePattern} />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Active: {story.electrodePattern.join(', ')}
                  </p>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost</span>
                  <span className="text-white">${story.cost}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{dateString}</span>
                </div>
                
                {timeString && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white">{timeString}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg p-4 bg-purple-900/20">
              <p className="text-xs text-gray-400">
                This story was generated using neural-enhanced token selection with biological neuron feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
