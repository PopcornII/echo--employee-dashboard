import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const documentId = request.nextUrl.searchParams.get('id');


  try {
    const [document] = await db.query(
      `SELECT d.id, d.title, d.description, d.file_url, d.created_at, u.name AS uploader
       FROM documents d
       JOIN users u ON d.uploader_id = u.id
       WHERE d.id = ?`,
      [documentId]
    );

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const comments = await db.query(
      `SELECT c.id, c.content, c.created_at, u.name AS commenter
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.document_id = ?`,
      [documentId]
    );

    const [likesCount] = await db.query(
      'SELECT COUNT(*) AS totalLikes FROM likes WHERE document_id = ?',
      [documentId]
    );

    

    return NextResponse.json({ document, comments, likesCount: likesCount[0].totallikes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching document details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
