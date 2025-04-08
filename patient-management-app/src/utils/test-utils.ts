/**
 * Comprehensive Test Utility
 * 
 * This file provides utility functions for systematic testing of the
 * Patient Management System application.
 */

import axios from 'axios';

// Environment configuration for testing
const TEST_ENV = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  USE_MOCK: process.env.REACT_APP_USE_MOCK === 'true',
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
};

// Test logging utilities
export const TestLogger = {
  logs: [] as TestLogEntry[],
  
  /**
   * Log an error or issue found during testing
   */
  logIssue(
    category: string, 
    severity: 'critical' | 'high' | 'medium' | 'low', 
    message: string, 
    details?: unknown
  ): void {
    const timestamp = new Date().toISOString();
    this.logs.push({
      type: 'issue',
      timestamp,
      category,
      severity,
      message,
      details: details ? JSON.stringify(details) : undefined,
    });
    
    console.error(`[${severity.toUpperCase()}] ${category}: ${message}`);
  },
  
  /**
   * Log a successful test result
   */
  logSuccess(category: string, message: string, details?: unknown): void {
    const timestamp = new Date().toISOString();
    this.logs.push({
      type: 'success',
      timestamp,
      category,
      message,
      details: details ? JSON.stringify(details) : undefined,
    });
    
    console.log(`[SUCCESS] ${category}: ${message}`);
  },
  
  /**
   * Generate a full report of all test logs
   */
  generateReport(): TestReport {
    const issues = this.logs.filter(log => log.type === 'issue');
    const successes = this.logs.filter(log => log.type === 'success');
    
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    const highIssues = issues.filter(issue => issue.severity === 'high');
    const mediumIssues = issues.filter(issue => issue.severity === 'medium');
    const lowIssues = issues.filter(issue => issue.severity === 'low');
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.logs.length,
        issues: issues.length,
        successes: successes.length,
        bySeverity: {
          critical: criticalIssues.length,
          high: highIssues.length,
          medium: mediumIssues.length,
          low: lowIssues.length,
        }
      },
      issuesByCategory: this.categorizeIssues(issues),
      successesByCategory: this.categorizeSuccesses(successes),
      allLogs: this.logs,
    };
  },
  
  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  },
  
  /**
   * Group issues by category
   */
  categorizeIssues(issues: TestLogEntry[]): Record<string, TestLogEntry[]> {
    return issues.reduce((acc, issue) => {
      const category = issue.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(issue);
      return acc;
    }, {} as Record<string, TestLogEntry[]>);
  },
  
  /**
   * Group successes by category
   */
  categorizeSuccesses(successes: TestLogEntry[]): Record<string, TestLogEntry[]> {
    return successes.reduce((acc, success) => {
      const category = success.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(success);
      return acc;
    }, {} as Record<string, TestLogEntry[]>);
  }
};

