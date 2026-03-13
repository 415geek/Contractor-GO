"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { websocketManager } from '@/lib/websocket';

interface User {
  id: string;
  phone?: string;
  email?: string;
  role: 'contractor' | 'client';
  display_name: string;
  primary_language: string;
  interface_language: string;
  avatar_url?: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  login: (data: { phone?: string; email?: string; password: string }) => Promise<void>;
  register: (data: {
    phone?: string;
    email?: string;
    password: string;
    role: 'contractor' | 'client';
    display_name?: string;
    primary_language?: string;
    interface_language?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const token = authAPI.getCurrentUser();
      if (token) {
        // In production, validate token with backend
        // For now, use stored user data
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setSession(token);
          
          // Connect to WebSocket
          try {
            await websocketManager.connect();
            // Set online status
            await websocketManager.setOnlineStatus(userData.id, 'online');
          } catch (error) {
            console.error('[AuthContext] Failed to connect WebSocket:', error);
          }
        }
      }
      setLoading(false);
    };

    checkSession();

    // Cleanup on unmount
    return () => {
      websocketManager.disconnect();
    };
  }, []);

  const login = async (data: { phone?: string; email?: string; password: string }) => {
    try {
      const result = await authAPI.login(data);
      
      if (result.user) {
        setUser(result.user);
        setSession(result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        // Connect to WebSocket
        try {
          await websocketManager.connect();
          await websocketManager.setOnlineStatus(result.user.id, 'online');
        } catch (error) {
          console.error('[AuthContext] Failed to connect WebSocket:', error);
        }
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const register = async (data: {
    phone?: string;
    email?: string;
    password: string;
    role: 'contractor' | 'client';
    display_name?: string;
    primary_language?: string;
    interface_language?: string;
  }) => {
    try {
      const result = await authAPI.register(data);
      
      if (result.user) {
        setUser(result.user);
        setSession(result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        // Connect to WebSocket
        try {
          await websocketManager.connect();
          await websocketManager.setOnlineStatus(result.user.id, 'online');
        } catch (error) {
          console.error('[AuthContext] Failed to connect WebSocket:', error);
        }
      }
    } catch (error) {
      console.error('[AuthContext] Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Set offline status before disconnecting
    if (user) {
      try {
        await websocketManager.setOnlineStatus(user.id, 'offline');
      } catch (error) {
        console.error('[AuthContext] Failed to set offline status:', error);
      }
    }
    
    // Disconnect WebSocket
    websocketManager.disconnect();
    
    // Clear auth data
    authAPI.logout();
    setUser(null);
    setSession(null);
    localStorage.removeItem('user_data');
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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