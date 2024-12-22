

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '../../../lib/db';
import { signToken } from '../../../lib/auth';

interface LoginBody {
  username: string;
  password: string;
}



export default async function handler(req: NextRequest, res: NextResponse) {

  // Only allow POST requests
  if (req.method === 'POST') {
    const { username, password }: LoginBody = await req.json();

    const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken({ id: user.id, role: user.role });

    res.status(200).json({ token, message: 'Login successful!' });
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
