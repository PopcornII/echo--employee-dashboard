import { NextRequest, NextResponse } from 'next/server';
import { jwtMiddleware } from '../../middleware/jwtMiddleware';

export default async function handler(req: NextRequest, res: NextResponse) {
  jwtMiddleware(req: NextRequest, res: NextResponse, next, () => {
    res.status(200).json({ message: 'Welcome to the protected route!', user: req.user });
  });
}
