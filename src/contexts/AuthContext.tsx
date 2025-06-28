
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, DecodedUser } from '@/types/api';
import { apiClient } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: DecodedUser | null;
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
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    console.log('Token from localStorage:', token);
    console.log('User data from localStorage:', userData);
    
    if (token && userData) {
      try {
        // Verify token is not expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          apiClient.setToken(token);
          console.log('User authenticated from localStorage:', parsedUser);
        } else {
          console.log('Token expired, clearing localStorage');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Error parsing stored user data or token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    
    setIsLoading(false);
  }, []);

  interface DecodedToken {
    email: string;
    exp: number;
    iat: number;
    nameid: string;
    unique_name: string;
  }

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.login(email, password) as AuthResponse;
      
      if (response.success && response.accessToken) {
        // Store token first
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        apiClient.setToken(response.accessToken);
        
        // Decode and store user data
        const decodedUser = jwtDecode<DecodedToken>(response.accessToken);
        console.log('Decoded user data:', decodedUser);
        
        // Create user object with proper structure
        const userObj = {
          id: parseInt(decodedUser.nameid),
          email: decodedUser.email,
          name: decodedUser.unique_name,
          exp: decodedUser.exp,
          iat: decodedUser.iat
        };
        
        setUser(userObj);
        localStorage.setItem('userData', JSON.stringify(userObj));
        console.log('User logged in successfully:', userObj);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
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
    console.log('Logging out user');
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
