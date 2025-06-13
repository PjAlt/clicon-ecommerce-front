
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    id: number;
    name: string;
    email: string;
    password: string;
    contact: string;
  }) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiClient.setToken(token);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.login(email, password) as AuthResponse;
      
      if (response.success) {
        apiClient.setToken(response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        // In a real app, you'd decode the JWT to get user info
        // For now, we'll store basic info
        const userData = { 
          id: 1, // This should come from the JWT
          name: email.split('@')[0], 
          email,
          contact: '',
          createdAt: new Date().toISOString(),
          imageUrl: '',
          isDeleted: false
        };
        
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      // Return a proper AuthResponse for error cases
      return {
        success: false,
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        message: 'Login failed'
      };
    }
  };

  const register = async (userData: {
    id: number;
    name: string;
    email: string;
    password: string;
    contact: string;
  }) => {
    try {
      const response = await apiClient.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyOtp(email, otp);
      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.clearToken();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
