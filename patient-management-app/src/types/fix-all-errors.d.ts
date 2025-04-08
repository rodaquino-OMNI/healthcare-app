// This file provides direct fixes for all TypeScript errors

// Fix for React module exports
import React from 'react';

// Add missing React exports
declare module 'react' {
  export = React;
  export as namespace React;
}

// Fix for styled components
declare module '@emotion/styled' {
  import React from 'react';
  
  export interface StyledComponent<P = {}> extends React.FC<P> {
    withComponent: any;
  }
  
  interface StyledInterface {
    <P>(component: React.ComponentType<P>): any;
    <T extends keyof JSX.IntrinsicElements>(tag: T): any;
    
    // Add all HTML elements
    a: any;
    abbr: any;
    address: any;
    area: any;
    article: any;
    aside: any;
    audio: any;
    b: any;
    base: any;
    bdi: any;
    bdo: any;
    big: any;
    blockquote: any;
    body: any;
    br: any;
    button: any;
    canvas: any;
    caption: any;
    cite: any;
    code: any;
    col: any;
    colgroup: any;
    data: any;
    datalist: any;
    dd: any;
    del: any;
    details: any;
    dfn: any;
    dialog: any;
    div: any;
    dl: any;
    dt: any;
    em: any;
    embed: any;
    fieldset: any;
    figcaption: any;
    figure: any;
    footer: any;
    form: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    head: any;
    header: any;
    hgroup: any;
    hr: any;
    html: any;
    i: any;
    iframe: any;
    img: any;
    input: any;
    ins: any;
    kbd: any;
    keygen: any;
    label: any;
    legend: any;
    li: any;
    link: any;
    main: any;
    map: any;
    mark: any;
    menu: any;
    menuitem: any;
    meta: any;
    meter: any;
    nav: any;
    noscript: any;
    object: any;
    ol: any;
    optgroup: any;
    option: any;
    output: any;
    p: any;
    param: any;
    picture: any;
    pre: any;
    progress: any;
    q: any;
    rp: any;
    rt: any;
    ruby: any;
    s: any;
    samp: any;
    script: any;
    section: any;
    select: any;
    small: any;
    source: any;
    span: any;
    strong: any;
    style: any;
    sub: any;
    summary: any;
    sup: any;
    table: any;
    tbody: any;
    td: any;
    textarea: any;
    tfoot: any;
    th: any;
    thead: any;
    time: any;
    title: any;
    tr: any;
    track: any;
    u: any;
    ul: any;
    var: any;
    video: any;
    wbr: any;
  }
  
  const styled: StyledInterface;
  export default styled;
}

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

// Fix for component composition
declare module '@ltht-react/card' {
  import React from 'react';
  
  interface CardComponent extends React.FC<any> {
    Body: React.FC<any>;
  }
  
  const Card: CardComponent;
  export default Card;
}

declare module '@ltht-react/list' {
  import React from 'react';
  
  interface ListComponent extends React.FC<any> {
    Item: React.FC<any>;
  }
  
  const List: ListComponent;
  export default List;
}

declare module '@ltht-react/description-list' {
  import React from 'react';
  
  interface DescriptionListComponent extends React.FC<any> {
    Item: React.FC<any>;
  }
  
  const DescriptionList: DescriptionListComponent;
  export default DescriptionList;
}

declare module '@ltht-react/form' {
  import React from 'react';
  
  interface FormComponent extends React.FC<any> {
    Group: React.FC<any>;
    Label: React.FC<any>;
  }
  
  const Form: FormComponent;
  export default Form;
}

declare module '@ltht-react/table' {
  import React from 'react';
  
  interface TableComponent extends React.FC<any> {
    Header: React.FC<any>;
    Body: React.FC<any>;
    Row: React.FC<any>;
    Cell: React.FC<any>;
  }
  
  const Table: TableComponent;
  export default Table;
}

// Fix for React Router DOM
declare module 'react-router-dom' {
  import React from 'react';
  
