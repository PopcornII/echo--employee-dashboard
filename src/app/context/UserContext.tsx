import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserFromToken } from '@/app/utils/storeToken';

const UserContext = createContext(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = document.cookie.split('auth_token=')[1];
    if (token) {
      const userFromToken = getUserFromToken(token);
      setUser(userFromToken);
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
