'use client'
// // utils/storeToken.ts

// export const storeToken = (token: string) => {
//     localStorage.setItem('auth_token', token);
//   };
  
//   export const getToken = (): string | null => {
//     return localStorage.getItem('auth_token');
//   };
  
//   export const removeToken = () => {
//     localStorage.removeItem('auth_token');
//   };

//   export const setProfile = (profile: object) => {
//     localStorage.setItem('user', JSON.stringify(profile));
//   };
  

//   export const getProfile = (): object | null => {
//     const userProfile = localStorage.getItem('user');
  
//     return userProfile? JSON.parse(userProfile) as object : null;
//   };
  
//   export const removeProfile = () => {
//     localStorage.removeItem('user');
//   };

  
// // Check if the token has expired
// export const isTokenExpired = (token: string | null): boolean => {
//   if (!token) return true;
  
//   try {
//     const decodedToken = JSON.parse(atob(token.split('.')[1]));
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decodedToken.exp < currentTime;
//   } catch (err) {
//     console.error("Error decoding token", err);
//     return true;
//   }
// };

  
// export const clearAll = () => {
//   removeToken();
//   removeProfile();
// };



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

// Remove profile-related functions as we're not storing user profile in localStorage
export const clearAll = () => {
  removeToken();
};
