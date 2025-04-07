// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Configure Jest timer mocks for consistency across tests
// This provides backward compatibility with Jest v26
beforeEach(() => {
  jest.useFakeTimers();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Define globals for Jest v28 compatibility
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Suppress console errors/warnings during tests
// Comment these out if you want to see the warnings during test execution
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.warn = (...args) => {
    // Suppress specific React warnings that might occur during tests
    if (args[0] && args[0].includes && (
      args[0].includes('ReactDOM.render is no longer supported') ||
      args[0].includes('Warning: componentWill') ||
      args[0].includes('Warning: React does not recognize the')
    )) {
      return;
    }
    originalConsoleWarn(...args);
  };

  console.error = (...args) => {
    // Filter out specific known errors that don't affect tests
    if (args[0] && args[0].includes && (
      args[0].includes('Error: Not implemented:') ||
      args[0].includes('Warning: An update to')
    )) {
      return;
    }
    originalConsoleError(...args);
  };
});

// Restore console functions after tests
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
