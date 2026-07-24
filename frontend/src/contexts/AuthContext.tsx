import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { storage } from '../utils/storage';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = storage.getToken();
    const savedUser = storage.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    } else {
      // Demo auto-login default practitioner profile so app works instantly out-of-the-box
      const defaultUser: User = {
        id: 'doc_101',
        email: 'doctor@smilescan.com',
        name: 'Dr. Sarah Jenkins, DDS',
        role: 'DOCTOR',
        hospital: 'St. Jude Dental & Maxillofacial Center',
        department: 'Department of Endodontics & Radiology',
        experienceYears: 12,
        specialization: 'Endodontics & AI Diagnostics',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        createdAt: '2025-01-15T09:00:00Z',
      };
      const defaultToken = 'smilescan_demo_jwt_token_2026';
      setToken(defaultToken);
      setUser(defaultUser);
      storage.setToken(defaultToken);
      storage.setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    storage.setToken(newToken);
    storage.setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    storage.clearAll();
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
