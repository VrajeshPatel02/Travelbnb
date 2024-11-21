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
// services/authservice.ts
export const fetchProperties = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/property/allProperties");
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    throw err; // Re-throw the error so the calling component can handle it
  }
};
export const logoutUser = () => {
  // Clear user session data
  localStorage.removeItem("user");
};


export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        '/user/login', 
        credentials
      );
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
