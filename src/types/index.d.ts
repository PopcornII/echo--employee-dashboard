declare namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
    }
  }
  

  