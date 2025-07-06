
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';

// Define a more detailed User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // Added role
  profilePictureUrl?: string;
  phone?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null; 
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string, role: 'user' | 'agent', phone?: string, profilePictureUrl?: string) => Promise<any>;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  loginWithToken: (token: string, userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'estateExploreUser';
const LOCAL_STORAGE_KEY_TOKEN = 'estateExploreToken'; 
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@albatrossrealtor.com'; // Use NEXT_PUBLIC for client-side env var

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUserString = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN); 
      if (storedUserString) {
        setUser(JSON.parse(storedUserString));
      }
      if (storedToken) {
        setToken(storedToken); 
      }
    } catch (error) {
      console.error("Error parsing auth data from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
      localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success && result.data && result.data.user && result.data.token) {
        const userData = result.data.user as User;
        loginWithToken(result.data.token, userData);
        return userData;
      } else {
        const errorMsg = result.error || (result.success === false ? "Unknown server error during login" : "Incomplete data from server during login");
        console.error(`Login failed: ${errorMsg}`);
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Login API call failed:", error);
      setIsLoading(false);
      return null;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'agent', phone?: string, profilePictureUrl?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone, profilePictureUrl }),
      });
      const result = await response.json();
      if (result.success && result.data?.user && result.data?.token) {
        loginWithToken(result.data.token, result.data.user);
      }
      return result;
    } catch (error) {
      console.error("Signup API call failed:", error);
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithToken = (token: string, userData: User) => {
    setIsLoading(true);
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(userData));
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
    setUser(userData);
    setToken(token);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN); 
    setUser(null);
    setToken(null); 
    router.push('/auth/login');
  };
  
  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
        const newUser = { ...user, ...updatedUserData };
        setUser(newUser);
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, updateUser, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