// Authentication testing utilities
export const AuthTester = {
  /**
   * Test the login functionality
   */
  async testLogin(username: string, password: string): Promise<void> {
    try {
      // Clear any existing tokens
      localStorage.removeItem(TEST_ENV.AUTH_TOKEN_KEY);
      localStorage.removeItem(TEST_ENV.REFRESH_TOKEN_KEY);
      
      // If using mock data
      if (TEST_ENV.USE_MOCK) {
        if (username === 'test@example.com' && password === 'password') {
          localStorage.setItem(TEST_ENV.AUTH_TOKEN_KEY, 'mock-token-12345');
          localStorage.setItem(TEST_ENV.REFRESH_TOKEN_KEY, 'mock-refresh-token-12345');
          TestLogger.logSuccess('AUTH', 'Login successful with mock credentials');
        } else {
          TestLogger.logIssue('AUTH', 'medium', 'Login failed with mock credentials');
        }
        return;
      }
      
      // Real API call
      const response = await axios.post(`${TEST_ENV.API_BASE_URL}/auth/login`, {
        username,
        password
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem(TEST_ENV.AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(TEST_ENV.REFRESH_TOKEN_KEY, response.data.refreshToken);
        TestLogger.logSuccess('AUTH', 'Login successful with API');
      } else {
        TestLogger.logIssue('AUTH', 'high', 'Login API response missing token', response.data);
      }
    } catch (error) {
      TestLogger.logIssue('AUTH', 'high', 'Login test failed', error);
    }
  },
  
  /**
   * Test the token refresh functionality
   */
  async testTokenRefresh(): Promise<void> {
    try {
      const originalToken = localStorage.getItem(TEST_ENV.AUTH_TOKEN_KEY);
      if (!originalToken) {
        TestLogger.logIssue('AUTH', 'medium', 'No token available for refresh test');
        return;
      }
      
      // If using mock data
      if (TEST_ENV.USE_MOCK) {
        const newToken = `mock-token-${Math.random().toString(36).substring(2)}`;
        localStorage.setItem(TEST_ENV.AUTH_TOKEN_KEY, newToken);
        TestLogger.logSuccess('AUTH', 'Token refresh successful with mock data');
        return;
      }
      
      // Real API call
      const refreshToken = localStorage.getItem(TEST_ENV.REFRESH_TOKEN_KEY);
      const response = await axios.post(`${TEST_ENV.API_BASE_URL}/auth/refresh-token`, {
        refreshToken
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem(TEST_ENV.AUTH_TOKEN_KEY, response.data.token);
        TestLogger.logSuccess('AUTH', 'Token refresh successful with API');
      } else {
        TestLogger.logIssue('AUTH', 'high', 'Token refresh API response missing token', response.data);
      }
    } catch (error) {
      TestLogger.logIssue('AUTH', 'high', 'Token refresh test failed', error);
    }
  },
  
  /**
   * Test the logout functionality
   */
  testLogout(): void {
    try {
      localStorage.removeItem(TEST_ENV.AUTH_TOKEN_KEY);
      localStorage.removeItem(TEST_ENV.REFRESH_TOKEN_KEY);
      
      // Verify tokens were removed
      const tokenAfterLogout = localStorage.getItem(TEST_ENV.AUTH_TOKEN_KEY);
      const refreshTokenAfterLogout = localStorage.getItem(TEST_ENV.REFRESH_TOKEN_KEY);
      
      if (!tokenAfterLogout && !refreshTokenAfterLogout) {
        TestLogger.logSuccess('AUTH', 'Logout successful');
      } else {
        TestLogger.logIssue('AUTH', 'high', 'Tokens not properly removed during logout');
      }
    } catch (error) {
      TestLogger.logIssue('AUTH', 'medium', 'Logout test failed', error);
    }
  }
};

// API testing utilities
export const ApiTester = {
  /**
   * Test API connectivity
   */
  async testApiConnectivity(): Promise<void> {
    try {
      if (TEST_ENV.USE_MOCK) {
        TestLogger.logSuccess('API', 'Mock API connectivity test skipped');
        return;
      }
      
      const response = await axios.get(`${TEST_ENV.API_BASE_URL}/health`);
      if (response.status === 200) {
        TestLogger.logSuccess('API', 'API health check successful', response.data);
      } else {
        TestLogger.logIssue('API', 'critical', 'API health check failed', response);
      }
    } catch (error) {
      TestLogger.logIssue('API', 'critical', 'API connectivity test failed', error);
    }
  },
  
  /**
   * Test patient API endpoints
   */
  async testPatientEndpoints(): Promise<void> {
    try {
      const token = localStorage.getItem(TEST_ENV.AUTH_TOKEN_KEY);
      if (!token) {
        TestLogger.logIssue('API', 'high', 'No auth token available for patient API tests');
        return;
      }
      
      if (TEST_ENV.USE_MOCK) {
        TestLogger.logSuccess('API', 'Mock patient API tests skipped');
        return;
      }
      
      // Test get all patients
      const listResponse = await axios.get(`${TEST_ENV.API_BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (listResponse.status === 200 && Array.isArray(listResponse.data)) {
        TestLogger.logSuccess('API', 'Get patients list successful', {
          count: listResponse.data.length
        });
        
        // If patients exist, test getting a single patient
        if (listResponse.data.length > 0) {
          const patientId = listResponse.data[0].id;
          const detailResponse = await axios.get(`${TEST_ENV.API_BASE_URL}/patients/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (detailResponse.status === 200 && detailResponse.data) {
            TestLogger.logSuccess('API', 'Get patient detail successful');
          } else {
            TestLogger.logIssue('API', 'high', 'Get patient detail failed', detailResponse);
          }
        }
      } else {
        TestLogger.logIssue('API', 'high', 'Get patients list failed', listResponse);
      }
    } catch (error) {
      TestLogger.logIssue('API', 'high', 'Patient API tests failed', error);
    }
  }
};

// UI component testing utilities
export const UiTester = {
  /**
   * Test form validation
   */
  testFormValidation(formId: string, fields: Record<string, string>, submitButtonSelector: string): void {
    try {
      const form = document.getElementById(formId);
      if (!form) {
        TestLogger.logIssue('UI', 'high', `Form with ID "${formId}" not found`);
        return;
      }
      
      // First test - empty form submission
      const emptySubmitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(emptySubmitEvent);
      
      // Check if the form prevented default (validation working)
      if (!emptySubmitEvent.defaultPrevented) {
        TestLogger.logIssue('UI', 'high', 'Form validation failed - empty form submission not prevented');
      } else {
        TestLogger.logSuccess('UI', 'Empty form validation successful');
      }
      
      // Test field-by-field validation
      Object.entries(fields).forEach(([fieldName, value]) => {
        const field = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
        if (!field) {
          TestLogger.logIssue('UI', 'medium', `Field "${fieldName}" not found in form`);
          return;
        }
        
        // Test empty field
        field.value = '';
        field.dispatchEvent(new Event('blur'));
        
        // Check for validation message or error class
        const hasError = field.validity.valid === false || 
                         field.hasAttribute('aria-invalid') ||
                         field.classList.contains('is-invalid');
        
        if (!hasError) {
          TestLogger.logIssue('UI', 'medium', `Validation failed for empty field "${fieldName}"`);
        } else {
          TestLogger.logSuccess('UI', `Empty field validation successful for "${fieldName}"`);
        }
        
        // Test with valid value
        field.value = value;
        field.dispatchEvent(new Event('blur'));
        
        // Check for validation message removal
        const stillHasError = field.validity.valid === false || 
                              field.hasAttribute('aria-invalid') ||
                              field.classList.contains('is-invalid');
        
        if (stillHasError) {
          TestLogger.logIssue('UI', 'medium', `Validation failed for valid field "${fieldName}"`);
        } else {
          TestLogger.logSuccess('UI', `Valid field validation successful for "${fieldName}"`);
        }
      });
    } catch (error) {
      TestLogger.logIssue('UI', 'high', 'Form validation test failed', error);
    }
  },
  
  /**
   * Test responsive layout at different viewport sizes
   */
  testResponsiveLayout(breakpoints: { [key: string]: number } = {
    xs: 320,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  }): void {
    try {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      Object.entries(breakpoints).forEach(([breakpoint, width]) => {
        // Resize viewport
        window.innerWidth = width;
        window.innerHeight = 800; // Fixed height for testing
        window.dispatchEvent(new Event('resize'));
        
        // Check for layout issues
        const overflowX = document.body.scrollWidth > width;
        if (overflowX) {
          TestLogger.logIssue('UI', 'medium', `Horizontal overflow at ${breakpoint} breakpoint (${width}px)`);
        } else {
          TestLogger.logSuccess('UI', `No horizontal overflow at ${breakpoint} breakpoint (${width}px)`);
        }
        
        // Check if important elements are visible
        const importantSelectors = ['header', 'nav', 'main', 'footer', '.card', '.btn'];
        importantSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          if (elements.length === 0) {
            TestLogger.logIssue('UI', 'low', `No ${selector} elements found at ${breakpoint} breakpoint`);
          } else {
            let hiddenElements = 0;
            elements.forEach(el => {
              const rect = (el as HTMLElement).getBoundingClientRect();
              const isHidden = rect.width === 0 || rect.height === 0 || 
                              window.getComputedStyle(el as HTMLElement).display === 'none';
              if (isHidden) {
                hiddenElements++;
              }
            });
            
            if (hiddenElements > 0) {
              TestLogger.logIssue('UI', 'low', `${hiddenElements} ${selector} elements hidden at ${breakpoint} breakpoint`);
            } else {
              TestLogger.logSuccess('UI', `All ${selector} elements visible at ${breakpoint} breakpoint`);
            }
          }
        });
      });
      
      // Restore original viewport size
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      window.dispatchEvent(new Event('resize'));
    } catch (error) {
      TestLogger.logIssue('UI', 'medium', 'Responsive layout test failed', error);
    }
  }
};

