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
      roles: string[];
    };
  }
  
  export interface User {
    id: number;
    name: string;
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

  export interface Property {
    id: number;
    name: string;
    noGuests: number;
    no_bedrooms: number;
    no_bathrooms: number;
    price: number;
    country: {
      id: number;
      name: string;
    };
    location: {
      id: number;
      name: string;
    };
    description: string | null;
  }