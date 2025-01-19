import 'express';

declare global {
  namespace Express {
    interface Request {
      files?: {
        file?: Express.Multer.File[];
        image?: Express.Multer.File[];
      };
      headers: {
        auth_token?: string;
        [key: string]: string | undefined;
      };
    }
  }
}
