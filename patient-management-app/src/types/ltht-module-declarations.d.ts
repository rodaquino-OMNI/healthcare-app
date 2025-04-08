// Module declarations for LTHT React components
// This file provides TypeScript declarations for all components from the LTHT library

declare module '@ltht-react/card' {
  import { FC, HTMLAttributes } from 'react';
  
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {}
  export interface CardBodyProps {
    children?: React.ReactNode;
  }
  
  interface CardComposition {
    Body: FC<CardBodyProps>;
  }
  
  export const Card: FC<CardProps> & CardComposition;
  export default Card;
}

declare module '@ltht-react/button' {
  import { FC, ButtonHTMLAttributes } from 'react';
  
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'success' | 'danger';
    isCompact?: boolean;
  }
  
  export const Button: FC<ButtonProps>;
  export default Button;
}

declare module '@ltht-react/list' {
  import { FC } from 'react';
  
  export interface ListProps {
    children?: React.ReactNode;
  }
  
  export interface ListItemProps {
    children?: React.ReactNode;
  }
  
  interface ListComposition {
    Item: FC<ListItemProps>;
  }
  
  export const List: FC<ListProps> & ListComposition;
  export default List;
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

declare module '@ltht-react/patient-banner' {
  import { FC } from 'react';
  
  export interface PatientBannerProps {
    patient: {
      fullName?: string;
      gender?: string;
      nhsNumber?: string;
      dateOfBirth?: Date;
      gpDetails?: any;
    };
  }
  
  export const PatientBanner: FC<PatientBannerProps>;
  export default PatientBanner;
}

declare module '@ltht-react/allergy-detail' {
  import { FC } from 'react';
  
  export interface AllergyDetailProps {
    allergy: any;
  }
  
  export const AllergyDetail: FC<AllergyDetailProps>;
  export default AllergyDetail;
}

declare module '@ltht-react/allergy-summary' {
  import { FC } from 'react';
  
  export interface AllergyCardProps {
    allergy: any;
  }
  
  export const AllergyCard: FC<AllergyCardProps>;
  export default AllergyCard;
}

declare module '@ltht-react/flag-detail' {
  import { FC } from 'react';
  
  export interface FlagDetailProps {
    flag: any;
  }
  
  export const FlagDetail: FC<FlagDetailProps>;
  export default FlagDetail;
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
  
  interface TableComposition {
    Header: FC<TableHeaderProps>;
    Body: FC<TableBodyProps>;
    Row: FC<TableRowProps>;
    Cell: FC<TableCellProps>;
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
  
  interface FormComposition {
    Group: FC<FormGroupProps>;
    Label: FC<FormLabelProps>;
  }
  
  export const Form: FC<FormProps> & FormComposition;
  export default Form;
}

declare module '@ltht-react/input' {
  import { FC, InputHTMLAttributes } from 'react';
  
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: FC<InputProps>;
  export default Input;
}

declare module '@ltht-react/select' {
  import { FC, SelectHTMLAttributes } from 'react';
  
  export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}
  
  export const Select: FC<SelectProps>;
  export default Select;
}

// Theme-related components
declare module '@ltht-react/theme' {
  export interface Theme {
    colors: {
      [key: string]: string;
    };
  }
}

// Add missing modules from the errors in the screenshot
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

declare module '@ltht-react/styles';
declare module '@ltht-react/appointment-detail';
declare module '@ltht-react/appointment-summary';
declare module '@ltht-react/types';
declare module '@ltht-react/auth';
declare module '@ltht-react/auth/lib/auth';
declare module '@ltht-react/auth/lib/hooks';