import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { jwtMiddleware } from '@/lib/jwt'; 




export async function handler(req: NextRequest) {
  try {
    jwtMiddleware(req);
    if (req.method === 'GET') {
  
      const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/uploads`; // Construct the base URL for files

      const query = `SELECT * FROM documents`;
      const [documents] = await db.query(query);


      const updatedDocuments = documents.map((doc: any)=> ({
        ...doc,
        file_url: `${baseUrl}/${doc.file_url}`,
        img_url: `${baseUrl}/${doc.img_url}`,
      }));
    
      return NextResponse.json({
        message: 'Success',
        data: updatedDocuments,
      }, { status: 200 });
    }

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}

// Disable default body parser for file uploads in Next.js API
export const config = {
  api: {
    bodyParser: false,
  },
};

export const GET = handler;

