import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../lib/auth';

export const jwtMiddleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  try {
    req.user = verifyToken(token); // Attach decoded user data to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
