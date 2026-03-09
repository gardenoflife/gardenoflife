import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { title, story } = await request.json();
    
    if (!title || !story) {
      return NextResponse.json({ error: 'Title and story are required' }, { status: 400 });
    }
    
    // Generate random electrode pattern (3-5 unique electrodes from 1-16)
    const numElectrodes = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 electrodes
    const electrodePattern: number[] = [];
    
    while (electrodePattern.length < numElectrodes) {
      const electrode = Math.floor(Math.random() * 16) + 1; // 1-16
      if (!electrodePattern.includes(electrode)) {
        electrodePattern.push(electrode);
      }
    }
    
    // Sort the pattern
    electrodePattern.sort((a, b) => a - b);
    
    // Estimate tokens used (rough approximation: ~4 characters per token)
    const tokensUsed = Math.ceil((title.length + story.length) / 4);
    
    // Create the story document
    const docRef = await addDoc(collection(db, 'stories'), {
      title: title.trim(),
      story: story.trim(),
      electrodePattern,
      cost: '0.00',
      tokensUsed,
      createdAt: serverTimestamp(),
    });
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
      electrodePattern,
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
