import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; 
import { UserRole } from '@/types/user';


// User model interface for database operations
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
}

interface UpdateResult {
  affectedRows: number;
}

// Main handler function for CRUD operations
export async function handler(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validate ID for GET, PUT, and DELETE
  if (!id && (request.method === 'GET' || request.method === 'PUT' || request.method === 'DELETE')) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    switch (request.method) {
      case 'GET': {

        // Retrieve user by ID
        const [rows] : any[] = await db.query('SELECT * FROM users WHERE id =?', [id]);
        if (!rows || rows.length === 0) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user: rows[0] }, { status: 200 });
        
      }

      case 'PUT': {
        // Parse request body
        const body = await request.json();
        const { name, email, role } = body;

        // Validate input fields
        if (!name || !role) {
          return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Update user details
        const [rows] : any[] = await db.query('UPDATE users SET name = ?, role = ? WHERE id = ?', [name, role, id]);
        if (rows.affectedRows === 0) {
          return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
      }

      case 'DELETE': {
        // Delete user by ID
        const [rows] : any[] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        if (rows.affectedRows === 0) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
      }

      default:
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }
  } catch (error) {
    console.error(`Error in ${request.method} request:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handler;
export const PUT = handler;
export const DELETE = handler;
