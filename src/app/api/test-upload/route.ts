import { NextRequest, NextResponse } from 'next/server';
import upload from '@/lib/multerConfig';
import db from '@/lib/db';
import { Readable } from 'stream';


// Extend Readable to include the 'file' property
interface MulterRequest extends Readable {
  file?: Express.Multer.File;
  headers: { [key: string]: string };
  method: string;
  url: string;
}



// Convert ReadableStream to Async Iterable for Node.js
const streamToIterable = (stream: ReadableStream<Uint8Array>) => {
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
const adaptRequest = async (req: NextRequest): Promise<MulterRequest> => {
  const iterable = streamToIterable(req.body as ReadableStream<Uint8Array>);
  const readable = Readable.from(iterable); // Convert to Node.js readable stream
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.nextUrl.pathname,
  }) as MulterRequest;
};

// Helper function to run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};


// File upload handler function
export const POST = async (req: NextRequest) => {

  try {
    // Adapt Next.js request to Node.js-style request
    const adaptedReq = await adaptRequest(req);

    // Mock response object (not used by multer)
    const res: any = {
      on: () => {},
      end: () => {},
    };
   // Use multer to handle file upload
   await runMiddleware(adaptedReq, res, upload.single('file'));

 
    // Access uploaded file
    const file = adaptedReq.file;
    console.log('File: ', file);
    

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Construct the file URL
    const fileUrl = `/uploads/${file.filename}`;
    console.log('FileUrl: ', fileUrl);

    // Insert file metadata into the database
    const query = 'INSERT INTO test_file (file_name, file_url) VALUES (?, ?)';
    const values = [file.originalname, fileUrl];
    console.log("Value: ",values)

    await db.query(query, values);

    // Return success response
    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        data: { fileUrl },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file uploads
  },
};
