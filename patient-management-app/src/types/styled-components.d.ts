// Styled components type declarations
// This file properly defines types for styled components without global declarations

import '@emotion/styled';
import '@emotion/react';
import { Theme } from '@ltht-react/styles';

// Augment the @emotion/styled module
declare module '@emotion/styled' {
  import { ComponentType, PropsWithChildren, ElementType, ComponentProps } from 'react';
  
  export interface StyledOptions {
    label?: string;
    target?: string;
    shouldForwardProp?(propName: string): boolean;
  }
  
  export interface StyledComponent<Props = {}, ExtraProps = {}, Element extends ElementType = 'div'>
    extends ComponentType<PropsWithChildren<Props & ExtraProps & { as?: ElementType }>> {
    withComponent<NewElement extends ElementType>(
      newElement: NewElement
    ): StyledComponent<Props, ExtraProps, NewElement>;
    displayName?: string;
  }
  
  export interface CreateStyled {
    <Element extends ElementType>(element: Element): CreateStyledComponent<Element>;
    <Element extends ElementType, Props>(
      element: Element,
      options: StyledOptions & { target?: string }
    ): CreateStyledComponent<Element, Props>;
  }
  
  export interface CreateStyledComponent<Element extends ElementType, Props = {}> {
    (
      ...styles: Array<any>
    ): StyledComponent<ComponentProps<Element> & Props, {}, Element>;
    
    <ExtraProps>(
      ...styles: Array<any>
    ): StyledComponent<ComponentProps<Element> & Props, ExtraProps, Element>;
  }
  
  const styled: CreateStyled;
  export default styled;
}

// Augment the @emotion/react module
declare module '@emotion/react' {
  import { Theme as EmotionTheme } from '@emotion/react';
  import { Theme as LthtTheme } from '@ltht-react/styles';
  
  export interface Theme extends LthtTheme, EmotionTheme {}
  
  export interface ThemeProviderProps {
    theme: Theme | ((outerTheme: Theme) => Theme);
    children?: React.ReactNode;
  }
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
  
  export function useTheme(): Theme;
  
  export const jsx: any;
  export const css: any;
  export const Global: any;
  export const keyframes: any;
}

// Define types for styled components used in the application
export interface StyledComponentProps {
  theme?: Theme;
  className?: string;
  as?: React.ElementType;
}

// Define utility types for styled components
export type StyledFC<P = {}> = React.FC<P & StyledComponentProps>;

// Define types for specific styled components
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement>, StyledComponentProps {}
export interface ButtonContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface StyledFormProps extends React.FormHTMLAttributes<HTMLFormElement>, StyledComponentProps {}
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement>, StyledComponentProps {}
export interface ErrorTextProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface SearchContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement>, StyledComponentProps {}
export interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledComponentProps {}
export interface FilterContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, StyledComponentProps {}
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, StyledComponentProps {}
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface StatValueProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface StatLabelProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface ItemProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface DateTimeContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface DateTextProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface TimeTextProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface InfoProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface TitleProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface DetailsProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface TimeSlotContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface TimeSlotProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledComponentProps {
  selected: boolean;
}
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement>, StyledComponentProps {}
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, StyledComponentProps {}
export interface NotesContainerProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, StyledComponentProps {
  status: string;
}
export interface ActionButtonsProps extends React.HTMLAttributes<HTMLDivElement>, StyledComponentProps {}
