//Login Guest

import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt'; // Your JWT token generation logic
import { z } from 'zod';


const GUEST_CREDENTIALS = {
  username: 'guest@gmail.com',
  password: '123456',
}
// Login POST request
export async function POST(request: NextRequest) {

  try {
    const { username, password } = await request.json();
    console.log('Request body:', username, password);

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Handle guest login
    if (
      username === GUEST_CREDENTIALS.username &&
      password === GUEST_CREDENTIALS.password
    ) {
      // Create a guest user object
      const guestUser = {
        id: 0,
        name: 'Guest',
        role: 5,
      };

      // Generate a JWT token for the guest user
      const token = signToken({ user: guestUser });

      const res = NextResponse.json(
        {
          message: 'success',
          user: guestUser,
          auth_token: token,
        },
        { status: 201 }
      );

      res.cookies.set('auth_token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60,
        path: '/',
      });

      return res;
    }else{
      throw new Error('Invalid Requet!');
    }
  }catch (error) {
    console.error('Error during login:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


