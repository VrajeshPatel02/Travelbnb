// src/services/authService.ts
import axios from 'axios';
import { LoginRequest, LoginResponse, SignUpRequest } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        '/user/login', 
        credentials
      );
      const { token } = response.data;
      localStorage.setItem('token', token); // Save token to localStorage
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  async signUp(credentials: SignUpRequest): Promise<void> {
    try {
      await api.post('/user/createUser', credentials);
    } catch (error) {
      throw error;
    }
  },
  
};
export default api;