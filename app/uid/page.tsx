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

export default function UidPage() {
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
    <main className="min-h-screen p-8" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Generated Stories</h1>
          <p className="text-gray-400">Browse all neural-enhanced stories</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">
            <p>Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg mb-4">No stories yet</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              Generate your first story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/uid/${story.id}`}
                className="rounded-lg p-6 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#2a2a2a' }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {story.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {story.story.slice(0, 150)}...
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {story.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                  </span>
                  <span>${story.cost}</span>
                </div>
                {story.electrodePattern && (
                  <div className="mt-3 flex gap-1">
                    {story.electrodePattern.slice(0, 5).map((e, i) => (
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
