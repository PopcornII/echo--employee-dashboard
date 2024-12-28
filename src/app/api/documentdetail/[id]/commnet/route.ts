import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  const documentId = request.nextUrl.searchParams.get('id');
  const { userId, content } = await request.json();

  try {
    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.query('INSERT INTO comments (document_id, user_id, content) VALUES (?, ?, ?)', [
      documentId,
      userId,
      content,
    ]);

    return NextResponse.json({ message: 'Comment added' }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
