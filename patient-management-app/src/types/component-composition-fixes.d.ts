// Component composition fixes for TypeScript errors

// Fix for components with subcomponents like Card.Body, List.Item, etc.
declare module '@ltht-react/card' {
  import { FC, HTMLAttributes } from 'react';
  
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  export interface CardBodyProps {
    children?: React.ReactNode;
  }
  
  export interface CardHeaderProps {
    children?: React.ReactNode;
  }
  
  export interface CardFooterProps {
    children?: React.ReactNode;
  }
  
  interface CardComposition {
    Body: FC<CardBodyProps>;
    Header: FC<CardHeaderProps>;
    Footer: FC<CardFooterProps>;
  }
  
  export const Card: FC<CardProps> & CardComposition;
  export default Card;
}

declare module '@ltht-react/list' {
  import { FC } from 'react';
  
  export interface ListProps {
    children?: React.ReactNode;
  }
  
  export interface ListItemProps {
    children?: React.ReactNode;
  }
  
  export interface ListHeaderProps {
    children?: React.ReactNode;
  }
  
  interface ListComposition {
    Item: FC<ListItemProps>;
    Header: FC<ListHeaderProps>;
  }
  
  export const List: FC<ListProps> & ListComposition;
  export default List;
}

declare module '@ltht-react/table' {
  import { FC } from 'react';
  
  export interface TableProps {
    children?: React.ReactNode;
  }
  
  export interface TableHeaderProps {
    children?: React.ReactNode;
  }
  
  export interface TableBodyProps {
    children?: React.ReactNode;
  }
  
  export interface TableRowProps {
    children?: React.ReactNode;
  }
  
  export interface TableCellProps {
    children?: React.ReactNode;
  }
  
  export interface TableFooterProps {
    children?: React.ReactNode;
  }
  
  interface TableComposition {
    Header: FC<TableHeaderProps>;
    Body: FC<TableBodyProps>;
    Row: FC<TableRowProps>;
    Cell: FC<TableCellProps>;
    Footer: FC<TableFooterProps>;
  }
  
  export const Table: FC<TableProps> & TableComposition;
  export default Table;
}

declare module '@ltht-react/form' {
  import { FC, FormHTMLAttributes, LabelHTMLAttributes } from 'react';
  
  export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  }
  
  export interface FormGroupProps {
    children?: React.ReactNode;
  }
  
  export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children?: React.ReactNode;
  }
  
  export interface FormControlProps {
    children?: React.ReactNode;
  }
  
  export interface FormFeedbackProps {
    children?: React.ReactNode;
    type?: 'valid' | 'invalid';
  }
  
  interface FormComposition {
    Group: FC<FormGroupProps>;
    Label: FC<FormLabelProps>;
    Control: FC<FormControlProps>;
    Feedback: FC<FormFeedbackProps>;
  }
  
  export const Form: FC<FormProps> & FormComposition;
  export default Form;
}

declare module '@ltht-react/description-list' {
  import { FC } from 'react';
  
  export interface DescriptionListProps {
    children?: React.ReactNode;
  }
  
  export interface DescriptionListItemProps {
    term: string;
    children?: React.ReactNode;
  }
  
  interface DescriptionListComposition {
    Item: FC<DescriptionListItemProps>;
  }
  
  export const DescriptionList: FC<DescriptionListProps> & DescriptionListComposition;
  export default DescriptionList;
}

// Fix for button variants
declare module '@ltht-react/button' {
  import { FC, ButtonHTMLAttributes } from 'react';
  
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'success' | 'danger';
    isCompact?: boolean;
    children?: React.ReactNode;
  }
  
  export const Button: FC<ButtonProps>;
  export default Button;
}

// Fix for patient banner
declare module '@ltht-react/patient-banner' {
  import { FC } from 'react';
  
  export interface PatientBannerProps {
    patient: {
      fullName?: string;
      gender?: string;
      nhsNumber?: string;
      dateOfBirth?: Date | string;
      gpDetails?: any;
      [key: string]: any;
    };
  }
  
  export const PatientBanner: FC<PatientBannerProps>;
  export default PatientBanner;
}

// Fix for medication components
declare module '@ltht-react/medication-detail' {
  import { FC } from 'react';
  
  export interface MedicationDetailProps {
    medication: any;
  }
  
  export const MedicationDetail: FC<MedicationDetailProps>;
  export default MedicationDetail;
}

declare module '@ltht-react/medication-summary' {
  import { FC } from 'react';
  
  export interface MedicationSummaryProps {
    medication: any;
  }
  
  export const MedicationSummary: FC<MedicationSummaryProps>;
  export default MedicationSummary;
}

// Fix for appointment components
declare module '@ltht-react/appointment-detail' {
  import { FC } from 'react';
  
  export interface AppointmentDetailProps {
    appointment: any;
  }
  
  export const AppointmentDetail: FC<AppointmentDetailProps>;
  export default AppointmentDetail;
}

declare module '@ltht-react/appointment-summary' {
  import { FC } from 'react';
  
  export interface AppointmentSummaryProps {
    appointment: any;
  }
  
  export const AppointmentSummary: FC<AppointmentSummaryProps>;
  export default AppointmentSummary;
}
