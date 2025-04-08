// Test file to verify Jest types are properly loaded

// This should work now that we've added the Jest types
jest.mock('some-module');

// Test some commonly used Jest functions to ensure TypeScript recognizes them
jest.fn();
// Create an object with a method that we can spy on
const testObject = { method: () => {} };
jest.spyOn(testObject, 'method');
jest.resetAllMocks();

// Using the jest.Mocked type
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

// This file doesn't need to be kept - it's just to verify type checking works