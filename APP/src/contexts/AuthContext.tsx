import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, hospital?: string, department?: string, specialization?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smilescan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smilescan_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthState(async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('smilescan_token', idToken);
      } else if (!token) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('smilescan_user');
        localStorage.removeItem('smilescan_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [token]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: userProfile, token: userToken } = await authService.login(email, pass);
      setUser(userProfile);
      setToken(userToken);
      localStorage.setItem('smilescan_user', JSON.stringify(userProfile));
      localStorage.setItem('smilescan_token', userToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    pass: string,
    name: string,
    hospital?: string,
    department?: string,
    specialization?: string
  ) => {
    setIsLoading(true);
    try {
      const { user: userProfile, token: userToken } = await authService.register(
        email,
        pass,
        name,
        hospital,
        department,
        specialization
      );
      setUser(userProfile);
      setToken(userToken);
      localStorage.setItem('smilescan_user', JSON.stringify(userProfile));
      localStorage.setItem('smilescan_token', userToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('smilescan_user');
    localStorage.removeItem('smilescan_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
