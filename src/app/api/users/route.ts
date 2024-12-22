import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db'; 
import { UserRole } from '../../../types/user';


// User model interface for database operations
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
}


interface CreateRequestBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;

}

interface UpdateResult {
  affectedRows: number;
}

// Main handler function for CRUD operations
export async function handler(request: NextRequest) {

  if(request.method === 'POST'){
    try {
      // Parse the request body and cast it to RegisterRequestBody
      const body: CreateRequestBody = await request.json();
      const { name, email, password, role } = body;
  
      // Validate request data
      if (!name || !email || !password || !role) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
      }
  
      // Check if the email already exists
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
  
      // Log the results of the query to understand what's happening
      console.log('Existing user check result:', existingUser);
  
      if (existingUser.length > 0) {
        return NextResponse.json({ message: 'Email already exists', "Email": normalizedEmail }, { status: 400 });
      }
  
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

  if(request.method === 'GET'){
    try {
      // Retrieve all users from the database
      const users = await db.query('SELECT * FROM users');
  
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

}

export const GET = handler;
export const POST = handler;
