import { NextRequest, NextResponse } from 'next/server';
import { uploadSingle } from '@/lib/multerHelper'; 
import db from '@/lib/db';
import {jwtMiddleware } from '@/lib/jwt'; 
import util from 'util';
import { validatePermission } from '@/lib/permissions';


// Disable default body parser for file uploads in Next.js API
export const config = {
  api: {
    bodyParser: false,
  },
};


// Convert multer middleware to promise-based for async/await usage
const runMiddleware = util.promisify(uploadSingle); 

export async function handler (req: NextRequest) {
  try {
    const decodedToken = jwtMiddleware(req);
    
    if (req.method === 'POST') {
      // Validate role permission
      validatePermission(req, 'create');

      const userId = decodedToken.data.user.id;

    // Prepare response object for multer
      const res = new NextResponse();

      // Run multer middleware to handle file upload
      await runMiddleware(req as any, res as any);

      // Extract uploaded files
      const files = (req as any).files;
      const file = files?.find((f: any) => f.fieldname === 'file'); // Document file
      const image = files?.find((f: any) => f.fieldname === 'image'); // Image file

      // If no document file is uploaded, return an error
      if (!file) {
        return NextResponse.json({ error: 'Document file is required.' }, { status: 400 });
      }

      // Parse request body for document details (title and description)
      const body = await req.json();
      const { title, description } = body;

      if (!title) {
        return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
      }

      // Insert document metadata into the database
      const query = `
        INSERT INTO documents (title, description, file_url, img_url, uploader_id, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const values = [
        title,
        description || null,
        `/uploads/${file.filename}`, // URL for document
        image ? `/uploads/${image.filename}` : null, // URL for image (optional)
        userId, // Uploader ID (from decoded token)
      ];

      await db.query(query, values);

      // Respond with success message
      return NextResponse.json(
        {
          message: 'Document created successfully.',
          data: {
            title,
            description,
            file_url: `/uploads/${file.filename}`,
            img_url: image ? `/uploads/${image.filename}` : null,
          },
        },
        { status: 201 }
      );
    }

    if(req.method === 'GET') {
      // Validate role permission
      validatePermission(req, 'read');

      // Retrieve all documents from the database
      const query = `
        SELECT * FROM documents
      `;
      const result = await db.query(query);

     let obj = {
      data: result[0]
     }


      return NextResponse.json({
        message: "Success",
        ...obj
      }, {status: 200});

    }
  

  }catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
 
}

export const GET = handler;
export const POST = handler;



