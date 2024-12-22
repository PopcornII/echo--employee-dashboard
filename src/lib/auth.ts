import jwt from 'jsonwebtoken';

export const signToken = (payload: Record<string, unknown>, expiresIn = '1h'): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};

export const verifyToken = (token: string): Record<string, unknown> => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as Record<string, unknown>;
};
