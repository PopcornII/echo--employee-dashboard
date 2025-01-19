// utils/fetcher.ts
export async function fetcher(url: string, options: RequestInit = {}) {
  const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
  };

  const token = getCookie('auth_token');  // Get the auth_token from cookies
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}
