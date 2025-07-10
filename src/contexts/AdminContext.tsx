'use client';

import { getTokenPayload, isTokenValid, removeInvalidToken } from '@/lib/auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('adminToken');
      if (savedToken) {
        if (isTokenValid(savedToken)) {
          const payload = getTokenPayload(savedToken);
          if (payload && payload.role === 'admin') {
            setAdminUser({
              id: Number.parseInt(payload.userId),
              nome: payload.email,
              email: payload.email,
              role: payload.role,
            });
            setToken(savedToken);
          } else {
            removeInvalidToken();
          }
        } else {
          removeInvalidToken();
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, user: AdminUser) => {
    if (isTokenValid(newToken)) {
      setToken(newToken);
      setAdminUser(user);
      localStorage.setItem('adminToken', newToken);
    } else {
      console.error('Token inválido fornecido no login');
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    removeInvalidToken();
  };

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (!isTokenValid(token)) {
          logout();
        }
      }, 60000); // Verificar a cada minuto

      return () => clearInterval(interval);
    }
  }, [token, logout]);

  const value = {
    isAdmin: !!adminUser && adminUser.role === 'admin',
    adminUser,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
