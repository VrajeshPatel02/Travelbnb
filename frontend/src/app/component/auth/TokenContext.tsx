"use client";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for the token and context
interface UserToken {
  accessToken: string;
  refreshToken: string;
}

interface TokenContextProps {
  accessToken: string | null;
  saveToken: (userToken: UserToken) => void;
  removeToken: () => void;
  refreshUserToken: () => Promise<string | null>;
  apiRequest: (url: string, options?: AxiosRequestConfig) => Promise<AxiosResponse>;
}

// Create the TokenContext with default null values
const TokenContext = createContext<TokenContextProps | null>(null);

// Create a provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialToken = typeof window !== 'undefined' && sessionStorage.getItem('token')
    ? (JSON.parse(sessionStorage.getItem('token') as string) as UserToken)
    : null;

  const [accessToken, setAccessToken] = useState<string | null>(initialToken?.accessToken || null);
  const [refreshToken, setRefreshToken] = useState<string | null>(initialToken?.refreshToken || null);

  // Save access and refresh tokens to session storage and state
  const saveToken = (userToken: UserToken) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', JSON.stringify(userToken));
    }
    setAccessToken(userToken.accessToken);
    setRefreshToken(userToken.refreshToken);
  };

  // Remove tokens from session storage and state
  const removeToken = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
    }
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Refresh token function
  const refreshUserToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post('/api/refresh-token', { refreshToken });
      const newToken: UserToken = response.data;
      saveToken(newToken);
      return newToken.accessToken;
    } catch (error) {
      console.error('Failed to refresh token', error);
      removeToken();
      return null;
    }
  };

  // Check token expiration and refresh if necessary
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!accessToken) return;

      // Decode the token to check its expiration
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();

      // If the token is about to expire within 1 minute, refresh it
      if (expirationTime - currentTime < 60000 && refreshToken) {
        await refreshUserToken();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // check every minute
    return () => clearInterval(interval); // cleanup interval on unmount
  }, [accessToken, refreshToken]);

  // Function to make authorized API calls with the latest access token
  const apiRequest = async (url: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Make the request with the updated access token
    return axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  // Provide both token values and actions (save/remove/refresh) to children components
  return (
    <TokenContext.Provider value={{ accessToken, saveToken, removeToken, refreshUserToken, apiRequest }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the TokenContext
export const useToken = (): TokenContextProps => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
