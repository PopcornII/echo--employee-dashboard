export type UserRole = 1 | 2 | 3 | 4 | 5;



export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
}


// Define types for the request body
export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;  // You could use a specific type or enum for roles (e.g., 'admin', 'user', etc.)
}


export interface UpdateResult {
  affectedRows: number;
}