/**
 * TypeScript Regression Test
 *
 * This file tests various React import patterns to ensure compatibility
 * with our TypeScript configuration. If this file compiles successfully,
 * our type system is correctly configured for React imports.
 *
 * Note: This file is deliberately using .ts extension instead of .tsx to also
 * validate that React imports work in regular TypeScript files.
 */

// Import React using default import
import React from 'react';

// Use the namespace style internally instead of named imports for this test
// This tests that React is properly imported as a default import
const { useState, useEffect, createContext, useContext } = React;

// Basic hook type definitions
type SetStateAction<T> = React.SetStateAction<T>;
type Dispatch<T> = React.Dispatch<T>;
type FC<P = {}> = React.FC<P>;

// Test hook types
function testHooks(): void {
  // Test useState
  const [count, setCount]: [number, Dispatch<SetStateAction<number>>] = useState(0);
  const [text, setText]: [string, Dispatch<SetStateAction<string>>] = useState('Hello');
  
  // Test useEffect
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function
    return () => {
      console.log('Component unmounted');
    };
  }, []);
}

// Test Context API types
interface TestContextType {
  value: number;
  setValue: (value: number) => void;
}

// Test createContext
const contextValue: TestContextType = {
  value: 0,
  setValue: () => {},
};

function testContext(): void {
  const TestContext = createContext(contextValue);
  
  // Test useContext
  const { value, setValue } = useContext(TestContext);
  setValue(value + 1);
}

// Test event types
function testEventTypes(): void {
  // Event types without JSX
  type MouseEventType = React.MouseEvent<HTMLButtonElement>;
  type ChangeEventType = React.ChangeEvent<HTMLInputElement>;
  type FormEventType = React.FormEvent<HTMLFormElement>;
  
  const handleClick = (event: MouseEventType) => {
    console.log('Button clicked');
    event.preventDefault();
  };
  
  const handleChange = (event: ChangeEventType) => {
    console.log('Input changed:', event.target.value);
  };
  
  const handleSubmit = (event: FormEventType) => {
    event.preventDefault();
    console.log('Form submitted');
  };
}

// Test component type definitions
type ReactNode = React.ReactNode;
type CSSProperties = React.CSSProperties;

// This export ensures the file is a module
export {
  testHooks,
  testContext,
  testEventTypes
};

// If this file compiles without errors, the type system is correctly configured