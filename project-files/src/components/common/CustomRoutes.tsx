import React from 'react';
import { Routes } from 'react-router-dom';

interface CustomRoutesProps {
  children: React.ReactNode;
  location?: any;
}

/**
 * CustomRoutes component that wraps the Routes component from react-router-dom
 * This is a workaround for TypeScript errors with the Routes component
 */
export const CustomRoutes: React.FC<CustomRoutesProps> = ({ children, location }) => {
  // Use type assertion to avoid TypeScript errors
  const routesProps: any = {};
  
  if (location !== undefined) {
    routesProps.location = location;
  }
  
  return <Routes {...routesProps}>{children}</Routes>;
};
