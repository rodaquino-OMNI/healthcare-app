// React type augmentation
// This file properly augments React types without redefining the entire module

import 'react';

// Augment the React module with any missing exports
declare module 'react' {
  // Ensure React.FC is properly defined
  export type FC<P = {}> = FunctionComponent<P>;
  export type FunctionComponent<P = {}> = React.ComponentType<P>;
  
  // Ensure React hooks are properly exported
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useState<T = undefined>(): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
  
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  
  export function useContext<T>(context: React.Context<T>): T;
  
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I & React.ReducerState<R>,
    initializer: (arg: I & React.ReducerState<R>) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initializerArg: React.ReducerState<R>,
    initializer?: undefined
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  
  // Ensure event types are properly exported
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {
    currentTarget: EventTarget & T;
  }
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  }
  
  export interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }
  
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, NativeKeyboardEvent> {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  }
}
