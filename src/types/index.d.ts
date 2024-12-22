declare namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      JWT_SECRET: string;
    }
  }
  
  declare module 'next' {
    interface NextApiRequest {
      user?: {
        id: string;
        role: string;
      };
    }
  }
  