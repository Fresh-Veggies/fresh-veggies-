'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '@/lib/types';
import { getUser, saveUser, removeUser, STORAGE_KEYS } from '@/lib/utils';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const user = getUser();
        if (user) {
          setAuthState({
            isAuthenticated: true,
            user,
          });
        }
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (user: User) => {
    saveUser(user);
    setAuthState({
      isAuthenticated: true,
      user,
    });
  };

  const logout = () => {
    removeUser();
    // Clear other related storage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.CART);
      window.localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    }
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    saveUser(updatedUser);
    setAuthState({
      isAuthenticated: true,
      user: updatedUser,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 