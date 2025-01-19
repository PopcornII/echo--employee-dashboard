import { useEffect } from 'react';
import { useLoginStore } from '../store/useAuthStore';

const useTokenRefresh = () => {
  const { token, setToken, logout } = useLoginStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return;

      const isExpired = (() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp < Math.floor(Date.now() / 1000);
        } catch {
          return true;
        }
      })();

      if (isExpired) {
        // Attempt to refresh the token
        fetch('/api/auth/refresh-token', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.token) {
              setToken(data.token);
            } else {
              logout();
            }
          })
          .catch(() => logout());
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, [token, setToken, logout]);
};

export default useTokenRefresh;
