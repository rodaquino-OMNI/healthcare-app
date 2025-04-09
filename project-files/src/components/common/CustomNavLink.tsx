import React from 'react';
import { NavLink } from 'react-router-dom';

interface CustomNavLinkProps {
  to: string | { pathname: string; search?: string; hash?: string };
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
  children?: React.ReactNode;
  caseSensitive?: boolean;
  replace?: boolean;
  state?: any;
}

/**
 * CustomNavLink component that wraps the NavLink component from react-router-dom
 * This is a workaround for TypeScript errors with the NavLink component
 */
export const CustomNavLink: React.FC<CustomNavLinkProps> = (props) => {
  // Use type assertion to avoid TypeScript errors
  const navLinkProps: any = { ...props };
  
  return <NavLink {...navLinkProps} />;
};
