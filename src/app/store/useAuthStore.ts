import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  created_at: string;
}

interface LoginState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[] | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initializeSession: () => void;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
          
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
};

const getPermissionsByRole = (role: number): string[] => {
  const rolePermissions: Record<number, string[]> = {
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
      token: Cookies.get('auth_token') || null,
      isAuthenticated: false,
      permissions: null,

      setUser: (user: User) => {
        const permissions = getPermissionsByRole(user.role);
        set({ user, permissions });
      },

      setToken: (token: string) => {
        if (!token || isTokenExpired(token)) {
          console.warn('Attempting to set an invalid or expired token.');
          Cookies.remove('auth_token');
          set({ token: null, isAuthenticated: false, user: null, permissions: null});
          return;
        }

        Cookies.set('auth_token', token, { expires: 1, path: '/' }); 
        try {
          const parts = token.split('.');
            if (parts.length !== 3) {
              throw new Error('Invalid token format');
            }
          
          
          const payload = JSON.parse(atob(parts[1]));
          const user = payload.data?.user || null;
          const permissions = getPermissionsByRole(user.role);
          set({ token, user, permissions, isAuthenticated: true });
        } catch (err) {
          console.error('Error decoding token during setToken:', err);
          set({ token: null, isAuthenticated: false, user: null, permissions: null });
          Cookies.remove('auth_token');
        }
      },

      logout: () => {
        Cookies.remove('auth_token');
        set({ user: null, token: null, isAuthenticated: false, permissions: null });
      },

      initializeSession: () => {
        const token = Cookies.get('auth_token');
        if (token || !isTokenExpired(token)) {
          try {
            const parts = token.split('.');
            if (parts.length !== 3) {
              throw new Error('Invalid token format');
            }
      
            const payload = JSON.parse(atob(parts[1]));
            //console.log('Decoded Token Payload:', payload);
            const user = payload.data?.user || null;
            const permissions = getPermissionsByRole(user.role);
            set({ token, user, permissions, isAuthenticated: true });
          } catch (err) {
            console.error('Error decoding token during initialization:', err);
            set({ token: null, isAuthenticated: false, user: null, permissions: null });
          }
        } else {
          Cookies.remove('auth_token');
          set({ token: null, isAuthenticated: false, user: null, permissions: null });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token, permissions: state.permissions, isAuthenticated: state.isAuthenticated }),
      version: 1,
    }
  )
);
