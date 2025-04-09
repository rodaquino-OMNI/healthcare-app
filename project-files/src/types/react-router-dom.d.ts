/**
 * Type definitions for react-router-dom 6.x
 * This file adds support for the nested routes syntax in React Router v6
 */

// This is a simple fix to allow the nested routes syntax in React Router v6
// We're not trying to redefine the entire module, just add the missing properties
import * as React from 'react';

// Augment the existing types with the missing properties
declare module 'react-router-dom' {
  // Add the missing components
  export const Routes: React.ComponentType<{
    children?: React.ReactNode;
    location?: any;
  }>;

  // Note: We're NOT declaring Route here to avoid the redeclaration error
  // Route is already declared in the original types

  export const Navigate: React.ComponentType<{
    to: string | { pathname: string; search?: string; hash?: string };
    replace?: boolean;
    state?: any;
  }>;

  export const Outlet: React.ComponentType<{
    context?: any;
  }>;

  // Note: We're NOT declaring NavLink here to avoid the redeclaration error
  // NavLink is already declared in the original types
}
