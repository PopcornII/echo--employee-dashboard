// // lib/jwt.ts

// import jwt from 'jsonwebtoken';
// import { NextRequest } from 'next/server';


// // Pre defined properties payload structure
// interface JwtPayload {
//   data: {
//     user: {
//       id: number;
//       name: string;
//       email: string;
//       role: number;
//       created_at: string;
//     };
//   };
//   iat: number;
//   exp: number;
// }


// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined in environment variables.');
// }


// // SignIn Token
// export const signToken = (paramData) => {
//   const payload = {data: paramData};
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
// };

// // Validate Token
// export const verifyToken = (token: string) => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       throw new Error('Token has expired.');
//     } else if (err.name === 'JsonWebTokenError') {
//       throw new Error('Invalid token.');
//     }
//     throw new Error('Token verification failed.');
//   }
// };

// // Decode Token
// export const decodeToken = (token: string) => {
//   return jwt.decode(token);

// };




// //Validate Token Middleware
// export const jwtMiddleware = (request: NextRequest): JwtPayload => {
//   const authHeader = request.headers.get('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw new Error('Unauthorized: Missing or malformed Authorization header.');
//   }

//   const token = authHeader.split(' ')[1];
//   const decoded = verifyToken(token);
//   // console.log(decoded);
  
//   if (!decoded) {
//     throw new Error('Unauthorized: Invalid token.');
//   }

//   return decoded as JwtPayload;
// };


// // // payload roles-based validation
// // export const jwtPayload = (payload: any): payload is JwtPayload => {
// //   return typeof payload.id === 'string' && typeof payload.role === 'string';
// // };

import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { NextRequest } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Predefined properties payload structure
interface JwtPayload {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: number;
      created_at: string;
    };
  };
  iat: number;
  exp: number;
}

// SignIn Token
export const signToken = (paramData: object) => {
  const payload = { data: paramData };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Validate Token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired.');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token.');
    }
    throw new Error('Token verification failed.');
  }
};

// Middleware to retrieve and validate token from cookies
export const jwtMiddleware = (request: NextRequest): JwtPayload => {
  // Extract cookies from the request
  const cookies = request.cookies;
  const tokenCookie = cookies.get('auth_token');
 

   // Check if the token exists, and retrieve the value
   if (!tokenCookie || !tokenCookie.value) {
    throw new Error('Unauthorized: No token provided.');
  }

  const token = tokenCookie.value;


  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Unauthorized: Invalid token.');
  }

  return decoded as JwtPayload;
};
