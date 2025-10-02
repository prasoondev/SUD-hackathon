import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbService, User, UserCreate, UserLogin } from '@/lib/database';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: UserLogin) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: UserCreate) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const checkUserAuth = async () => {
      try {
        if (dbService.isAuthenticated()) {
          const currentUser = await dbService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking user auth:', error);
        dbService.logout(); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const login = async (userData: UserLogin): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await dbService.loginUser(userData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData: UserCreate): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await dbService.createUser(userData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      dbService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};