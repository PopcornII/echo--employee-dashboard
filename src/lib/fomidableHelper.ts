import formidable, { File, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

// Define the upload directory
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure `formidable`
export const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB limit
  filename: (name, ext, part) => {
    const timestamp = Date.now();
    return `${timestamp}-${part.originalFilename}`;
  },
  filter: (part) => {
    if (part.name === 'file' && !['application/pdf'].includes(part.mimetype || '')) {
      return false; // Reject non-PDF files for 'file'
    }
    if (part.name === 'image' && !['image/jpeg', 'image/png'].includes(part.mimetype || '')) {
      return false; // Reject non-JPEG/PNG for 'image'
    }
    return true;
  },
});

// Helper to parse form-data
export const parseForm = async (req: Request): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};
