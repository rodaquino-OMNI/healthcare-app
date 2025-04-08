// External module declarations to fix missing type errors

// React Router DOM (v6)
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

  // Navigation components and hooks
  export const Navigate: React.FC<{
    to: string;
    replace?: boolean;
    state?: any;
  }>;

  // Hooks
  export const useNavigate: () => (path: string | number, options?: { replace?: boolean; state?: any }) => void;
  export const useParams: <T extends Record<string, string>>() => T;
  export const useLocation: () => {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
  export const useRoutes: (routes: any[]) => React.ReactElement | null;
  
  // Router components
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const HashRouter: React.FC<{ children?: React.ReactNode }>;
  export const MemoryRouter: React.FC<{ children?: React.ReactNode; initialEntries?: string[] }>;
  
  // Router components
  export const Link: React.FC<{ to: string | { pathname: string; search?: string; hash?: string }; replace?: boolean; state?: any; children?: React.ReactNode }>;
  export const NavLink: React.FC<{
    to: string;
    end?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
    style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
    children: React.ReactNode;
    replace?: boolean;
  }>;
  
  export const Outlet: React.FC;
  export const Routes: React.FC<{ children: React.ReactNode }>;
  export const Route: React.FC<RouteProps>;
}

// Emotion styled
declare module '@emotion/styled' {
  import { CreateStyled } from '@emotion/styled/types';
  const styled: CreateStyled;
  export default styled;
}

// LTHT Styles
declare module '@ltht-react/styles' {
  export interface Theme {
    colors: {
      background: {
        base: string;
        [key: string]: string;
      };
      [key: string]: any;
    };
  }
  export function getTheme(options?: any): Theme;
}

// Make TS accept any import path
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.module.css';

// Add LTHT types declaration
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

// Allow import of local files without declarations
declare module './App';
declare module './contexts/AuthContext';
declare module './contexts/PatientContext';
declare module './components/common/ProtectedRoute';
declare module './components/layout/MainLayout';
declare module './pages/Dashboard';
declare module './pages/patient/PatientList';
declare module './pages/patient/PatientDetail';
declare module './pages/medication/MedicationList';
declare module './pages/medication/MedicationDetail';
declare module './pages/medication/PrescriptionForm';
declare module './pages/appointment/AppointmentList';
declare module './pages/appointment/AppointmentDetail';
declare module './pages/appointment/AppointmentSchedule';
declare module '../services/auth/authService';
declare module '../services/api/patientService';
declare module './Header';
declare module './Sidebar';
declare module '../components/patient/PatientListItem';
declare module '../components/common/LoadingSpinner';
declare module '../components/common/ErrorMessage';