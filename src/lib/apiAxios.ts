

import axios from 'axios';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAuthToken = () => {
  const cookies = require('next/headers').cookies();
  return cookies().get('auth_token')?.value || null;
};

export const setAuthToken = (token: string) => {
  document.cookie = `auth_token=${token}; path=/; expires=${new Date(
    Date.now() + 3600 * 1000
  ).toUTCString()}`;
};

export const clearAuthToken = () => {
  document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

export const getUserProfile = () => {
  if (typeof localStorage === 'undefined') return null;
  return JSON.parse(localStorage.getItem('user') || 'null');
};

export const setUserProfile = (profile: Record<string, any>) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(profile));
  }
};

export const clearUserProfile = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('user_profile');
  }
};

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};


// Upload document
export async function uploadDocument(file: File, userId: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', String(userId));

  try {
    const response = await axios.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, message: 'Upload failed' };
  }
}

// Fetch user-created documents
export async function fetchUserDocuments(userId: number) {
  try {
    const response = await axios.get(`/api/documents/user/${userId}`);
    return response.data.documents;
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return [];
  }
}
