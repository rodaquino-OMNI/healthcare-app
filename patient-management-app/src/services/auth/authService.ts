import axios from 'axios';

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Base API URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

/**
 * Authentication service for handling user login, logout, and token management
 */
export const authService = {
  /**
   * Log in a user with username and password
   */
  login: async (username: string, password: string): Promise<User> => {
    try {
      // For development/prototype phase, use mock authentication
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Mock successful login with test user
        if (username === 'test@example.com' && password === 'password') {
          const mockUser: User = {
            id: 'user-001',
            name: 'Test User',
            email: 'test@example.com',
            role: 'doctor'
          };
          
          // Store mock tokens
          localStorage.setItem(TOKEN_KEY, 'mock-token-12345');
          localStorage.setItem(REFRESH_TOKEN_KEY, 'mock-refresh-token-12345');
          
          return mockUser;
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // Real authentication with API
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });
      
      const { user, token, refreshToken } = response.data;
      
      // Store tokens
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Authentication failed');
    }
  },
  
  /**
   * Get the current logged-in user
   */
  getCurrentUser: async (): Promise<User | null> => {
    const token = authService.getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Return mock user
        return {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com',
          role: 'doctor'
        };
      }
      
      // Real API call to validate token and get user
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Clear invalid auth state
      authService.logout();
      return null;
    }
  },
  
  /**
   * Refresh the access token using the refresh token
   */
  refreshToken: async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Return a new mock token
        const newToken = 'mock-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
      }
      
      // Real API call to refresh token
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken
      });
      
      const { token } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      authService.logout();
      return null;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Get the current auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  }
};

export default authService;