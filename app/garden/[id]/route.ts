import { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return new Response('Story not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    const story = docSnap.data();
    const createdDate = story.createdAt?.toDate?.();
    const dateString = createdDate?.toLocaleDateString() || 'Recent';
    
    const text = `title: ${story.title}

date: ${dateString}

content:
${story.story}

---

${story.electrodePattern && story.electrodePattern.length > 0 ? `electrode_pattern: ${story.electrodePattern.join(', ')}\n` : ''}${story.cost && story.cost !== '0.00' ? `cost: $${story.cost}\n` : ''}${story.tokensUsed ? `tokens: ${story.tokensUsed}` : ''}`;

    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    return new Response('Error loading story', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
