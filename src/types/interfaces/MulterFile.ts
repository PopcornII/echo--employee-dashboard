// interfaces/MulterFile.ts
import { FileUpload } from 'express-fileupload';

export interface MulterFile extends FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}