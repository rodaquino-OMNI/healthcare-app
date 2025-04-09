import React from 'react';
import { Route } from 'react-router-dom';

interface CustomRouteProps {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * CustomRoute component that wraps the Route component from react-router-dom
 * This is a workaround for TypeScript errors with the Route component
 */
export const CustomRoute: React.FC<CustomRouteProps> = ({ path, index, element, children }) => {
  // Use type assertion to avoid TypeScript errors
  const routeProps: any = {};
  
  if (path !== undefined) {
    routeProps.path = path;
  }
  
  if (index !== undefined) {
    routeProps.index = index;
  }
  
  if (element !== undefined) {
    routeProps.element = element;
  }
  
  return <Route {...routeProps}>{children}</Route>;
};
