import { NextResponse } from 'next/server';

// Define role permissions mapping
const rolePermissions = {
  1: ['create', 'read', 'update', 'delete'], // Super Admin
  2: ['create', 'read', 'update', 'delete'], // Admin
  3: ['create', 'read', 'update', 'delete'], // Teacher
  4: ['read', 'update'], // Student
  5: ['read'], // Guest
};

// Permission validation function
export const validatePermission = (decodedToken: any, action: string) => {
  try {
    // Extract role from decoded token
    const role = decodedToken?.data?.user?.role;

    if (!role) {
      throw new Error('Invalid token: Role not found');
    }

    // Get permissions for the role
    const permissions = rolePermissions[role];
    if (!permissions) {
      throw new Error(`Role ${role} not found in permissions mapping`);
    }

    // Check if the action is allowed for this role
    if (!permissions.includes(action)) {
      throw new Error(`Unauthorized: Role ${role} does not have permission to perform ${action}`);
    }

    // If validation passes, return true
    return true;
  } catch (error) {
    console.error('Permission validation error:', error);
    return NextResponse.json({ error: error.message || 'Permission validation failed' }, { status: 403 });
  }
};
