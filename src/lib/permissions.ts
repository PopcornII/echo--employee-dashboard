// lib/permissions.ts
import { jwtMiddleware } from '@/lib/jwt'; // Import JwtPayload type
import { NextRequest } from 'next/server';

// Define role permissions mapping
const rolePermissions = {
  1: ['create', 'read', 'update', 'delete'], // Super Admin
  2: ['create', 'read', 'update', 'delete'],  // Admin
  3: ['create', 'read', 'update', 'delete'], // Teacher
  4: ['read', 'update'],  // Student
  5: ['read'], // Guest
};

// Permission validation middleware
export const validatePermission = (request: NextRequest, action: string) => {
  try {
    // Validate and decode the token
    const decodedToken = jwtMiddleware(request);

    // Get the role from the decoded token
    const role = decodedToken.data.user.role;
    console.log(role);

    // Check if the role exists in the rolePermissions map
    if (!rolePermissions[role]) {
      throw new Error('Role not found');
    }

    // Check if the user has the required permission
    const hasPermission = rolePermissions[role].includes(action); //Using Array.includes() library method
    console.log('Support: ', hasPermission);

    if (!hasPermission) {
      throw new Error(`Unauthorized: ${role} does not have permission to ${action}`);
    }

    return true;
  } catch (error) {
    throw new Error(`Permission validation failed: ${error.message}`);
  }
};