// Performance testing utilities
export const PerformanceTester = {
  /**
   * Measure component render time
   */
  measureRenderTime(componentId: string, iterations: number = 5): void {
    try {
      const component = document.getElementById(componentId);
      if (!component) {
        TestLogger.logIssue('PERFORMANCE', 'medium', `Component with ID "${componentId}" not found`);
        return;
      }
      
      const renderTimes: number[] = [];
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'measure' && entry.name.startsWith(`render-${componentId}`)) {
            renderTimes.push(entry.duration);
          }
        }
      });
      observer.observe({ entryTypes: ['measure'] });
      
      // Force multiple rerenders
      for (let i = 0; i < iterations; i++) {
        performance.mark(`start-render-${componentId}-${i}`);
        
        // Trigger rerender (different techniques might be needed based on the component)
        const event = new Event('update');
        component.dispatchEvent(event);
        
        // For React components, you might need to update state instead
        
        performance.mark(`end-render-${componentId}-${i}`);
        performance.measure(`render-${componentId}-${i}`, 
                           `start-render-${componentId}-${i}`, 
                           `end-render-${componentId}-${i}`);
      }
      
      observer.disconnect();
      
      if (renderTimes.length > 0) {
        const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
        const maxRenderTime = Math.max(...renderTimes);
        
        if (avgRenderTime > 50) { // 50ms threshold
          TestLogger.logIssue('PERFORMANCE', 'medium', 
                            `Slow render time for "${componentId}": ${avgRenderTime.toFixed(2)}ms avg, ${maxRenderTime.toFixed(2)}ms max`,
                            { renderTimes });
        } else {
          TestLogger.logSuccess('PERFORMANCE', 
                              `Good render time for "${componentId}": ${avgRenderTime.toFixed(2)}ms avg, ${maxRenderTime.toFixed(2)}ms max`,
                              { renderTimes });
        }
      } else {
        TestLogger.logIssue('PERFORMANCE', 'low', `No render measurements captured for "${componentId}"`);
      }
    } catch (error) {
      TestLogger.logIssue('PERFORMANCE', 'medium', 'Render time measurement failed', error);
    }
  },
  
  /**
   * Measure API request time
   */
  async measureApiRequestTime(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: unknown): Promise<void> {
    try {
      const token = localStorage.getItem(TEST_ENV.AUTH_TOKEN_KEY);
      
      if (TEST_ENV.USE_MOCK) {
        TestLogger.logSuccess('PERFORMANCE', 'Mock API request time test skipped');
        return;
      }
      
      const url = `${TEST_ENV.API_BASE_URL}${endpoint}`;
      const startTime = performance.now();
      
      if (method === 'GET') {
        await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
      } else {
        await axios.post(url, data, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
      }
      
      const endTime = performance.now();
      const requestTime = endTime - startTime;
      
      if (requestTime > 1000) { // 1 second threshold
        TestLogger.logIssue('PERFORMANCE', 'high', 
                          `Slow API request time for ${method} ${endpoint}: ${requestTime.toFixed(2)}ms`);
      } else if (requestTime > 300) { // 300ms threshold
        TestLogger.logIssue('PERFORMANCE', 'medium', 
                          `Moderate API request time for ${method} ${endpoint}: ${requestTime.toFixed(2)}ms`);
      } else {
        TestLogger.logSuccess('PERFORMANCE', 
                            `Good API request time for ${method} ${endpoint}: ${requestTime.toFixed(2)}ms`);
      }
    } catch (error) {
      TestLogger.logIssue('PERFORMANCE', 'high', `API request time measurement failed for ${method} ${endpoint}`, error);
    }
  }
};

