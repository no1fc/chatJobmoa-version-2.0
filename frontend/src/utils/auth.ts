export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
};

export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
