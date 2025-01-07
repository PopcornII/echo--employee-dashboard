import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { UserRole } from '../../../types/user';
import { validatePermission } from '@/lib/permissions'; // Import the permission validation function

// User model interface for database operations
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: number;
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

  try {

    if (request.method === 'POST') {
      // Parse the request body and cast it to CreateRequestBody
      const body: CreateRequestBody = await request.json();
      const { name, email, password, role } = body;

      // Validate request data
      if (!name || !email || !password || !role) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
      }

      // Check if the email already exists
      const normalizedEmail = email.trim().toLowerCase().replace(/\s+/g, '');
      const [existingUser] = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [ normalizedEmail]);
      console.log('Existing User:', existingUser[0]);
      
      
      if (existingUser[0] && existingUser[0].length > 0) {
        return NextResponse.json({ message: 'Email already exists', Email:  normalizedEmail }, { status: 400 });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const [user] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );

      return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 });
    }

    if (request.method === 'GET') {
      validatePermission(request, 'read'); // Check if the user has 'read' permission

      // Retrieve all users from the database
      const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
      
  
      return NextResponse.json({ message: "success", users}, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
