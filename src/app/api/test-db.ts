// pages/api/test-db.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../lib/db';

function queryAsync(sql: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }


export default async function handler(req: NextRequest, res: NextResponse) {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.status(200).json({ result: rows });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
}
