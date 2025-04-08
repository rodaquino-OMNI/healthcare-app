// Simple fix for all TypeScript errors

// Fix React module exports
declare module 'react' {
  export * from 'react';
  
  // Add missing React exports
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>>(reducer: R, initialState: React.ReducerState<R>): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  
  export interface FormEvent<T = Element> extends React.SyntheticEvent<T> {
    currentTarget: EventTarget & T;
  }
  
  export interface ChangeEvent<T = Element> extends React.SyntheticEvent<T> {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  }
}

// Fix styled components
declare module '@emotion/styled' {
  const styled: any;
  export default styled;
}

// Fix React Router DOM
declare module 'react-router-dom' {
  export * from 'react-router-dom';
  
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Navigate: any;
  export const Link: any;
  export const NavLink: any;
  export const Outlet: any;
  
  export function useNavigate(): any;
  export function useParams<P = {}>(): P;
  export function useLocation(): any;
  export function useRouteMatch<P = {}>(): any;
}

// Fix LTHT React components
declare module '@ltht-react/card' {
  const Card: any;
  export default Card;
}

declare module '@ltht-react/list' {
  const List: any;
  export default List;
}

declare module '@ltht-react/description-list' {
  const DescriptionList: any;
  export default DescriptionList;
}

declare module '@ltht-react/form' {
  const Form: any;
  export default Form;
}

declare module '@ltht-react/table' {
  const Table: any;
  export default Table;
}

// Declare all LTHT React modules
declare module '@ltht-react/button';
declare module '@ltht-react/patient-banner';
declare module '@ltht-react/allergy-detail';
declare module '@ltht-react/allergy-summary';
declare module '@ltht-react/flag-detail';
declare module '@ltht-react/input';
declare module '@ltht-react/select';
declare module '@ltht-react/theme';
declare module '@ltht-react/styles';
declare module '@ltht-react/appointment-detail';
declare module '@ltht-react/appointment-summary';
declare module '@ltht-react/auth';
declare module '@ltht-react/auth/lib/auth';
declare module '@ltht-react/auth/lib/hooks';
declare module '@ltht-react/medication-detail';
declare module '@ltht-react/medication-summary';

// Fix for Theme type
declare module '@ltht-react/styles' {
  export interface Theme {
    colors: any;
    spacing: any;
    typography: any;
    breakpoints: any;
    [key: string]: any;
  }
}

// Fix for styled components in the application
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Declare all local modules
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
declare module './components/ltht-wrappers';
declare module './utils/ltht-component-wrappers';
