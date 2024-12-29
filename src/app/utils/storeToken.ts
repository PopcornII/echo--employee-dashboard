
// utils/storeToken.ts

export const storeToken = (token: string) => {
    localStorage.setItem('auth_token', token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('auth_token');
  };
  

  export const getProfile = (): object | null => {
    const userProfile = localStorage.getItem('user');
    return userProfile? JSON.parse(userProfile) : null;
  };
  
  export const removeProfile = () => {
    localStorage.removeItem('user');
  };
  
  export const clearAll = () => {
    removeToken();
    removeProfile();
  };
  ;


