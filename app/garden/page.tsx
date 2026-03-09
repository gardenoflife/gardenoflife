'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  story: string;
  createdAt: any;
  electrodePattern: number[];
  cost: string;
}

export default function GardenPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData: Story[] = [];
        
        querySnapshot.forEach((doc) => {
          storiesData.push({
            id: doc.id,
            ...doc.data()
          } as Story);
        });
        
        setStories(storiesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black mb-4 inline-block" style={{ fontFamily: 'monospace' }}>
            ← Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'monospace' }}>The Garden</h1>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>All generated stories</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">
            <p style={{ fontFamily: 'monospace' }}>Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-base mb-4" style={{ fontFamily: 'monospace' }}>No stories yet</p>
            <Link href="/visualizer" className="text-black hover:underline" style={{ fontFamily: 'monospace' }}>
              Generate your first story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/garden/${story.id}`}
                className="border border-gray-300 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'monospace' }}>
                  {story.title}
                </h3>
                <p className="text-gray-700 text-xs mb-4 line-clamp-3" style={{ fontFamily: 'monospace' }}>
                  {story.story.slice(0, 150)}...
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500" style={{ fontFamily: 'monospace' }}>
                  <span>
                    {story.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                  </span>
                  <span>${story.cost}</span>
                </div>
                {story.electrodePattern && (
                  <div className="mt-3 grid grid-cols-8 gap-1">
                    {story.electrodePattern.slice(0, 8).map((e, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
