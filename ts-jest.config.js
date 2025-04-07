/**
 * This file configures ts-jest for Jest v28
 * It helps with TypeScript integration in the Jest environment
 */
module.exports = {
  // Use tsconfig.json for TypeScript configuration
  tsconfig: 'tsconfig.json',
  
  // Handling of JSX
  jsx: 'react-jsx',
  
  // Disable ESM to maintain compatibility with the existing codebase
  useESM: false,
  
  // Diagnostics settings
  diagnostics: {
    // Enable type checking in tests
    warnOnly: true,
    ignoreCodes: [
      2307, // Cannot find module 'X' or its corresponding type declarations
      2582, // Module 'X' is not available at runtime due to some import elision
      6133, // Unused declaration
      18002, // The 'files' list in config file is empty
      18003, // No inputs were found in config file
    ],
  },
  
  // Transform settings
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  
  // For backwards compatibility with older code
  isolatedModules: true,
  
  // Cache transpilation results
  astTransformers: {
    before: [],
    after: [],
  },
}