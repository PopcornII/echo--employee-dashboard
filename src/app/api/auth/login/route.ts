//Login


import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db'; // Update the alias path based on your setup
import { signToken } from '@/lib/jwt'; // Your JWT token generation logic
import { z } from 'zod';
import { permission } from 'process';



//Login POST request
export async function POST(request: NextRequest) {
  try {
 

    // const body = await request.json();
    const { username, password } = await request.json();
    //console.log('Request body:', username, password);

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }
    // Query the database
    const [rows]: any[] = await db.query('SELECT * FROM users WHERE email = ?', [username]);
    // console.log('Database rows:', rows);

    if (rows.length === 0) {
      console.warn(`Failed login attempt for username: ${username}`);
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = rows[0];


    // Verify the password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    
    //console.log('Password decoded: ', isPasswordMatch);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Remove the password from the user object before returning it
    delete user.password;

    // Generate a JWT token
    const token = signToken({ user: rows[0] });
    
    // Return the response
    const res = NextResponse.json(
      { 
        message: 'success',
        user: {...user},
        auth_token: token,
        
        },
        { status: 201 }
    );

    res.cookies.set('auth_token', token, {
      httpOnly: false, // if True Cookie is not accessible by JavaScript
      secure: false, // if True Secure only in production (HTTPS)
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60, // Token expiration time (1 hour)
      path: '/',
    });

    return res;

  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}
