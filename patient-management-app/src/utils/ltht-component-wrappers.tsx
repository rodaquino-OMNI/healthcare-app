import React from 'react';

// Import LTHT component types from our module declaration
import ButtonOriginal from '@ltht-react/button';
import CardOriginal from '@ltht-react/card';
import DescriptionListOriginal from '@ltht-react/description-list';
import InputOriginal from '@ltht-react/input';
import SelectOriginal from '@ltht-react/select';
import { Form as FormOriginal } from '@ltht-react/form';
import { List as ListOriginal } from '@ltht-react/list';
import PatientBannerOriginal from '@ltht-react/patient-banner';
import AllergyDetailOriginal from '@ltht-react/allergy-detail';
import AllergyCardOriginal from '@ltht-react/allergy-summary';
import FlagDetailOriginal from '@ltht-react/flag-detail';
import TableOriginal from '@ltht-react/table';

/**
 * Button Component
 * Extends supported variants to include 'success', 'danger', and 'link'
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'link';
  isCompact?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = (props) => {
  // Use React.createElement with type assertion to bypass TypeScript errors
  return React.createElement(ButtonOriginal as any, props);
};

/**
 * Card Component
 * Adds support for Card.Body subcomponent
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface CardBodyProps {
  children?: React.ReactNode;
}

// Create Card component with Body subcomponent using Object.assign
export const Card = Object.assign(
  (props: CardProps) => {
    return React.createElement(CardOriginal as any, props);
  },
  {
    Body: (props: CardBodyProps) => React.createElement((CardOriginal as any).Body, props)
  }
);

/**
 * DescriptionList Component
 * Adds support for Item subcomponent
 */
export interface DescriptionListProps {
  children?: React.ReactNode;
}

export interface DescriptionListItemProps {
  term: string;
  children?: React.ReactNode;
}

export const DescriptionList = Object.assign(
  (props: DescriptionListProps) => {
    return React.createElement(DescriptionListOriginal as any, props);
  },
  {
    Item: (props: DescriptionListItemProps) => {
      return React.createElement((DescriptionListOriginal as any).Item, props);
    }
  }
);

/**
 * Input Component
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = (props) => {
  return React.createElement(InputOriginal as any, props);
};

/**
 * Select Component
 * Adds support for options prop and handles required props
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = (props) => {
  const { options, children, ...rest } = props;
  
  // If options are provided, render them as children
  if (options) {
    return React.createElement(
      SelectOriginal as any,
      rest,
      options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))
    );
  }
  
  // Otherwise, pass children directly
  return React.createElement(SelectOriginal as any, rest, children);
};

/**
 * Form Component
 * Adds support for Form.Group and Form.Label subcomponents
 * Handles submitHandler required prop
 */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  submitHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
}

export interface FormGroupProps {
  children?: React.ReactNode;
}

export interface FormLabelProps {
  htmlFor?: string;
  children?: React.ReactNode;
}

// Create Form component with Group and Label subcomponents
export const Form = Object.assign(
  (props: FormProps) => {
    const { onSubmit, submitHandler, children, ...rest } = props;
    
    // Create a composite handler or use the provided one
    const handleSubmit = submitHandler || onSubmit || ((e: React.FormEvent<HTMLFormElement>) => {});
    
    return React.createElement(
      FormOriginal as any, 
      { ...rest, submitHandler: handleSubmit },
      children
    );
  },
  {
    Group: (props: FormGroupProps) => {
      return React.createElement((FormOriginal as any).Group, props);
    },
    Label: (props: FormLabelProps) => {
      return React.createElement((FormOriginal as any).Label, props);
    }
  }
);

/**
 * List Component
 * Adds support for List.Item subcomponent
 */
export interface ListProps {
  children?: React.ReactNode;
}

export interface ListItemProps {
  children?: React.ReactNode;
}

export const List = Object.assign(
  (props: ListProps) => {
    return React.createElement(ListOriginal as any, props);
  },
  {
    Item: (props: ListItemProps) => {
      return React.createElement((ListOriginal as any).Item, props);
    }
  }
);

/**
 * PatientBanner Component
 */
export interface PatientBannerProps {
  patient: {
    fullName: string;
    gender?: string;
    nhsNumber?: string;
    dateOfBirth?: Date;
    gpDetails?: any;
  };
}

export const PatientBanner: React.FC<PatientBannerProps> = (props) => {
  return React.createElement(PatientBannerOriginal as any, props);
};

/**
 * AllergyDetail Component
 */
export interface AllergyDetailProps {
  allergy: any;
}

export const AllergyDetail: React.FC<AllergyDetailProps> = (props) => {
  return React.createElement(AllergyDetailOriginal as any, props);
};

/**
 * AllergyCard Component (from allergy-summary)
 */
export interface AllergyCardProps {
  allergy: any;
}

export const AllergyCard: React.FC<AllergyCardProps> = (props) => {
  return React.createElement(AllergyCardOriginal as any, props);
};

/**
 * FlagDetail Component
 */
export interface FlagDetailProps {
  flag: any;
}

export const FlagDetail: React.FC<FlagDetailProps> = (props) => {
  return React.createElement(FlagDetailOriginal as any, props);
};

/**
 * Table Component
 */
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

export const Table = Object.assign(
  (props: TableProps) => {
    return React.createElement(TableOriginal as any, props);
  },
  {
    Header: (props: TableHeaderProps) => {
      return React.createElement((TableOriginal as any).Header, props);
    },
    Body: (props: TableBodyProps) => {
      return React.createElement((TableOriginal as any).Body, props);
    },
    Row: (props: TableRowProps) => {
      return React.createElement((TableOriginal as any).Row, props);
    },
    Cell: (props: TableCellProps) => {
      return React.createElement((TableOriginal as any).Cell, props);
    }
  }
);