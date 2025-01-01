import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

// Set upload directories
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists with proper error handling
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating upload directory:', err);
  throw new Error('Failed to initialize upload directory.');
}

// Sanitize filenames to avoid issues with special characters
const sanitizeFilename = (filename: string) =>
  filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

// Configure Multer for document files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedOriginalName = sanitizeFilename(file.originalname);
    const uniqueSuffix = `${timestamp}-${sanitizedOriginalName}`;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFileTypes = ['application/pdf'];
  const allowedImageTypes = ['image/png', 'image/jpeg'];

  // Check for document file
  if (file.fieldname === 'file') {
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type for document. Only PDF is allowed.'));
    }
  }

  // Check for image file
  if (file.fieldname === 'image') {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type for image. Only PNG and JPEG are allowed.'));
    }
  }

  // Pass the file if valid
  cb(null, true);
};
export function validateContentLength(req: NextRequest, res: NextResponse, next: Function) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  if (contentLength > MAX_SIZE) {
    return NextResponse.json({ error: 'Request size exceeds limit.' }, {status: 400});
  }

  next();
}

// Multer configuration
export const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter,
});

// Middleware for single file and image upload
export const uploadSingle = upload.fields([
  { name: 'file', maxCount: 1 }, // Single document file
  { name: 'image', maxCount: 1 }, // Single image file
]);

// Middleware for multiple files
export const uploadMultiple = upload.array('files', 5); // Up to 5 files


