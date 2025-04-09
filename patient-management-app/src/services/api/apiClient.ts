import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Define the base API URL - should be configurable
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create custom Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Token refresh response interface
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Create an event to notify when auth needs to be refreshed
const authLogoutEvent = new CustomEvent('auth:logout');

// Add request interceptor to include token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if a token refresh is in progress
let isRefreshing = false;

// Store pending requests that should be retried after token refresh
let pendingRequests: Array<{
  config: AxiosRequestConfig;
  resolve: (value: unknown) => void;
  reject: (error: any) => void;
}> = [];

// Helper to retry requests after token refresh
const retryPendingRequests = (newToken: string) => {
  pendingRequests.forEach(({ config, resolve, reject }) => {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${newToken}`;
    }
    
    // Retry the request with the new token
    axios.request(config)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
  
  // Clear pending requests
  pendingRequests = [];
};

// Add response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Extract config and status from error
    const originalConfig = error.config;
    
    // If there's no config, we can't retry the request
    if (!originalConfig) {
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized errors for token refresh
    if (error.response?.status === 401) {
      // Check if this is already a refresh token request to prevent infinite loops
      if (originalConfig.url === '/auth/refresh-token') {
        // Token refresh failed, user needs to login again
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(authLogoutEvent);
        return Promise.reject(error);
      }
      
      // Try to refresh the token
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await axios.post<RefreshResponse>(
            `${BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry pending requests with new token
          retryPendingRequests(accessToken);
          
          // Update the current request
          if (originalConfig.headers) {
            originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          
          // Retry the request that triggered the refresh
          return axios(originalConfig);
        } catch (refreshError) {
          // If refresh fails, clear tokens and require re-login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.dispatchEvent(authLogoutEvent);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If a token refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            config: originalConfig,
            resolve,
            reject,
          });
        });
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;