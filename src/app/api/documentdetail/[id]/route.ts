import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';


export async function handler(req: NextRequest) {
  try {

    // Handle GET (Retrieve Documents)
    if (req.method === 'GET') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (id) {
        const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/uploads`;
        const query = `SELECT * FROM documents WHERE id = ?`;
        const [document] = await db.query(query, [id]);

        if (!document) {
          return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
        }


    //   `SELECT c.id, c.content, c.created_at, u.name AS commenter
    //    FROM comments c
    //    JOIN users u ON c.user_id = u.id
    //    WHERE c.document_id = ?`,
    //   [documentId]
    // );

    // const [likesCount] = await db.query(
    //   'SELECT COUNT(*) AS totalLikes FROM likes WHERE document_id = ?',
    //   [documentId]
    // );

    

//     return NextResponse.json({ document, comments, likesCount: likesCount[0].totallikes }, { status: 200 });

        const updateDocument = document.map((doc: any)=> ({
          ...doc,
          file_url: `${baseUrl}/${doc.file_url}`,
          img_url: `${baseUrl}/${doc.img_url}`,
        }));

        return NextResponse.json(
          { message: "Success", data: updateDocument },
          { status: 200 }
        );
      } else {
        const query = `SELECT * FROM documents`;
        const [documents] = await db.query(query);

        return NextResponse.json(
          { message: "Success", data: documents },
          { status: 200 }
        );
      }
    }

    // Method Not Allowed
    return NextResponse.json(
      { error: `Method ${req.method} not allowed.` },
      { status: 405 }
    );
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error.' },
      { status: 500 }
    );
  } 
    
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const GET = handler;
