export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      roles: string[];
    };
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
  }
  export interface SignUpRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }
  