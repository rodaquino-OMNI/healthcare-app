/**
 * Global TypeScript fixes for JSX element type errors
 */

// Fix React module imports
declare module 'react' {
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
  }
  
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const useRef: any;
  export const useContext: any;
  export const useMemo: any;
  export const createContext: any;
}

// Fix for styled components JSX element type errors
declare namespace JSX {
  interface IntrinsicElements {
    // Allow any custom element to be used in JSX
    [elemName: string]: any;
  }
}

// Fix for React imports in ECMAScript modules
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
  }
}
