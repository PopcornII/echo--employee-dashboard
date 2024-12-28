import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set upload directories
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for document files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Document upload directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueSuffix = `${timestamp}-${file.originalname}`;
    cb(null, uniqueSuffix); // File name: timestamp-originalname
  },
});

// File filters for documents and images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['application/pdf'];
  const allowedImageTypes = ['image/png', 'image/jpeg'];

  if (file.fieldname === 'file' && !allowedFileTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type for document. Only PDF allowed.'));
  }

  if (file.fieldname === 'image' && !allowedImageTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type for image. Only PNG and JPEG allowed.'));
  }

  cb(null, true);
};

// Multer configuration
const upload = multer({
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

export default upload;
