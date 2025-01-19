
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Payload structure
interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  created_at: string;
}

// Predefined properties payload structure
interface JwtPayload {
  data: {
    user: User;
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
  //console.log("TokenCookies: " + tokenCookie);
 

   // Check if the token exists, and retrieve the value
   if (!tokenCookie || !tokenCookie.value) {
    throw new Error('Unauthorized: No token provided.');
  }

  const token = tokenCookie.value;

  try {
    const decoded = verifyToken(token);
    //console.log("Decoded Token: " + JSON.stringify(decoded));
    return decoded as JwtPayload;
  } catch (err: any) {
    throw new Error(`Unauthorized: ${err.message}`);
  }
};
