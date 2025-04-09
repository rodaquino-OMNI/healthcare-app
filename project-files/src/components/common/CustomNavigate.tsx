import React from 'react';
import { Navigate } from 'react-router-dom';

interface CustomNavigateProps {
  to: string | { pathname: string; search?: string; hash?: string };
  replace?: boolean;
  state?: any;
}

/**
 * CustomNavigate component that wraps the Navigate component from react-router-dom
 * This is a workaround for TypeScript errors with the Navigate component
 */
export const CustomNavigate: React.FC<CustomNavigateProps> = ({ to, replace, state }) => {
  // Use type assertion to avoid TypeScript errors
  const navigateProps: any = { to };
  
  if (replace !== undefined) {
    navigateProps.replace = replace;
  }
  
  if (state !== undefined) {
    navigateProps.state = state;
  }
  
  return <Navigate {...navigateProps} />;
};
