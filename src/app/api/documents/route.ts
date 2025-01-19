import { NextRequest, NextResponse } from 'next/server';
import { uploadSingle} from '@/lib/multerHelper'; 
import db from '@/lib/db';
import { jwtMiddleware } from '@/lib/jwt'; 
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

export interface MulterRequest extends Readable {
  file?: Express.Multer.File; // For single file uploads
  files?: { [fieldname: string]: Express.Multer.File[] }; // For multiple files in fields
  body?: { [key: string]: string };
  headers: { [key: string]: string };
  method: string;
  url: string;
}

// Convert ReadableStream to Async Iterable for Node.js
export const streamToIterable = (stream: ReadableStream<Uint8Array>) => {
  const reader = stream.getReader();
  return {
    async *[Symbol.asyncIterator]() {
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) {
          done = true;
        } else {
          yield value;
        }
      }
    },
  };
};

// Adapt NextRequest to Node.js-style IncomingMessage
export const adaptRequest = async (req: NextRequest): Promise<MulterRequest> => {
  if (!req.body) return null; 
  const iterable = streamToIterable(req.body as ReadableStream<Uint8Array>);
  const readable = Readable.from(iterable); 
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.nextUrl.pathname,
  }) as MulterRequest;
};

// Helper function to run middleware
export const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};



export async function handler(req: NextRequest) {
  const adaptedReq = await adaptRequest(req);
 
  try {
    const decodedToken = jwtMiddleware(req);
    const res = new NextResponse();
  
    if (req.method === 'POST') {
      const userId = decodedToken.data.user.id;
      await runMiddleware(adaptedReq, res, uploadSingle);
      // console.log('files: ', adaptedReq.files);
  
      // Access uploaded files
      const files = adaptedReq.files;
      const { title, description } = adaptedReq.body;
      // console.log('Files:', adaptedReq.files);
      // console.log('title:', title);
      // console.log('description:', description);
      
      const documentFile = files?.file ? files.file[0] : null;
      const imageFile = files?.image ? files.image[0] : null;
      if (!documentFile || !imageFile) {
        return NextResponse.json({ error: 'Document and image files are required.' }, { status: 400 });
      }

       // Log filenames for debugging
      //  console.log("Document filename:", documentFile.filename);
      //  console.log("Image filename:", imageFile.filename);


      if (!title) {
        return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
      }

      const query = `
        INSERT INTO documents (title, description, file_url, img_url, uploader_id, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const values = [
        title,
        description || null,
        documentFile.filename,
        imageFile.filename,
        userId,
      ];

      //console.log("Executing query with values:", query, values);
      const [data] = await db.query(query, values);


      return NextResponse.json(
        {
          message: 'Document uploaded successfully.',
          data: data
        },
        { status: 201 }
      );
    }

  } catch (err) {
    if (adaptedReq.files?.file) {
      const filePath = path.resolve('public/uploads', adaptedReq.files.file[0].filename);
      //console.log('File: ' + filePath);
      try {
        fs.unlinkSync(filePath); // Delete the document file
      } catch (cleanupErr) {
        console.error('Error cleaning up document file:', cleanupErr);
      }
    }
    if (adaptedReq.files?.image) {
      const filePath = path.resolve('public/uploads', adaptedReq.files.image[0].filename);
      try {
        fs.unlinkSync(filePath); // Delete the image file
      } catch (cleanupErr) {
        console.error('Error cleaning up image file:', cleanupErr);
      }
    }
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}

// Disable default body parser for file uploads in Next.js API
export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = handler;
