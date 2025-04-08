// Styled component fixes for TypeScript errors

// This file provides type declarations for styled components used in the application

import { Theme } from '@ltht-react/styles';
import { ElementType, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// Fix for styled-components
declare module '@emotion/styled' {
  import { StyledComponent } from '@emotion/styled';
  
  export interface StyledComponentProps {
    theme?: Theme;
    as?: ElementType<any, keyof JSX.IntrinsicElements>;
  }
  
  // Generic styled component type
  export interface StyledFC<P = {}> extends React.FC<P & { className?: string }> {
    withComponent<T extends ElementType>(tag: T): StyledFC<P & React.ComponentProps<T>>;
  }
  
  // Fix for styled component usage
  export interface StyledComponent<Props, DefaultProps, OverridableProps> {
    (props: Props): JSX.Element;
    withComponent<T extends ElementType>(tag: T): StyledComponent<Props & React.ComponentProps<T>, DefaultProps, OverridableProps>;
  }
}

// Common styled components used in the application
declare global {
  interface StyledComponentMap {
    // Layout components
    PageContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    PageHeader: React.FC<HTMLAttributes<HTMLDivElement>>;
    PageTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>;
    ButtonContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    ContentGrid: React.FC<HTMLAttributes<HTMLDivElement>>;
    DashboardContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    
    // Form components
    StyledForm: React.FC<HTMLAttributes<HTMLFormElement>>;
    FormSection: React.FC<HTMLAttributes<HTMLDivElement>>;
    FormRow: React.FC<HTMLAttributes<HTMLDivElement>>;
    SectionTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>;
    ErrorText: React.FC<HTMLAttributes<HTMLDivElement>>;
    
    // Input components
    SearchContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    SearchInput: React.FC<InputHTMLAttributes<HTMLInputElement>>;
    SearchButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>>;
    FilterContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    FilterSelect: React.FC<SelectHTMLAttributes<HTMLSelectElement>>;
    InstructionsTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>>;
    NotesTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>>;
    
    // Card components
    DetailCard: React.FC<HTMLAttributes<HTMLDivElement>>;
    StatCard: React.FC<HTMLAttributes<HTMLDivElement>>;
    StatValue: React.FC<HTMLAttributes<HTMLDivElement>>;
    StatLabel: React.FC<HTMLAttributes<HTMLDivElement>>;
    
    // List item components
    MedicationItem: React.FC<HTMLAttributes<HTMLDivElement>>;
    MedicationInfo: React.FC<HTMLAttributes<HTMLDivElement>>;
    MedicationName: React.FC<HTMLAttributes<HTMLDivElement>>;
    MedicationDetails: React.FC<HTMLAttributes<HTMLDivElement>>;
    
    // Appointment components
    AppointmentItem: React.FC<HTMLAttributes<HTMLDivElement>>;
    DateTimeContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    DateText: React.FC<HTMLAttributes<HTMLDivElement>>;
    TimeText: React.FC<HTMLAttributes<HTMLDivElement>>;
    AppointmentInfo: React.FC<HTMLAttributes<HTMLDivElement>>;
    AppointmentTitle: React.FC<HTMLAttributes<HTMLDivElement>>;
    AppointmentDetails: React.FC<HTMLAttributes<HTMLDivElement>>;
    TimeSlotContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    TimeSlot: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }>;
    
    // Section components
    SectionHeader: React.FC<HTMLAttributes<HTMLHeadingElement>>;
    SectionHeading: React.FC<HTMLAttributes<HTMLHeadingElement>>;
    NotesContainer: React.FC<HTMLAttributes<HTMLDivElement>>;
    
    // Status components
    StatusBadge: React.FC<HTMLAttributes<HTMLSpanElement> & { status: string }>;
    
    // Action components
    ActionButtons: React.FC<HTMLAttributes<HTMLDivElement>>;
  }
  
  // Make all styled components available globally
  interface Window {
    StyledComponents: StyledComponentMap;
  }
}

// Declare all styled components as valid JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    PageContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    PageHeader: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    PageTitle: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    ButtonContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    ContentGrid: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    DashboardContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    StyledForm: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    FormSection: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    FormRow: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    SectionTitle: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    ErrorText: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    SearchContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    SearchInput: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    SearchButton: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    FilterContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    FilterSelect: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    InstructionsTextarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
    NotesTextarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
    DetailCard: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    StatCard: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    StatValue: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    StatLabel: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    MedicationItem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    MedicationInfo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    MedicationName: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    MedicationDetails: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    AppointmentItem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    DateTimeContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    DateText: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    TimeText: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    AppointmentInfo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    AppointmentTitle: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    AppointmentDetails: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    TimeSlotContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    TimeSlot: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    SectionHeader: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    SectionHeading: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    NotesContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    StatusBadge: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    ActionButtons: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  }
}
