const BASE_URL = 'http://localhost:3333';

interface ApiError {
  error: string;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw body as ApiError;
  }

  return response.json() as Promise<T>;
}