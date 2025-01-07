'use client';

import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css'; // Toast styles
import { useLoginStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isTokenValid} = useLoginStore();
  const router = useRouter();
  useEffect(() => {
    const { checkAndSetToken } = useLoginStore.getState();
    checkAndSetToken(); // This will check the token from localStorage
  }, []);
  useEffect(() => {
    if (!isAuthenticated || !isTokenValid()) {
      router.replace('/'); // Redirect to login if not authenticated or token is invalid
    }
  }, [isAuthenticated, isTokenValid, router]);

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
