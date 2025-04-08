import '@types/jest';
import { authService } from '../authService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials in development mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_USE_MOCK = 'true';

      const mockUser = {
        id: 'user-001',
        name: 'Test User',
        email: 'test@example.com',
        role: 'doctor'
      };

      // Test with mock credentials
      const result = await authService.login('test@example.com', 'password');
      
      expect(result).toEqual(mockUser);
      expect(window.localStorage.getItem('auth_token')).toBe('mock-token-12345');
      expect(window.localStorage.getItem('refresh_token')).toBe('mock-refresh-token-12345');
    });

    it('should throw error with invalid credentials in development mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_USE_MOCK = 'true';

      // Test with invalid credentials
      await expect(authService.login('invalid@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should login successfully with valid credentials in production mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      const mockResponse = {
        data: {
          user: {
            id: 'user-002',
            name: 'Production User',
            email: 'prod@example.com',
            role: 'admin'
          },
          token: 'real-token-12345',
          refreshToken: 'real-refresh-token-12345'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Test with real API call
      const result = await authService.login('prod@example.com', 'securepassword');
      
      expect(result).toEqual(mockResponse.data.user);
      expect(window.localStorage.getItem('auth_token')).toBe('real-token-12345');
      expect(window.localStorage.getItem('refresh_token')).toBe('real-refresh-token-12345');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/auth/login',
        {
          username: 'prod@example.com',
          password: 'securepassword'
        }
      );
    });

    it('should handle API errors in production mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      const errorMessage = 'Invalid username or password';
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage
          }
        }
      });

      // Test API error handling
      await expect(authService.login('prod@example.com', 'wrongpassword'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null if no token exists', async () => {
      const result = await authService.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return mock user in development mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_USE_MOCK = 'true';

      // Set a token in localStorage
      window.localStorage.setItem('auth_token', 'mock-token-12345');

      const mockUser = {
        id: 'user-001',
        name: 'Test User',
        email: 'test@example.com',
        role: 'doctor'
      };

      const result = await authService.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should fetch user from API in production mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      // Set a token in localStorage
      window.localStorage.setItem('auth_token', 'real-token-12345');

      const mockResponse = {
        data: {
          user: {
            id: 'user-002',
            name: 'Production User',
            email: 'prod@example.com',
            role: 'admin'
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.getCurrentUser();
      
      expect(result).toEqual(mockResponse.data.user);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.example.com/auth/me',
        {
          headers: {
            Authorization: 'Bearer real-token-12345'
          }
        }
      );
    });

    it('should handle API errors and log out user', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      // Set a token in localStorage
      window.localStorage.setItem('auth_token', 'invalid-token');

      mockedAxios.get.mockRejectedValueOnce(new Error('Token invalid'));

      const result = await authService.getCurrentUser();
      
      expect(result).toBeNull();
      expect(window.localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should return null if no refresh token exists', async () => {
      const result = await authService.refreshToken();
      expect(result).toBeNull();
    });

    it('should return a new mock token in development mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_USE_MOCK = 'true';

      // Set a refresh token in localStorage
      window.localStorage.setItem('refresh_token', 'mock-refresh-token-12345');

      const result = await authService.refreshToken();
      
      expect(result).not.toBeNull();
      expect(typeof result).toBe('string');
      expect(window.localStorage.getItem('auth_token')).toBe(result);
    });

    it('should fetch new token from API in production mode', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      // Set a refresh token in localStorage
      window.localStorage.setItem('refresh_token', 'real-refresh-token-12345');

      const mockResponse = {
        data: {
          token: 'new-real-token-12345'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.refreshToken();
      
      expect(result).toBe('new-real-token-12345');
      expect(window.localStorage.getItem('auth_token')).toBe('new-real-token-12345');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/auth/refresh-token',
        {
          refreshToken: 'real-refresh-token-12345'
        }
      );
    });

    it('should handle API errors during token refresh', async () => {
      // Set environment variables for testing
      process.env.NODE_ENV = 'production';
      process.env.REACT_APP_USE_MOCK = 'false';

      // Set tokens in localStorage
      window.localStorage.setItem('auth_token', 'old-token');
      window.localStorage.setItem('refresh_token', 'invalid-refresh-token');

      mockedAxios.post.mockRejectedValueOnce(new Error('Invalid refresh token'));

      const result = await authService.refreshToken();
      
      expect(result).toBeNull();
      expect(window.localStorage.getItem('auth_token')).toBeNull();
      expect(window.localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear tokens from localStorage', () => {
      // Set tokens in localStorage
      window.localStorage.setItem('auth_token', 'token-12345');
      window.localStorage.setItem('refresh_token', 'refresh-token-12345');

      authService.logout();
      
      expect(window.localStorage.getItem('auth_token')).toBeNull();
      expect(window.localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const token = 'test-token-12345';
      window.localStorage.setItem('auth_token', token);

      const result = authService.getToken();
      
      expect(result).toBe(token);
    });

    it('should return null if no token exists', () => {
      const result = authService.getToken();
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      window.localStorage.setItem('auth_token', 'valid-token');
      
      const result = authService.isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      const result = authService.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });
});