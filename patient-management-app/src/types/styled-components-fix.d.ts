/**
 * Fix for styled components JSX element type errors
 */

import { StyledComponent } from '@emotion/styled';

// Define interfaces for styled components props
interface StyledComponentProps {
  className?: string;
  children?: React.ReactNode;
  theme?: any;
  [key: string]: any;
}

// Define common styled components that appear in the error logs
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Layout components
      'PageContainer': StyledComponentProps;
      'PageHeader': StyledComponentProps;
      'PageTitle': StyledComponentProps;
      'ButtonContainer': StyledComponentProps;
      'ContentGrid': StyledComponentProps;
      'DetailCard': StyledComponentProps;
      'SectionHeading': StyledComponentProps;
      'ActionButtons': StyledComponentProps;
      
      // Form components
      'StyledForm': StyledComponentProps;
      'FormSection': StyledComponentProps;
      'FormRow': StyledComponentProps;
      'SectionTitle': StyledComponentProps;
      'InstructionsTextarea': StyledComponentProps;
      'ErrorText': StyledComponentProps;
      
      // Status components
      'StatusBadge': StyledComponentProps;
      'StatCard': StyledComponentProps;
      'StatValue': StyledComponentProps;
      'StatLabel': StyledComponentProps;
      
      // Filter components
      'FilterContainer': StyledComponentProps;
      'FilterSelect': StyledComponentProps;
      'SearchContainer': StyledComponentProps;
      'SearchInput': StyledComponentProps;
      'SearchButton': StyledComponentProps;
      
      // Appointment components
      'AppointmentItem': StyledComponentProps;
      'DateTimeContainer': StyledComponentProps;
      'DateText': StyledComponentProps;
      'TimeText': StyledComponentProps;
      'AppointmentInfo': StyledComponentProps;
      'AppointmentTitle': StyledComponentProps;
      'AppointmentDetails': StyledComponentProps;
      
      // Medication components
      'MedicationItem': StyledComponentProps;
      'MedicationInfo': StyledComponentProps;
      'MedicationName': StyledComponentProps;
      'MedicationDetails': StyledComponentProps;
      
      // Other common components
      'SectionHeader': StyledComponentProps;
      'SectionTitle': StyledComponentProps;
      'SectionHeading': StyledComponentProps;
      'NotesContainer': StyledComponentProps;
      'StatsContainer': StyledComponentProps;
      'StyledComponent': StyledComponentProps;
    }
  }
}

// Fix for all emotion styled components
declare module '@emotion/styled' {
  import { ComponentType } from 'react';
  
  export interface StyledComponent<Props = {}, Theme = any> extends ComponentType<Props & { theme?: Theme }> {
    withComponent<NewProps>(component: ComponentType<NewProps>): StyledComponent<NewProps, Theme>;
    withComponent(component: string): StyledComponent<{}, Theme>;
  }
  
  export type CreateStyled = {
    <ComponentProps extends {}, Theme = any>(
      component: ComponentType<ComponentProps>
    ): StyledComponent<ComponentProps, Theme>;
    <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): StyledComponent<JSX.IntrinsicElements[Tag], any>;
    [key: string]: (props: any) => StyledComponent<{}, any>;
  };
  
  const styled: CreateStyled;
  export default styled;
}