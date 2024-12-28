//Login


import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db'; // Update the alias path based on your setup
import { signToken } from '@/lib/jwt'; // Your JWT token generation logic
import { z } from 'zod';


//Login POST request
export async function POST(request: NextRequest) {
  try {

    // const body = await request.json();
    const { username, password } = await request.json();
    // console.log('Request body:', username, password);

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

    // console.log('Type of request password:', typeof password);
    // console.log('Type of user password:', typeof user.password)

    // if (!user.password) {
    //   console.error('Password is missing in the database for this user.');
    //   return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    // }


    // Verify the password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    console.log('Password decoded: ', isPasswordMatch);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Remove the password from the user object before returning it
    delete user.password;

    let obj = {
      user: rows[0],
    }


    // Generate a JWT token
    const token = signToken(obj);

    // Return the response
    return NextResponse.json(
      { 
        message: 'Login successful!',
        errcode: '000',
        ...obj,
        auth_token: token, 
        },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}
