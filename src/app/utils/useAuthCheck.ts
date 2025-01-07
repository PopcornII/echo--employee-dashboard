// 'use client'


// import { useEffect, useCallback, useState } from 'react';
// import { useLoginStore } from '@/app/store/useAuthStore';
// import { useRouter, usePathname } from 'next/navigation';
// import { toast } from 'react-toastify';

// const useAuthCheck = (): void => {
//   const {
//     checkAndSetToken,
//     isAuthenticated,
//     user,
//     token,
//     logout,
//     setPermissions,
//     setUser,
//     isTokenValid,
//   } = useLoginStore();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isClient, setIsClient] = useState(false);

//   const handleLogout = useCallback(() => {
//     logout();
//     toast.error('Session expired or invalid. Redirecting to login...');
//     router.replace('/auth/login'); // Use `replace` to avoid adding the login page to the history stack
//   }, [logout, router]);

//   useEffect(() => {
//     // Ensure this runs only on the client
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     // Public routes that don't require authentication
//     const publicRoutes = ['/'];

//     // Skip auth check for public routes
//     if (publicRoutes.includes(pathname)) return;

//     // Check token presence and validity
//     if (!token || !isTokenValid()) {
//       handleLogout();
//       return;
//     }

//     // Decode and set user data if not already in the store
//   }, [token, isAuthenticated, user, setPermissions, handleLogout, pathname, setUser, isTokenValid]);

//   useEffect(() => {
//     if (isClient && !isAuthenticated) {
//       checkAndSetToken(); // Revalidate token on client-side if not authenticated
//     }
//   }, [isAuthenticated, checkAndSetToken, isClient]);

//   useEffect(() => {
//     // Debugging: log auth state changes
//     if (isClient) {
//       console.log('Auth State:', { token, user, isAuthenticated });
//     }
//   }, [token, user, isAuthenticated, isClient]);
// };

// export default useAuthCheck;