// Main testing function to run all tests
export async function runComprehensiveTests(): Promise<TestReport> {
  TestLogger.clearLogs();
  
  // Login and API tests
  await AuthTester.testLogin('test@example.com', 'password');
  await ApiTester.testApiConnectivity();
  await ApiTester.testPatientEndpoints();
  await AuthTester.testTokenRefresh();
  AuthTester.testLogout();
  
  // UI Tests - must be run when components are mounted
  // These would be called from component test harnesses
  
  // Example form validation test
  // UiTester.testFormValidation('login-form', {
  //   username: 'test@example.com',
  //   password: 'password123'
  // }, '#login-button');
  
  // Example responsive layout test
  // UiTester.testResponsiveLayout();
  
  // Performance tests
  // PerformanceTester.measureRenderTime('patient-list');
  // await PerformanceTester.measureApiRequestTime('/patients');
  
  return TestLogger.generateReport();
}

// Types
export interface TestLogEntry {
  type: 'issue' | 'success';
  timestamp: string;
  category: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

export interface TestReport {
  timestamp: string;
  summary: {
    total: number;
    issues: number;
    successes: number;
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    }
  };
  issuesByCategory: Record<string, TestLogEntry[]>;
  successesByCategory: Record<string, TestLogEntry[]>;
  allLogs: TestLogEntry[];
}