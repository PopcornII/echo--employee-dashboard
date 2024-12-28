// utils/fetcher.ts
export async function fetcher(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  }
  