'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !story.trim()) {
      setError('Both title and story are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, story }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Redirect to the garden page of the newly created story
      router.push(`/garden/${data.id}`);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload story. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-12" style={{ backgroundColor: '#f7f4ef' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black" style={{ fontFamily: 'monospace' }}>
            ← Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'monospace' }}>
            Admin Upload
          </h1>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
            Manually upload stories to the garden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title..."
              className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black text-black"
              style={{ fontFamily: 'monospace', backgroundColor: 'white' }}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black" style={{ fontFamily: 'monospace' }}>
              Story
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Enter story content..."
              className="w-full h-96 p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black resize-none text-black"
              style={{ fontFamily: 'monospace', backgroundColor: 'white' }}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" style={{ fontFamily: 'monospace' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
            style={{ fontFamily: 'monospace' }}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Story'}
          </button>
        </form>

        <div className="mt-8 p-4 border border-gray-300 rounded" style={{ backgroundColor: 'white' }}>
          <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            <strong>Note:</strong> Timestamp, electrode pattern, and cost will be automatically generated. 
            The story will appear in the Garden and contribute to The Grid.
          </p>
        </div>
      </div>
    </main>
  );
}
