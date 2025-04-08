/**
 * React module declaration fix
 *
 * This file fixes the TypeScript errors related to named imports from React
 * by providing explicit type declarations without circular references.
 */

declare module 'react' {
  // Simple non-circular approach for React imports
  // Do NOT export * from 'react' here - causes circularity
  
  // Named exports
  export const useState: <T>(initialState: T | (() => T)) => [T, (state: T) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export const useContext: <T>(context: React.Context<T>) => T;
  export const createContext: <T>(defaultValue: T) => React.Context<T>;
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
  export const useMemo: <T>(factory: () => T, deps: any[] | undefined) => T;
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useReducer: <S, A>(reducer: (state: S, action: A) => S, initialState: S) => [S, (action: A) => void];
  export const Fragment: React.ReactFragment;
  export const Component: typeof React.Component;
  export const Suspense: React.ComponentType<{ fallback?: React.ReactNode }>;
  export const lazy: <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) => T;
  export const memo: <T extends React.ComponentType<any>>(component: T) => T;
  export const forwardRef: <T, P>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null) => React.ComponentType<P & { ref?: React.Ref<T> }>;
  
  // Export React event types
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {}
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {}
  
  // Base event type
  export interface SyntheticEvent<T = Element> {
    currentTarget: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
    type: string;
  }
  
  // Export React component types
  export type FC<P = {}> = React.FC<P>;
  export type FunctionComponent<P = {}> = React.FunctionComponent<P>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;
  export type CSSProperties = React.CSSProperties;
  export type RefObject<T> = { readonly current: T | null };
  export type MutableRefObject<T> = { current: T };
  export type Ref<T> = RefObject<T> | ((instance: T | null) => void) | null;
  export type Context<T> = React.Context<T>;
  export type Provider<T> = React.Provider<T>;
  export type Consumer<T> = React.Consumer<T>;
  
  // Default export
  const React: any;
  export default React;
}