import React from 'react';
import { Outlet } from 'react-router-dom';

interface CustomOutletProps {
  context?: any;
}

/**
 * CustomOutlet component that wraps the Outlet component from react-router-dom
 * This is a workaround for TypeScript errors with the Outlet component
 */
export const CustomOutlet: React.FC<CustomOutletProps> = ({ context }) => {
  // Use type assertion to avoid TypeScript errors
  const outletProps: any = {};
  
  if (context !== undefined) {
    outletProps.context = context;
  }
  
  return <Outlet {...outletProps} />;
};
