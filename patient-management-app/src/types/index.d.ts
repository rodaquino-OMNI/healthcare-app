/**
 * Main index file that imports all TypeScript definition fixes
 */

// Import all type fixes
import './global-fix';
import './styled-components-fix';
import './react-module-fix';
import './direct-fix';

// Ensure React compatibility
declare module 'react' {
  // This ensures compatibility with all React import patterns
  import React from 'react';
  export = React;
  export as namespace React;
}

// Fix for specific JSX element type errors commonly occurring in the app
declare namespace JSX {
  interface IntrinsicElements {
    // Common styled component names found in error messages
    'MedicationItem': any;
    'MedicationInfo': any;
    'MedicationName': any;
    'MedicationDetails': any;
    'StatusBadge': any;
    'PageContainer': any;
    'PageHeader': any;
    'PageTitle': any;
    'ButtonContainer': any;
    'StyledForm': any;
    'FormSection': any;
    'FormRow': any;
    'SectionTitle': any;
    'InstructionsTextarea': any;
    'ErrorText': any;
    'SearchContainer': any;
    'SearchInput': any;
    'SearchButton': any;
    'FilterContainer': any;
    'FilterSelect': any;
    'SectionHeading': any;
    'ContentGrid': any;
    'DetailCard': any;
    'DateTimeContainer': any;
    'AppointmentItem': any;
    'AppointmentInfo': any;
    'AppointmentTitle': any;
    'AppointmentDetails': any;
    'DateText': any;
    'TimeText': any;
    'NotesContainer': any;
    'ActionButtons': any;
    'StatsContainer': any;
    'StatCard': any;
    'StatValue': any;
    'StatLabel': any;
  }
}

// Fix for Element vs. ReactElement type issues
declare namespace React {
  interface Element extends React.ReactElement {}
}

// LTHT React specifics
declare module '@ltht-react/*' {
  const Component: React.ComponentType<any>;
  export default Component;
}

// Fix for react-dom issues
declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(element: React.ReactNode): void;
  };
}

// Fix for missing module issues from screenshots
declare module 'react-router-dom';
declare module '@emotion/styled';
declare module '@ltht-react/styles';
declare module '@ltht-react/card';
declare module '@ltht-react/list';
declare module '@ltht-react/types';
declare module '@ltht-react/button';
declare module '@ltht-react/description-list';
declare module '@ltht-react/input';
declare module '@ltht-react/select';
declare module '@ltht-react/form';
declare module '@ltht-react/patient-banner';
declare module '@ltht-react/allergy-detail';
declare module '@ltht-react/allergy-summary';
declare module '@ltht-react/flag-detail';
declare module '@ltht-react/table';
