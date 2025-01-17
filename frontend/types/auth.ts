export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      role: string;
    };
  }
  
  export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
  }
  export interface SignUpRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }
