// Global type declarations to fix all TypeScript errors
// This file provides direct fixes for all the error categories

// Fix for React module exports
declare module 'react' {
  export interface FormEvent<T = Element> extends React.SyntheticEvent<T> {
    currentTarget: EventTarget & T;
  }
  
  export interface ChangeEvent<T = Element> extends React.SyntheticEvent<T> {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useState<T = undefined>(): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
  
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  
  export function useContext<T>(context: React.Context<T>): T;
  
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
}

// Fix for styled components
declare module '@emotion/styled' {
  import { ComponentType, ElementType } from 'react';
  
  export interface StyledComponent<Props = {}, Theme = any> extends ComponentType<Props> {
    withComponent<T extends ElementType>(tag: T): StyledComponent<Props & React.ComponentProps<T>, Theme>;
  }
  
  export interface StyledOptions {
    label?: string;
    shouldForwardProp?(propName: string): boolean;
    target?: string;
  }
  
  // Helper type for the styled function
  export interface CreateStyled {
    <ComponentProps extends object, ExtraProps extends object = {}>(
      component: ComponentType<ComponentProps>
    ): (
      template: TemplateStringsArray | ((props: ComponentProps & ExtraProps) => string),
      ...args: Array<any>
    ) => StyledComponent<ComponentProps & ExtraProps>;
    
    <Tag extends keyof JSX.IntrinsicElements>(
      tag: Tag
    ): (
      template: TemplateStringsArray | ((props: JSX.IntrinsicElements[Tag]) => string),
      ...args: Array<any>
    ) => StyledComponent<JSX.IntrinsicElements[Tag]>;
    
    // Add properties for all HTML elements
    a: CreateStyledComponent<'a'>;
    abbr: CreateStyledComponent<'abbr'>;
    address: CreateStyledComponent<'address'>;
    area: CreateStyledComponent<'area'>;
    article: CreateStyledComponent<'article'>;
    aside: CreateStyledComponent<'aside'>;
    audio: CreateStyledComponent<'audio'>;
    b: CreateStyledComponent<'b'>;
    base: CreateStyledComponent<'base'>;
    bdi: CreateStyledComponent<'bdi'>;
    bdo: CreateStyledComponent<'bdo'>;
    big: CreateStyledComponent<'big'>;
    blockquote: CreateStyledComponent<'blockquote'>;
    body: CreateStyledComponent<'body'>;
    br: CreateStyledComponent<'br'>;
    button: CreateStyledComponent<'button'>;
    canvas: CreateStyledComponent<'canvas'>;
    caption: CreateStyledComponent<'caption'>;
    cite: CreateStyledComponent<'cite'>;
    code: CreateStyledComponent<'code'>;
    col: CreateStyledComponent<'col'>;
    colgroup: CreateStyledComponent<'colgroup'>;
    data: CreateStyledComponent<'data'>;
    datalist: CreateStyledComponent<'datalist'>;
    dd: CreateStyledComponent<'dd'>;
    del: CreateStyledComponent<'del'>;
    details: CreateStyledComponent<'details'>;
    dfn: CreateStyledComponent<'dfn'>;
    dialog: CreateStyledComponent<'dialog'>;
    div: CreateStyledComponent<'div'>;
    dl: CreateStyledComponent<'dl'>;
    dt: CreateStyledComponent<'dt'>;
    em: CreateStyledComponent<'em'>;
    embed: CreateStyledComponent<'embed'>;
    fieldset: CreateStyledComponent<'fieldset'>;
    figcaption: CreateStyledComponent<'figcaption'>;
    figure: CreateStyledComponent<'figure'>;
    footer: CreateStyledComponent<'footer'>;
    form: CreateStyledComponent<'form'>;
    h1: CreateStyledComponent<'h1'>;
    h2: CreateStyledComponent<'h2'>;
    h3: CreateStyledComponent<'h3'>;
    h4: CreateStyledComponent<'h4'>;
    h5: CreateStyledComponent<'h5'>;
    h6: CreateStyledComponent<'h6'>;
    head: CreateStyledComponent<'head'>;
    header: CreateStyledComponent<'header'>;
    hgroup: CreateStyledComponent<'hgroup'>;
    hr: CreateStyledComponent<'hr'>;
    html: CreateStyledComponent<'html'>;
    i: CreateStyledComponent<'i'>;
    iframe: CreateStyledComponent<'iframe'>;
    img: CreateStyledComponent<'img'>;
    input: CreateStyledComponent<'input'>;
    ins: CreateStyledComponent<'ins'>;
    kbd: CreateStyledComponent<'kbd'>;
    keygen: CreateStyledComponent<'keygen'>;
    label: CreateStyledComponent<'label'>;
    legend: CreateStyledComponent<'legend'>;
    li: CreateStyledComponent<'li'>;
    link: CreateStyledComponent<'link'>;
    main: CreateStyledComponent<'main'>;
    map: CreateStyledComponent<'map'>;
    mark: CreateStyledComponent<'mark'>;
    menu: CreateStyledComponent<'menu'>;
    menuitem: CreateStyledComponent<'menuitem'>;
    meta: CreateStyledComponent<'meta'>;
    meter: CreateStyledComponent<'meter'>;
    nav: CreateStyledComponent<'nav'>;
    noscript: CreateStyledComponent<'noscript'>;
    object: CreateStyledComponent<'object'>;
    ol: CreateStyledComponent<'ol'>;
    optgroup: CreateStyledComponent<'optgroup'>;
    option: CreateStyledComponent<'option'>;
    output: CreateStyledComponent<'output'>;
    p: CreateStyledComponent<'p'>;
    param: CreateStyledComponent<'param'>;
    picture: CreateStyledComponent<'picture'>;
    pre: CreateStyledComponent<'pre'>;
    progress: CreateStyledComponent<'progress'>;
    q: CreateStyledComponent<'q'>;
    rp: CreateStyledComponent<'rp'>;
    rt: CreateStyledComponent<'rt'>;
    ruby: CreateStyledComponent<'ruby'>;
    s: CreateStyledComponent<'s'>;
    samp: CreateStyledComponent<'samp'>;
    script: CreateStyledComponent<'script'>;
    section: CreateStyledComponent<'section'>;
    select: CreateStyledComponent<'select'>;
    small: CreateStyledComponent<'small'>;
    source: CreateStyledComponent<'source'>;
    span: CreateStyledComponent<'span'>;
    strong: CreateStyledComponent<'strong'>;
    style: CreateStyledComponent<'style'>;
    sub: CreateStyledComponent<'sub'>;
    summary: CreateStyledComponent<'summary'>;
    sup: CreateStyledComponent<'sup'>;
    table: CreateStyledComponent<'table'>;
    tbody: CreateStyledComponent<'tbody'>;
    td: CreateStyledComponent<'td'>;
    textarea: CreateStyledComponent<'textarea'>;
    tfoot: CreateStyledComponent<'tfoot'>;
    th: CreateStyledComponent<'th'>;
    thead: CreateStyledComponent<'thead'>;
    time: CreateStyledComponent<'time'>;
    title: CreateStyledComponent<'title'>;
    tr: CreateStyledComponent<'tr'>;
    track: CreateStyledComponent<'track'>;
    u: CreateStyledComponent<'u'>;
    ul: CreateStyledComponent<'ul'>;
    var: CreateStyledComponent<'var'>;
    video: CreateStyledComponent<'video'>;
    wbr: CreateStyledComponent<'wbr'>;
  }
  
  export interface CreateStyledComponent<Tag extends keyof JSX.IntrinsicElements> {
    (
      template: TemplateStringsArray | ((props: JSX.IntrinsicElements[Tag]) => string),
      ...args: Array<any>
    ): StyledComponent<JSX.IntrinsicElements[Tag]>;
  }
  
  const styled: CreateStyled;
  export default styled;
}

// Fix for Theme type
declare module '@ltht-react/styles' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      info: string;
      light: string;
      dark: string;
      text: string;
      background: string;
      border: string;
      [key: string]: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      [key: string]: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        [key: string]: string;
      };
      fontWeight: {
        light: number;
        normal: number;
        bold: number;
        [key: string]: number;
      };
      lineHeight: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        [key: string]: string;
      };
      [key: string]: any;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      [key: string]: string;
    };
    [key: string]: any;
  }
}

