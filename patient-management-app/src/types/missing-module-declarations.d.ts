// Additional module declarations to fix the errors shown in the screenshots

// React Router DOM components
declare module 'react-router-dom' {
  // Add any missing exports from the existing declarations
  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: RouteObject[];
    caseSensitive?: boolean;
    element?: React.ReactNode;
  }
}

// LTHT Components missing from the current declarations
declare module '@ltht-react/styles' {
  export interface Theme {
    colors: {
      background: {
        base: string;
        secondary: string;
        accent: string;
        [key: string]: string;
      };
      text: {
        primary: string;
        secondary: string;
        accent: string;
        [key: string]: string;
      };
      border: {
        primary: string;
        secondary: string;
        [key: string]: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
        [key: string]: string;
      };
      [key: string]: any;
    };
    spacing: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      xxl: string;
      [key: string]: string;
    };
    typography: {
      fontSize: {
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
        [key: string]: string;
      };
      fontWeight: {
        normal: number;
        bold: number;
        [key: string]: number;
      };
      [key: string]: any;
    };
    [key: string]: any;
  }
}

// Missing LTHT component modules from the screenshots
declare module '@ltht-react/types' {
  // Already defined in existing files, but adding here for completeness
}

declare module '@ltht-react/auth' {
  export interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    error?: string;
  }
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }>;
  export const useAuth: () => AuthContextType;
}

declare module '@ltht-react/auth/lib/auth' {
  export interface AuthConfig {
    authEndpoint: string;
    clientId: string;
    redirectUri: string;
    scope: string;
  }
  
  export function initAuth(config: AuthConfig): void;
  export function isAuthenticated(): boolean;
  export function getUser(): any;
  export function login(): Promise<void>;
  export function logout(): void;
}

declare module '@ltht-react/auth/lib/hooks' {
  export function useAuth(): {
    isAuthenticated: boolean;
    user: any;
    login: () => Promise<void>;
    logout: () => void;
  };
}

// Missing page and component modules
declare module './pages/Dashboard' {
  const Dashboard: React.FC;
  export default Dashboard;
}

declare module './pages/patient/PatientList' {
  const PatientList: React.FC;
  export default PatientList;
}

declare module './pages/patient/PatientDetail' {
  const PatientDetail: React.FC<{ id: string }>;
  export default PatientDetail;
}

declare module './pages/medication/MedicationList' {
  const MedicationList: React.FC;
  export default MedicationList;
}

declare module './pages/medication/MedicationDetail' {
  const MedicationDetail: React.FC<{ id: string }>;
  export default MedicationDetail;
}

declare module './pages/medication/PrescriptionForm' {
  const PrescriptionForm: React.FC<{ patientId: string }>;
  export default PrescriptionForm;
}

declare module './pages/appointment/AppointmentList' {
  const AppointmentList: React.FC;
  export default AppointmentList;
}

declare module './pages/appointment/AppointmentDetail' {
  const AppointmentDetail: React.FC<{ id: string }>;
  export default AppointmentDetail;
}

declare module './pages/appointment/AppointmentSchedule' {
  const AppointmentSchedule: React.FC;
  export default AppointmentSchedule;
}

// Layout components
declare module './components/layout/MainLayout' {
  const MainLayout: React.FC<{ children: React.ReactNode }>;
  export default MainLayout;
}

declare module './components/layout/Header' {
  const Header: React.FC;
  export default Header;
}

declare module './components/layout/Sidebar' {
  const Sidebar: React.FC;
  export default Sidebar;
}

// Context providers
declare module './contexts/AuthContext' {
  export interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    error?: string;
  }
  
  export const AuthContext: React.Context<AuthContextType>;
  export const AuthProvider: React.FC<{ children: React.ReactNode }>;
  export const useAuth: () => AuthContextType;
  
  export default AuthContext;
}

declare module './contexts/PatientContext' {
  export interface PatientContextType {
    patients: any[];
    loading: boolean;
    error: string | null;
    fetchPatients: () => Promise<void>;
    getPatient: (id: string) => any;
  }
  
  export const PatientContext: React.Context<PatientContextType>;
  export const PatientProvider: React.FC<{ children: React.ReactNode }>;
  export const usePatients: () => PatientContextType;
  
  export default PatientContext;
}

// Common components
declare module './components/common/ProtectedRoute' {
  const ProtectedRoute: React.FC<{ children: React.ReactNode }>;
  export default ProtectedRoute;
}

declare module './components/patient/PatientListItem' {
  const PatientListItem: React.FC<{ patient: any }>;
  export default PatientListItem;
}

declare module './components/common/LoadingSpinner' {
  const LoadingSpinner: React.FC;
  export default LoadingSpinner;
}

declare module './components/common/ErrorMessage' {
  const ErrorMessage: React.FC<{ message: string }>;
  export default ErrorMessage;
}

// Services
declare module './services/auth/authService' {
  export function login(credentials: { username: string; password: string }): Promise<any>;
  export function logout(): void;
  export function getCurrentUser(): any;
  export function isAuthenticated(): boolean;
}

declare module './services/api/patientService' {
  export function getPatients(): Promise<any[]>;
  export function getPatient(id: string): Promise<any>;
  export function createPatient(patient: any): Promise<any>;
  export function updatePatient(id: string, patient: any): Promise<any>;
  export function deletePatient(id: string): Promise<void>;
}
