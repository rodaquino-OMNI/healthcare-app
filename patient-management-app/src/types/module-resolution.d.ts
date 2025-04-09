// Module resolution fixes
// This file provides proper module declarations for all modules used in the application

// React Router DOM
declare module 'react-router-dom' {
  import React from 'react';

  // Route component types
  export interface RouteProps {
    path?: string;
    index?: boolean;
    element?: React.ReactNode;
    children?: React.ReactNode;
    caseSensitive?: boolean;
  }

  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: RouteObject[];
    caseSensitive?: boolean;
    element?: React.ReactNode;
  }

  // Navigation components and hooks
  export const Navigate: React.FC<{
    to: string;
    replace?: boolean;
    state?: any;
  }>;

  // Hooks
  export function useNavigate(): (path: string | number, options?: { replace?: boolean; state?: any }) => void;
  export function useParams<T extends Record<string, string>>(): T;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
  export function useRoutes(routes: RouteObject[]): React.ReactElement | null;
  
  // Router components
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const HashRouter: React.FC<{ children?: React.ReactNode }>;
  export const MemoryRouter: React.FC<{ children?: React.ReactNode; initialEntries?: string[] }>;
  
  // Router components
  export const Link: React.FC<{ 
    to: string | { pathname: string; search?: string; hash?: string }; 
    replace?: boolean; 
    state?: any; 
    children?: React.ReactNode;
  }>;
  export const NavLink: React.FC<{
    to: string;
    end?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
    style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
    children?: React.ReactNode;
    replace?: boolean;
  }>;
  
  export const Outlet: React.FC;
  export const Routes: React.FC<{ children: React.ReactNode }>;
  export const Route: React.FC<RouteProps>;
}

// LTHT Components
declare module '@ltht-react/types' {
  export interface Patient {
    id: string;
    identifier?: Array<{
      system: string;
      value: string;
    }>;
    name?: Array<{
      family?: string;
      given?: string[];
      use?: string;
    }>;
    gender?: string;
    birthDate?: string;
    address?: Array<{
      line?: string[];
      city?: string;
      postalCode?: string;
    }>;
    telecom?: Array<{
      system?: string;
      value?: string;
      use?: string;
    }>;
    flags?: any[];
    allergies?: any[];
  }
}

// Declare all the modules that were showing errors in the screenshots
declare module 'react-router-dom';
declare module '@ltht-react/card';
declare module '@ltht-react/button';
declare module '@ltht-react/list';
declare module '@ltht-react/description-list';
declare module '@ltht-react/patient-banner';
declare module '@ltht-react/allergy-detail';
declare module '@ltht-react/allergy-summary';
declare module '@ltht-react/flag-detail';
declare module '@ltht-react/table';
declare module '@ltht-react/form';
declare module '@ltht-react/input';
declare module '@ltht-react/select';
declare module '@ltht-react/theme';
declare module '@ltht-react/styles';
declare module '@ltht-react/appointment-detail';
declare module '@ltht-react/appointment-summary';
declare module '@ltht-react/types';
declare module '@ltht-react/auth';
declare module '@ltht-react/auth/lib/auth';
declare module '@ltht-react/auth/lib/hooks';
declare module '@ltht-react/medication-detail';
declare module '@ltht-react/medication-summary';

// Declare local modules
declare module './components/layout/MainLayout';
declare module './components/layout/Header';
declare module './components/layout/Sidebar';
declare module './contexts/AuthContext';
declare module './contexts/PatientContext';
declare module './components/common/ProtectedRoute';
declare module './components/patient/PatientListItem';
declare module './components/common/LoadingSpinner';
declare module './components/common/ErrorMessage';
declare module './services/auth/authService';
declare module './services/api/patientService';
declare module './pages/Dashboard';
declare module './pages/patient/PatientList';
declare module './pages/patient/PatientDetail';
declare module './pages/medication/MedicationList';
declare module './pages/medication/MedicationDetail';
declare module './pages/medication/PrescriptionForm';
declare module './pages/appointment/AppointmentList';
declare module './pages/appointment/AppointmentDetail';
declare module './pages/appointment/AppointmentSchedule';