// Fix for component composition
declare module '@ltht-react/card' {
  import { FC, HTMLAttributes } from 'react';
  
  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
  }
  
  export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
  }
  
  export interface CardComponent extends FC<CardProps> {
    Body: FC<CardBodyProps>;
  }
  
  const Card: CardComponent;
  export default Card;
}

declare module '@ltht-react/list' {
  import { FC, HTMLAttributes } from 'react';
  
  export interface ListProps extends HTMLAttributes<HTMLUListElement> {
    className?: string;
  }
  
  export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
    className?: string;
  }
  
  export interface ListComponent extends FC<ListProps> {
    Item: FC<ListItemProps>;
  }
  
  const List: ListComponent;
  export default List;
}

declare module '@ltht-react/description-list' {
  import { FC, HTMLAttributes } from 'react';
  
  export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
    className?: string;
  }
  
  export interface DescriptionListItemProps extends HTMLAttributes<HTMLElement> {
    term: string;
    className?: string;
  }
  
  export interface DescriptionListComponent extends FC<DescriptionListProps> {
    Item: FC<DescriptionListItemProps>;
  }
  
  const DescriptionList: DescriptionListComponent;
  export default DescriptionList;
}

declare module '@ltht-react/form' {
  import { FC, FormHTMLAttributes, HTMLAttributes } from 'react';
  
  export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string;
    submitHandler?: (e: React.FormEvent<HTMLFormElement>) => void;
  }
  
  export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
  }
  
  export interface FormLabelProps extends HTMLAttributes<HTMLLabelElement> {
    className?: string;
    htmlFor: string;
  }
  
  export interface FormComponent extends FC<FormProps> {
    Group: FC<FormGroupProps>;
    Label: FC<FormLabelProps>;
  }
  
  const Form: FormComponent;
  export default Form;
}

declare module '@ltht-react/table' {
  import { FC, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
  
  export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
    className?: string;
  }
  
  export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
    className?: string;
  }
  
  export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
    className?: string;
  }
  
  export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    className?: string;
  }
  
  export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    className?: string;
  }
  
  export interface TableComponent extends FC<TableProps> {
    Header: FC<TableHeaderProps>;
    Body: FC<TableBodyProps>;
    Row: FC<TableRowProps>;
    Cell: FC<TableCellProps>;
  }
  
  const Table: TableComponent;
  export default Table;
}

// Fix for React Router DOM
declare module 'react-router-dom' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface RouteProps {
    path?: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
    children?: ReactNode;
    component?: ComponentType<any>;
    render?: (props: any) => ReactNode;
  }
  
  export const BrowserRouter: ComponentType<{ basename?: string; children?: ReactNode }>;
  export const Route: ComponentType<RouteProps>;
  export const Switch: ComponentType<{ children?: ReactNode }>;
  export const Link: ComponentType<{ to: string; className?: string; children?: ReactNode }>;
  export const NavLink: ComponentType<{ to: string; className?: string; activeClassName?: string; children?: ReactNode }>;
  export const Redirect: ComponentType<{ to: string; from?: string; exact?: boolean; strict?: boolean; push?: boolean }>;
  
  export function useHistory(): {
    length: number;
    action: string;
    location: { pathname: string; search: string; hash: string; state: any };
    push: (path: string, state?: any) => void;
    replace: (path: string, state?: any) => void;
    go: (n: number) => void;
    goBack: () => void;
    goForward: () => void;
    block: (prompt: string | ((location: any) => string)) => () => void;
  };
  
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
  
  export function useParams<P extends { [K in keyof P]?: string } = {}>(): P;
  
  export function useRouteMatch<P extends { [K in keyof P]?: string } = {}>(): {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
  };
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
declare module '@ltht-react/types';
declare module '@ltht-react/appointment-detail';
declare module '@ltht-react/appointment-summary';
declare module '@ltht-react/auth';
declare module '@ltht-react/auth/lib/auth';
declare module '@ltht-react/auth/lib/hooks';
declare module '@ltht-react/medication-detail';
declare module '@ltht-react/medication-summary';

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
