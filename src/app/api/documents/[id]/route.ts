import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { uploadSingle } from '@/lib/multerHelper';
import { jwtMiddleware } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';
import  { adaptRequest, runMiddleware} from '../route';

export async function handler(req: NextRequest) {
  const adaptedReq = await adaptRequest(req);
  const res = new NextResponse();
  try {
    const decodedToken = jwtMiddleware(req);
    const userId = decodedToken.data.user.id;

    // Handle PUT (Update Document and Files)
    if (req.method === 'PUT') {

      // Ensure the document ID is provided
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      console.log("id: " + id);

      if (!id) {
        return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
      }

      // Fetch the existing document details
      const query = `SELECT * FROM documents WHERE id = ?`;
      const [existingDoc] = await db.query(query, [id]);

      if (!existingDoc) {
        return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
      }
      await runMiddleware(adaptedReq, res, uploadSingle);

      const files = adaptedReq.files;
      const { title, description } = adaptedReq.body;

      let documentFile = null;
      let imageFile = null;

      // Handle file uploads
      if (files?.file) {
        documentFile = files.file[0];
      }
      if (files?.image) {
        imageFile = files.image[0];
      }

      // Fetch current file paths for cleanup (in case of replacement)
      const oldDocumentPath = path.resolve('public/uploads', existingDoc[0].file_url);
      const oldImagePath = path.resolve('public/uploads', existingDoc[0].img_url);


      let newDocumentUrl = existingDoc[0].file_url;
      let newImageUrl = existingDoc[0].img_url;

      // If a new document is uploaded, update the URL and delete the old file
      if (documentFile) {
        newDocumentUrl = documentFile.filename;
        if (fs.existsSync(oldDocumentPath)) {
          fs.unlinkSync(oldDocumentPath);
        }
      }

      // If a new image is uploaded, update the URL and delete the old image
      if (imageFile) {
        newImageUrl = imageFile.filename;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update the document in the database
      const updateQuery = `
        UPDATE documents
        SET title = ?, description = ?, file_url = ?, img_url = ?, uploader_id = ?
        WHERE id = ?
      `;

      const params = [title, description, newDocumentUrl, newImageUrl, userId, id];
      // Log the query and parameters
      console.log("Executing query:", updateQuery);
      console.log("With parameters:", params);

      await db.query(updateQuery, params);
      
 
      return NextResponse.json({
        message: 'Document updated successfully.',
      }, { status: 200 });
    }

    // Handle DELETE
    if (req.method === 'DELETE') {

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
      }

      const query = `SELECT file_url, img_url FROM documents WHERE id = ?`;
      const [existingDoc] = await db.query(query, [id]);

      if (!existingDoc) {
        return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
      }

      const filePath = path.resolve('public/uploads', existingDoc[0].file_url);
      const imagePath = path.resolve('public/uploads', existingDoc[0].img_url);

      // Delete files when the document is deleted
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      const deleteQuery = `DELETE FROM documents WHERE id = ?`;
      await db.query(deleteQuery, [id]);

      return NextResponse.json(
        { message: 'Document deleted successfully.' },
        { status: 200 }
      );
    }

    // Method Not Allowed
    return NextResponse.json(
      { error: `Method ${req.method} not allowed.` },
      { status: 405 }
    );
  } catch (err) {
    if (adaptedReq.files?.file) {
          const filePath = path.resolve('public/uploads', adaptedReq.files.file[0].filename);
          console.log(`File ${filePath}`);
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

export const PUT = handler;
export const DELETE = handler;