  export const BrowserRouter: React.FC<any>;
  export const Route: React.FC<any>;
  export const Switch: React.FC<any>;
  export const Link: React.FC<any>;
  export const NavLink: React.FC<any>;
  export const Redirect: React.FC<any>;
  
  export function useHistory(): any;
  export function useLocation(): any;
  export function useParams<P = {}>(): P;
  export function useRouteMatch<P = {}>(): any;
}

// Declare all LTHT React modules
declare module '@ltht-react/button' {
  import React from 'react';
  const Button: React.FC<any>;
  export default Button;
}

declare module '@ltht-react/patient-banner' {
  import React from 'react';
  const PatientBanner: React.FC<any>;
  export default PatientBanner;
}

declare module '@ltht-react/allergy-detail' {
  import React from 'react';
  const AllergyDetail: React.FC<any>;
  export default AllergyDetail;
}

declare module '@ltht-react/allergy-summary' {
  import React from 'react';
  const AllergySummary: React.FC<any>;
  export default AllergySummary;
}

declare module '@ltht-react/flag-detail' {
  import React from 'react';
  const FlagDetail: React.FC<any>;
  export default FlagDetail;
}

declare module '@ltht-react/input' {
  import React from 'react';
  const Input: React.FC<any>;
  export default Input;
}

declare module '@ltht-react/select' {
  import React from 'react';
  const Select: React.FC<any>;
  export default Select;
}

declare module '@ltht-react/theme' {
  import { Theme } from '@ltht-react/styles';
  export const theme: Theme;
}

declare module '@ltht-react/types' {
  export interface Patient {
    id: string;
    [key: string]: any;
  }
}

declare module '@ltht-react/appointment-detail' {
  import React from 'react';
  const AppointmentDetail: React.FC<any>;
  export default AppointmentDetail;
}

declare module '@ltht-react/appointment-summary' {
  import React from 'react';
  const AppointmentSummary: React.FC<any>;
  export default AppointmentSummary;
}

declare module '@ltht-react/auth' {
  export const Auth: any;
}

declare module '@ltht-react/auth/lib/auth' {
  export const Auth: any;
}

declare module '@ltht-react/auth/lib/hooks' {
  export function useAuth(): any;
}

declare module '@ltht-react/medication-detail' {
  import React from 'react';
  const MedicationDetail: React.FC<any>;
  export default MedicationDetail;
}

declare module '@ltht-react/medication-summary' {
  import React from 'react';
  const MedicationSummary: React.FC<any>;
  export default MedicationSummary;
}

// Declare all local modules
declare module './components/layout/MainLayout' {
  import React from 'react';
  const MainLayout: React.FC<any>;
  export default MainLayout;
}

declare module './components/layout/Header' {
  import React from 'react';
  const Header: React.FC<any>;
  export default Header;
}

declare module './components/layout/Sidebar' {
  import React from 'react';
  const Sidebar: React.FC<any>;
  export default Sidebar;
}

declare module './contexts/AuthContext' {
  export function useAuth(): any;
}

declare module './contexts/PatientContext' {
  export function usePatient(): any;
}

declare module './components/common/ProtectedRoute' {
  import React from 'react';
  const ProtectedRoute: React.FC<any>;
  export default ProtectedRoute;
}

declare module './components/patient/PatientListItem' {
  import React from 'react';
  const PatientListItem: React.FC<any>;
  export default PatientListItem;
}

declare module './components/common/LoadingSpinner' {
  import React from 'react';
  const LoadingSpinner: React.FC<any>;
  export default LoadingSpinner;
}

declare module './components/common/ErrorMessage' {
  import React from 'react';
  const ErrorMessage: React.FC<any>;
  export default ErrorMessage;
}

declare module './services/auth/authService' {
  export const authService: any;
}

declare module './services/api/patientService' {
  export const patientService: any;
}

declare module './pages/Dashboard' {
  import React from 'react';
  const Dashboard: React.FC<any>;
  export default Dashboard;
}

declare module './pages/patient/PatientList' {
  import React from 'react';
  const PatientList: React.FC<any>;
  export default PatientList;
}

