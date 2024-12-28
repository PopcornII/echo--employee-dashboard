import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt'; // Your JWT utility

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    const user = { id: payload.id, name: payload.name, role: payload.role }; // Example payload structure
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
