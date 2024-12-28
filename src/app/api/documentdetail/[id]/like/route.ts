import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  const documentId = request.nextUrl.searchParams.get('id');
  const { userId } = await request.json();

  try {
    await db.query('INSERT INTO likes (document_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id', [
      documentId,
      userId,
    ]);

    return NextResponse.json({ message: 'Document liked' }, { status: 200 });
  } catch (error) {
    console.error('Error liking document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
