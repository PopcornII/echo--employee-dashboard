import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { UserRole } from '@/types/user';


interface UpdateResult {
  id: number;
  name: string;
  role: number;
  affectedRows: number;
}

// Main handler function for CRUD operations
export async function handler(request: NextRequest) {
  // Extract ID from query parameters using searchParams
  const idParam = request.nextUrl.searchParams.get('id');
  const id = idParam ? parseInt(idParam, 10) : undefined;

  if ((request.method === 'GET' || request.method === 'PUT' || request.method === 'DELETE') && (!id || isNaN(id))) {
    return NextResponse.json({ message: 'Valid User ID is required' }, { status: 400 });
  }

  try {
    if (request.method === 'GET') {
      // Retrieve user by ID
      const [rows]: any[] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user: rows[0] }, { status: 200 });
    }

    if (request.method === 'PUT') {
      // Parse request body
      const body = await request.json();
      const { name, role }: { name: string; role: UserRole } = body;

      // Validate input fields
      if (!name || !role) {
        return NextResponse.json({ message: 'Name and role are required' }, { status: 400 });
      }

      // Update user details
      const [result] : [UpdateResult] | any[] = await db.query('UPDATE users SET name = ?, role = ? WHERE id = ?', [name, role, id]);

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    }

    if (request.method === 'DELETE') {
      // Delete user by ID
      const[ result] : [UpdateResult] | any[] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    }

    // Handle unsupported HTTP methods
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  } catch (error: unknown) {
    console.error(`Error handling ${request.method} request:`, error);
    return NextResponse.json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// Expose HTTP methods for Next.js API routes
export const GET = handler;
export const PUT = handler;
export const DELETE = handler;
