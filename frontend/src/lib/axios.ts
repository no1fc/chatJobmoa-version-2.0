import axios, { AxiosError } from 'axios';
import { getAccessToken, removeAccessToken } from '@/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3056';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeAccessToken();
      
      if (typeof window !== 'undefined') {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
