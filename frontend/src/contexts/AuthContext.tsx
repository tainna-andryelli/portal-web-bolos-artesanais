import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch('/auth/me', { cache: 'no-store' })
      .then(() => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      })
      .finally(() => setIsLoading(false));
  }, []);

  function login() {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}