import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import db from '@/lib/db'; // Assuming you have a db setup

export async function GET(request: NextRequest) {
  const documentId = request.nextUrl.pathname.split('/').pop();

  try {
    // Query the database to get the document file URL
    const [document] = await db.query(
      'SELECT file_url FROM documents WHERE id = ?',
      [documentId]
    );

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const fileUrl = document.file_url;
    const filePath = path.join(process.cwd(), 'public', fileUrl);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    // Read the file and send it as a response
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
