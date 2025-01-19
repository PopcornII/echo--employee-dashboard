
import mysql from 'mysql2/promise';


const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check the connection (simple query to verify)
async function checkConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed', error);
    throw new Error('Database connection failed');
  }
}

checkConnection(); // Verify the connection when initializing

export default db;



