import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}

interface LoginState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[] | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: string[]) => void;
  logout: () => void;
  isTokenValid: () => boolean;
  checkAndSetToken: () => void;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
};

export const getPermissionsByRole = (role: number): string[] => {
  const rolePermissions = {
    1: ['create', 'read', 'update', 'delete'], // Super Admin
    2: ['create', 'read', 'update', 'delete'], // Admin
    3: ['create', 'read', 'update', 'delete'], // Teacher
    4: ['read', 'update'], // Student
    5: ['read'], // Guest
  };

  return rolePermissions[role] || [];
};

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      user: null,
      token: Cookies.get('auth_token') || null, // Retrieve token from cookie instead of localStorage
      isAuthenticated: false,
      permissions: null,

      setUser: (user: User) => {
        const permissions = getPermissionsByRole(user.role);
        set({ user, permissions });
      },

      setToken: (token: string) => {
        const isValid = !isTokenExpired(token);
        set({ token, isAuthenticated: isValid });
        if (isValid) {
          Cookies.set('auth_token', token, { expires: 7 }); // Store token in cookie for 7 days
        }
      },

      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },

      logout: () => {
        Cookies.remove('auth_token'); // Remove token from cookie
        set({ user: null, token: null, isAuthenticated: false, permissions: null });
      },

      isTokenValid: () => {
        const token = get().token;
        return token != null && !isTokenExpired(token);
      },

      checkAndSetToken: () => {
        const token = Cookies.get('auth_token');
        if (token && !isTokenExpired(token)) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user = payload.data?.user || {}; // Extract user from token
            const permissions = getPermissionsByRole(user.role);
            set({ user, permissions, isAuthenticated: true });
          } catch (err) {
            console.error('Error decoding token:', err);
            set({ isAuthenticated: false, user: null });
            Cookies.remove('auth_token');
          }
        } else {
          set({ isAuthenticated: false, user: null, permissions: null });
        }
      },
    }),
    {
      name: 'auth-store', // Key for persistence
      partialize: (state) => ({
        token: state.token,
        permissions: state.permissions,
      }),
      version: 1,
    }
  )
);
