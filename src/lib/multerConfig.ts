
// Multer Configuration
import multer from 'multer';
import path from 'path';
import fs from 'fs';


// Set upload directory
const uploadDir = path.join(process.cwd(), 'public', 'uploads')

// Ensure the upload directory exists
import { strict } from 'assert';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueSuffix = `${timestamp}-${file.originalname}`;
    cb(null, uniqueSuffix); // File name: timestamp-originalname
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type: ${file.mimetype}`));
    }

    cb(null, true);
  },
});

export default upload;