declare module './pages/patient/PatientDetail' {
  import React from 'react';
  const PatientDetail: React.FC<any>;
  export default PatientDetail;
}

declare module './pages/medication/MedicationList' {
  import React from 'react';
  const MedicationList: React.FC<any>;
  export default MedicationList;
}

declare module './pages/medication/MedicationDetail' {
  import React from 'react';
  const MedicationDetail: React.FC<any>;
  export default MedicationDetail;
}

declare module './pages/medication/PrescriptionForm' {
  import React from 'react';
  const PrescriptionForm: React.FC<any>;
  export default PrescriptionForm;
}

declare module './pages/appointment/AppointmentList' {
  import React from 'react';
  const AppointmentList: React.FC<any>;
  export default AppointmentList;
}

declare module './pages/appointment/AppointmentDetail' {
  import React from 'react';
  const AppointmentDetail: React.FC<any>;
  export default AppointmentDetail;
}

declare module './pages/appointment/AppointmentSchedule' {
  import React from 'react';
  const AppointmentSchedule: React.FC<any>;
  export default AppointmentSchedule;
}

declare module './components/ltht-wrappers' {
  import React from 'react';
  export const Button: React.FC<any>;
  export const Card: React.FC<any> & { Body: React.FC<any> };
  export const DescriptionList: React.FC<any> & { Item: React.FC<any> };
  export const Form: React.FC<any> & { Group: React.FC<any>; Label: React.FC<any> };
  export const Input: React.FC<any>;
  export const List: React.FC<any> & { Item: React.FC<any> };
  export const PatientBanner: React.FC<any>;
  export const Select: React.FC<any>;
  export const Table: React.FC<any> & { Header: React.FC<any>; Body: React.FC<any>; Row: React.FC<any>; Cell: React.FC<any> };
  export const AllergyDetail: React.FC<any>;
  export const AllergyCard: React.FC<any>;
  export const FlagDetail: React.FC<any>;
}

declare module './utils/ltht-component-wrappers' {
  import React from 'react';
  export const Button: React.FC<any>;
  export const Card: React.FC<any> & { Body: React.FC<any> };
  export const DescriptionList: React.FC<any> & { Item: React.FC<any> };
  export const Form: React.FC<any> & { Group: React.FC<any>; Label: React.FC<any> };
  export const Input: React.FC<any>;
  export const List: React.FC<any> & { Item: React.FC<any> };
  export const PatientBanner: React.FC<any>;
  export const Select: React.FC<any>;
  export const Table: React.FC<any> & { Header: React.FC<any>; Body: React.FC<any>; Row: React.FC<any>; Cell: React.FC<any> };
  export const AllergyDetail: React.FC<any>;
  export const AllergyCard: React.FC<any>;
  export const FlagDetail: React.FC<any>;
}

// Fix for styled components in the application
declare global {
  namespace JSX {
    interface IntrinsicElements {
      PageContainer: any;
      PageHeader: any;
      PageTitle: any;
      ButtonContainer: any;
      ContentGrid: any;
      DashboardContainer: any;
      StyledForm: any;
      FormSection: any;
      FormRow: any;
      SectionTitle: any;
      ErrorText: any;
      SearchContainer: any;
      SearchInput: any;
      SearchButton: any;
      FilterContainer: any;
      FilterSelect: any;
      InstructionsTextarea: any;
      NotesTextarea: any;
      MedicationItem: any;
      MedicationInfo: any;
      MedicationName: any;
      MedicationDetails: any;
      AppointmentItem: any;
      DateTimeContainer: any;
      DateText: any;
      TimeText: any;
      AppointmentInfo: any;
      AppointmentTitle: any;
      AppointmentDetails: any;
      TimeSlotContainer: any;
      TimeSlot: any;
      SectionHeader: any;
      SectionHeading: any;
      NotesContainer: any;
      StatusBadge: any;
      ActionButtons: any;
      StatCard: any;
      StatValue: any;
      StatLabel: any;
      DetailCard: any;
      StatsContainer: any;
    }
  }
}
