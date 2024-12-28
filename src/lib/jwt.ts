// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';


// Pre defined properties payload structure
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


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}


// SignIn Token
export const signToken = (paramData) => {
  const payload = {data: paramData};
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Validate Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired.');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token.');
    }
    throw new Error('Token verification failed.');
  }
};

// Decode Token
export const decodeToken = (token: string) => {
  return jwt.decode(token);

};




//Validate Token Middleware
export const jwtMiddleware = (request: NextRequest): JwtPayload => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or malformed Authorization header.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  // console.log(decoded);
  
  if (!decoded) {
    throw new Error('Unauthorized: Invalid token.');
  }

  return decoded as JwtPayload;
};


// // payload roles-based validation
// export const jwtPayload = (payload: any): payload is JwtPayload => {
//   return typeof payload.id === 'string' && typeof payload.role === 'string';
// };