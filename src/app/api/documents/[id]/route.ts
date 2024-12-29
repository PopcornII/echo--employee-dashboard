import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { validatePermission } from '@/lib/permissions';
import { jwtMiddleware } from '@/lib/jwt';



// Update Document
export async function handler (req: NextRequest) {
  
  try {
    jwtMiddleware(req);

    if(req.method === 'PUT') {
      validatePermission(req, 'update');

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
      }

      const body = await req.json();
      const { title, description } = body;

      if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
      }

      const query = `
        UPDATE documents
        SET title = ?, description = ?
        WHERE id = ?
      `;
      const values = [title, description, id];

      await db.query(query, values);

      return NextResponse.json(
        { message: 'Document updated successfully' },
        { status: 200 }
      );
    }

    if(req.method === 'GET') {
      validatePermission(req, 'read');
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
      }

      const query = `
        SELECT * FROM documents WHERE id = ?
      `;
      const [document] = await db.query(query, [id]);

      if (!document) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      return NextResponse.json({ data: document }, { status: 200 });

    }


    //Delete a document
    if(req.method === 'DELETE') {
      validatePermission(req, 'delete');

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
      }

      const query = `
        DELETE FROM documents WHERE id = ?
      `;
      await db.query(query, [id]);

      return NextResponse.json(
        { message: 'Document deleted successfully' },
        { status: 200 }
    );
    }


    
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads in POST
  },
};


export const GET = handler;
export const PUT = handler;
export const DELETE = handler;


