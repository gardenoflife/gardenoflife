'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  createdAt: any;
}

export default function GardenPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData: Story[] = [];
        let latestTime: any = null;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          storiesData.push({
            id: doc.id,
            title: data.title,
            createdAt: data.createdAt
          } as Story);
          
          // Track latest timestamp
          if (data.createdAt) {
            const timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            if (!latestTime || timestamp > latestTime) {
              latestTime = timestamp;
            }
          }
        });
        
        setStories(storiesData);
        if (latestTime) {
          setLastUpdated(latestTime.toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <main className="min-h-screen p-8 flex flex-col" style={{ backgroundColor: 'white' }}>
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline" style={{ fontFamily: 'monospace' }}>
          ← Back to Home
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto flex-1 flex flex-col" style={{ fontFamily: 'monospace' }}>
        <h1 className="text-2xl font-bold text-black mb-6 text-center">The Garden - Directory</h1>

        <p className="text-sm text-gray-600 mb-12 text-center">
          {lastUpdated && (
            <span className="text-xs text-gray-400 mr-2">
              Last updated: {lastUpdated} ·{' '}
            </span>
          )}
          {stories.length} {stories.length === 1 ? 'entry' : 'entries'}
        </p>

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : stories.length === 0 ? (
            <p className="text-gray-500 text-center">
              No entries yet. <Link href="/admin" className="text-blue-600 hover:underline">Create the first entry</Link>
            </p>
          ) : (
            <div className="space-y-3 text-center">
              {stories.map((story) => (
                <div key={story.id}>
                  <Link href={`/garden/${story.id}`} className="text-blue-600 hover:underline">
                    {story.id} - {story.title}
                  </Link>
                  <span className="text-gray-500 ml-3 text-xs">
                    {story.createdAt?.toDate?.()?.toLocaleString() || 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="mt-16 pt-8 text-center text-xs text-gray-400">
          page maintained by <a href="https://x.com/gardenoflifesh" target="_blank" rel="noopener noreferrer" className="hover:underline">@gardenoflifesh</a> for now
        </footer>
      </div>
    </main>
  );
}
