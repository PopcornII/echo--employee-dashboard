import db from './db';


// Helper function for async queries with proper types
async function queryAsync<T = any>(sql: string, params: any[] = []): Promise<T> {
  const [results] = await db.query(sql, params);
  return results as T;
}

export default queryAsync;
