"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { register, login, logout, getCurrentUser, getToken } from '@/lib/supabaseAuth';
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
      const token = getToken();
      if (token) {
        const userData = getCurrentUser();
        if (userData) {
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

  const handleLogin = async (data: { phone?: string; email?: string; password: string }) => {
    try {
      const result = await login(data);
      
      if (result.user) {
        setUser(result.user);
        setSession(result.token);
        
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

  const handleRegister = async (data: {
    phone?: string;
    email?: string;
    password: string;
    role: 'contractor' | 'client';
    display_name?: string;
    primary_language?: string;
    interface_language?: string;
  }) => {
    try {
      const result = await register(data);
      
      if (result.user) {
        setUser(result.user);
        setSession(result.token);
        
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

  const handleLogout = async () => {
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
    logout();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
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