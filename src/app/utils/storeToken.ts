
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

  
  export const isTokenExpired = (token: string) => {
    if(!token) return true;
    try{
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
      if(decodedToken.exp < Date.now() / 1000) return true;
    }catch(err){
      console.error("Error decoding token", err);
      return true;
    }
  };
  

  export const clearAll = () => {
    removeToken();
    removeProfile();
  };
  


