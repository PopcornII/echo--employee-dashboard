import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { UserRole, } from '../../../types/user';

// Middleware to check if the user is authenticated and has the required role
// Request body interface
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;

}


export async function POST(request: NextRequest , response: NextResponse){
  try {

    // Parse the request body and cast it to RegisterRequestBody
   // const body: RegisterRequestBody = await request.json();
    const { name, email, password, role } = await request.json();


    // Validate request data
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if the email already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);


    // Log the results of the query to understand what's happening
    console.log('Existing user check result:', existingUser);

    // if (existingUser.length > 0) {
    //   return NextResponse.json({ message: 'Email already exists', "Email": normalizedEmail }, { status: 400 });
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const user = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return NextResponse.json({ message: 'User registered successfully', 'user':user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
